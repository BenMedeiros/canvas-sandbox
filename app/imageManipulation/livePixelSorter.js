'use strict';

//keep track of how many swaps occurred in this cycle
let countSwaps = 0;
let totalSwaps = 0;

const red = 0;
const green = 1;
const blue = 2;
const alpha = 3;

/* move the pixels around sorting the rbg w/b to different parts of the image
 basically a color histogram
* */
export default function main(imageData) {
  const mode = false;
  countSwaps = 0;
  const colorX = green;
  const colorY = blue;

  if (mode) {
    //do even columns
    shiftByColor(imageData, 0, 0, colorX, colorY);
//  do odd columns (aka starting from 1 pixel shifted
    shiftByColor(imageData, 1, 0, colorX, colorY);
//
    shiftByColor(imageData, 0, 1, colorX, colorY);
//  do odd columns (aka starting from 1 pixel shifted
    shiftByColor(imageData, 1, 1, colorX, colorY);
//
  } else {
    //do even columns
    shiftByColor2D(imageData, 0, 0, red, green, blue, alpha);
//  do odd columns (aka starting from 1 pixel shifted
    shiftByColor2D(imageData, 1, 0, red, green, blue, alpha);
//
    shiftByColor2D(imageData, 0, 1, red, green, blue, alpha);
//  do odd columns (aka starting from 1 pixel shifted
    shiftByColor2D(imageData, 1, 1, red, green, blue, alpha);
//
  }
  totalSwaps += countSwaps;
  console.log('swaps', countSwaps, Math.round(totalSwaps / 10 ** 6) + 'M');
  return countSwaps;
}

function shiftByColor(imageData, startX, startY, colorX, colorY) {
  //shift compared two pixels and sort, skip odd so that single pixel isn't shifted
  // by more than 1 position
  // 8 - 4 per pixel, only look at even pixels to their odd

  let i = 0;
  //look at a chunk of 4 pixels and sort them
  for (let y = startY; y < imageData.height - 1; y += 2) {
    for (let x = startX; x < imageData.width - 1; x += 2) {
      i = 4 * (y * imageData.width + x);
      if (imageData.data[i + colorX] > imageData.data[i + colorX + 4]) {
        //swap with next col
        swapColors(imageData.data, i, i + 4);
      }

      // putting different color sorts on the x/y create loops unless you elseif

      if (imageData.data[i + colorY] > imageData.data[i + colorY + (4 * imageData.width)]) {
        //swap with next row
        swapColors(imageData.data, i, i + (4 * imageData.width));
      }
    }
  }
}

function shiftByColor2D(imageData, startX, startY, colorX0, colorX1, colorY0, colorY1) {
  let i = 0;
  let colorDiffX0 = 0;
  let brightDiffX = 0;
  //look at a chunk of 4 pixels and sort them
  for (let y = startY; y < imageData.height - 1; y += 2) {
    for (let x = startX; x < imageData.width - 1; x += 2) {
      i = 4 * (y * imageData.width + x);
      colorDiffX0 = imageData.data[i + colorX0] - imageData.data[i + colorX0 + 4];

      if (colorDiffX0 > 0) {
        //swap with next col
        swapColors(imageData.data, i, i + 4);
      } else if (colorDiffX0 < 0) {
        //  do nothing since its sorted
      } else if (imageData.data[i + colorX1] < imageData.data[i + colorX1 + 4]) {
        //if tied, check on the x2 color
        swapColors(imageData.data, i, i + 4);
      }

      //move highest X0 X1 brightness to bottom
      brightDiffX = (imageData.data[i + colorX0] - imageData.data[i + colorX0 + (4 * imageData.width)])
        + (imageData.data[i + colorX1] - imageData.data[i + colorX1 + (4 * imageData.width)])
      if (brightDiffX > 0) {
        //swap with next row
        swapColors(imageData.data, i, i + (4 * imageData.width));
      }
    }
  }
}

// stores data in motion
let pixelDataTmp = [0, 0, 0, 0];

function swapColors(data, pixelIndex1, pixelIndex2) {
  countSwaps++;

  pixelDataTmp[0] = data[pixelIndex1];
  pixelDataTmp[1] = data[pixelIndex1 + 1];
  pixelDataTmp[2] = data[pixelIndex1 + 2];
  pixelDataTmp[3] = data[pixelIndex1 + 3];

  data[pixelIndex1] = data[pixelIndex2];
  data[pixelIndex1 + 1] = data[pixelIndex2 + 1];
  data[pixelIndex1 + 2] = data[pixelIndex2 + 2];
  data[pixelIndex1 + 3] = data[pixelIndex2 + 3];

  data[pixelIndex2] = pixelDataTmp[0];
  data[pixelIndex2 + 1] = pixelDataTmp[1];
  data[pixelIndex2 + 2] = pixelDataTmp[2];
  data[pixelIndex2 + 3] = pixelDataTmp[3];
}
