'use strict';

function countRGB(colorsMap, r, g, b) {
  if (colorsMap[r] === undefined) colorsMap[r] = {};
  if (colorsMap[r][g] === undefined) colorsMap[r][g] = {};
  if (colorsMap[r][g][b] === undefined) colorsMap[r][g][b] = 0;
  colorsMap[r][g][b] = colorsMap[r][g][b] + 1;
}

//group the popular colors by thresholds
//currently looks within a 5x5x5 color gamut, but could probably do a circular edge check
function reducePopularColors(thisColor, savedColors, threshold) {
  for (const saved of savedColors) {
    if (Math.pow(saved.r - thisColor.r, 2) + Math.pow(saved.g - thisColor.g, 2)
      + Math.pow(saved.b - thisColor.b, 2) < threshold) {
      saved.count += thisColor.count;
      return;
    }
  }
//  if no color match found, save as a new color
  savedColors.push(thisColor);
}

//returns a reduced list of colors that should be used for color matching
function loopPopularColors(colorsMap) {
  const popularColorCountThreshold = 5;
  const popularColors = [];

  for (const [r, gbObj] of Object.entries(colorsMap)) {
    for (const [g, bObj] of Object.entries(gbObj)) {
      for (const [b, count] of Object.entries(bObj)) {
        if (count > popularColorCountThreshold) {
          popularColors.push({r: Number(r), g: Number(g), b: Number(b), count});
        }
      }
    }
  }

  //sort first so that the most popular color is taken as true color for grouping
  popularColors.sort((a, b) => b.count - a.count);
  // console.log(popularColors);

  const reducedPopularColors = [];
  for (const popColor of popularColors) {
    reducePopularColors(popColor, reducedPopularColors, 19000);
  }

  console.log('reduced', reducedPopularColors);
  return reducedPopularColors;
}

export function simplifyTone(ctxOutput, imageData, pixelSize) {
  //rgb lookup to count all colors
  const colorsMap = {};
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    countRGB(colorsMap, data[i], data[i + 1], data[i + 2]);
  }

  // ctxOutput.putImageData(imageData, 0, 0);

  // console.log(colorsMap);
  const savedColors = loopPopularColors(colorsMap);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i];
    data[i + 1] = data[i + 1];
    data[i + 2] = data[i + 2];
    data[i + 3] = data[i + 3];
    getClosestColorMatch(savedColors, data, i)
  }

  ctxOutput.putImageData(imageData, 0, 0);
}

//data is imageData, colors are custom format
function getClosestColorMatch(colors, data, i) {
  let closestColor = null;
  let closestColorWeight = Infinity;
  for (const color of colors) {
    let colorWeight = Math.pow(color.r - data[i], 2) + Math.pow(color.g - data[i + 1], 2)
      + Math.pow(color.b - data[i + 2], 2);
    if (colorWeight < closestColorWeight) {
      closestColorWeight = colorWeight;
      closestColor = color;
    }
  }

  data[i] = closestColor.r;
  data[i + 1] = closestColor.g;
  data[i + 2] = closestColor.b;
}

