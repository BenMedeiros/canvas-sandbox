import edgeDetector from "./edgeDetector.js";
import grayscale from "./grayscale.js";
import livePixelSorter from "./livePixelSorter.js";

export function scaleCanvasTiny(scale) {
  console.log('scaleCanvasTiny', scale);
  scale /= 100;
  ctxOutput.drawImage(canvas, canvas.width - canvas.width * scale, canvas.height - canvas.height * scale,
    canvas.width * scale, canvas.height * scale);
}

export function clearOutputCanvas() {
  ctxOutput.fillStyle = "rgb(195,184,184)";
  ctxOutput.fillRect(0, 0, canvasOutput.width, canvasOutput.height);
}

export function filterColor(red, green, blue) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (!red) data[i] = 0;
    if (!green) data[i + 1] = 0;
    if (!blue) data[i + 2] = 0;
  }

  ctxOutput.putImageData(imageData, 0, 0);
}

export function blackAndWhite(r, g, b) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (r > data[i] && g > data[i + 1] && b > data[i + 2]) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  ctxOutput.putImageData(imageData, 0, 0);
}

export function productSmallPixelated() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const pixelSize = 10;

  const smallerImageData = ctx.createImageData(canvas.width / pixelSize, canvas.height / pixelSize);
  const smallData = smallerImageData.data;

  for (let x = 0; x < imageData.width / pixelSize; x++) {
    for (let y = 0; y < imageData.height / pixelSize; y++) {
      for (let j = 0; j < pixelSize; j++) {
        for (let i = 0; i < pixelSize; i++) {
          let rootPixel = (x * pixelSize) + (y * pixelSize * imageData.width);
          let pixelOffset = (x * pixelSize + i) + ((y * pixelSize + j) * imageData.width);

          smallData[4 * (x + y * smallerImageData.width)] = data[4 * rootPixel];
          smallData[4 * (x + y * smallerImageData.width) + 1] = data[4 * rootPixel + 1];
          smallData[4 * (x + y * smallerImageData.width) + 2] = data[4 * rootPixel + 2];
          smallData[4 * (x + y * smallerImageData.width) + 3] = data[4 * rootPixel + 3];
        }
      }
    }
  }

  ctxOutput.putImageData(smallerImageData, 0, 0);
}

export function pixelate(pixelSize, xOffset, yOffset) {
  if (pixelSize === 0) throw new Error('0 not allowed');
  if (pixelSize !== parseInt(pixelSize)) throw new Error('Must be integer');
  if (xOffset !== parseInt(xOffset)) throw new Error('Must be integer');
  if (yOffset !== parseInt(yOffset)) throw new Error('Must be integer');

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let x = 0; x < imageData.width / pixelSize; x++) {
    for (let y = 0; y < imageData.height / pixelSize; y++) {
      for (let j = 0; j < pixelSize; j++) {
        for (let i = 0; i < pixelSize; i++) {
          let rootPixel = (x * pixelSize + xOffset) + (y * pixelSize * imageData.width + yOffset);
          let pixelOffset = (x * pixelSize + i) + ((y * pixelSize + j) * imageData.width);

          data[4 * pixelOffset] = data[4 * rootPixel];
          data[4 * pixelOffset + 1] = data[4 * rootPixel + 1];
          data[4 * pixelOffset + 2] = data[4 * rootPixel + 2];
          data[4 * pixelOffset + 3] = data[4 * rootPixel + 3];
        }
      }
    }
  }

  ctxOutput.putImageData(imageData, 0, 0);
}


export function bindCanvas(canvas_, canvasOutput_) {
  canvas = canvas_;
  ctx = canvas.getContext("2d");
  canvasOutput = canvasOutput_;
  ctxOutput = canvasOutput.getContext("2d");

}

export function edgeDetection(direction, edgeClampFactor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  edgeDetector(imageData, direction, edgeClampFactor);
  ctxOutput.putImageData(imageData, 0, 0);
}

export function addGrayScale() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  grayscale(imageData);
  ctxOutput.putImageData(imageData, 0, 0);
}

export function sortPixels() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const callPixelSorter = () => {
    if (livePixelSorter(imageData) > 0) {
      setTimeout(callPixelSorter, 20);
      ctxOutput.putImageData(imageData, 0, 0);
    }
  }
  callPixelSorter();
}


let canvas = null;
let ctx = null;
let canvasOutput = null;
let ctxOutput = null;
//
// ctx.imageSmoothingEnabled = true;
// ctx.imageSmoothingQuality = 'high';
// console.log(ctx.imageSmoothingQuality);

// const bounding = canvas.getBoundingClientRect();


// loadImageToFit('/img/004.png');


// https://lfiwccnp51.execute-api.us-west-2.amazonaws.com/default/lamda_test_template_restful?TableName=items


async function postItems(items) {
  try {
    const response = await fetch(
      // "https://lfiwccnp51.execute-api.us-west-2.amazonaws.com/default/lamda_test_template_restful?"
      // + new URLSearchParams({TableName: 'items'}), {

      "https://lfiwccnp51.execute-api.us-west-2.amazonaws.com/default/lamda_test_template_restful", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "TableName": "items",
            "Item": {
              "id": "all_items",
              "items": items
            }
          }
        )
      }
    );

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

const items = [
  [2751, 'ACTIVE YEAST', 3.95],
  [261105, 'KS PEPPER GR', 3.99],
  [261104, 'KS MED SALT', 3.49],
  [32911, 'KS VANILLA', 5.99],
  [32911, 'KS VANILLA', 5.99],
  [32911, 'KS VANILLA', 5.99],
  [32911, 'KS VANILLA', 5.99],
  [15306, 'MRM ANTIPSTO', 4.97]
]


postItems(items.map(el => {
  return {
    sku: el[0],
    name: el[1],
    price: el[2]
  }
})).then();
