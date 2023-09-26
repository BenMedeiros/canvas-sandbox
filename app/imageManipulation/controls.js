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
    if (r > data[i] && g > data[i+1] && b > data[i+2]) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }else{
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
