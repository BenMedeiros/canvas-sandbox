'use strict';

// @edgeClampFactor - factor of 4 ensures 255 max, lower factors will clip lower magtitudes as higher
export default function detect(imageData, direction, edgeClampFactor = 4) {
  const data = imageData.data;
  const height = imageData.height;
  const width = imageData.width;

  // create grayscale
  const dataGrays = new Array(data.length / 4);
  for (let i = 0; i < dataGrays.length; i++) {
    dataGrays[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  }

  let sorbelFn = null;

  const rightSorbel = (x, y) => {
    return (dataGrays[(y - 1) * width + (x + 1)] - dataGrays[(y - 1) * width + (x - 1)]
      + 2 * dataGrays[(y) * width + (x + 1)] - 2 * dataGrays[(y) * width + (x - 1)]
      + dataGrays[(y + 1) * width + (x + 1)] - dataGrays[(y + 1) * width + (x - 1)]);
  };

  const downSorbel = (x, y) => {
    return (dataGrays[(y + 1) * width + (x - 1)] - dataGrays[(y - 1) * width + (x - 1)]
      + 2 * dataGrays[(y + 1) * width + (x)] - 2 * dataGrays[(y - 1) * width + (x)]
      + dataGrays[(y + 1) * width + (x + 1)] - dataGrays[(y - 1) * width + (x + 1)]);
  };

  if (direction === 'right') {
    sorbelFn = rightSorbel;
  } else if (direction === 'left') {
    sorbelFn = (x, y) => -1 * rightSorbel(x, y);
  } else if (direction === 'down') {
    sorbelFn = downSorbel;
  } else if (direction === 'up') {
    sorbelFn = (x, y) => -1 * downSorbel(x, y);
  } else {
    return angleSorbel(data, height, width, rightSorbel, downSorbel, edgeClampFactor);
  }

  // ignore border of picture since 3x3 sorbel
  for (let y = 1; y < height - 2; y++) {
    for (let x = 1; x < width - 2; x++) {
      //sorbel could be min/max of +/- 4 * 255, if moving from black to white
      let edgeSorbel = sorbelFn(x, y) / edgeClampFactor;

      data[4 * (y * width + x)] = edgeSorbel;
      data[4 * (y * width + x) + 1] = edgeSorbel;
      data[4 * (y * width + x) + 2] = edgeSorbel;
    }
  }
}

function angleSorbel(data, height, width, rightSorbel, downSorbel, edgeClampFactor) {
  const deg120 = Math.PI * 2 / 3;
  const neg120 = -1 * deg120;

  // ignore border of picture since 3x3 sorbel
  for (let y = 1; y < height - 2; y++) {
    for (let x = 1; x < width - 2; x++) {
      //sorbel could be min/max of +/- 4 * 255, if moving from black to white

      let u = rightSorbel(x, y) / edgeClampFactor;
      let v = downSorbel(x, y) / edgeClampFactor;
      let magnitude = Math.hypot(u, v);
      let angle = Math.atan2(v, u);
      //returns -pi to pi
      if (magnitude > 150) {
        console.log(magnitude, angle * 180 / Math.PI);
      }

      // all colors are clamped with +-120deg width
      // red is 0deg, so just u portion
      data[4 * (y * width + x)] = angle < deg120 && neg120 < angle ? u : 0;
      // green is 120deg
      data[4 * (y * width + x) + 1] = 0 > angle && angle > neg120 ? 0 : magnitude * Math.cos(angle - deg120);
      // blue is -120deg
      data[4 * (y * width + x) + 2] = 0 < angle && angle < deg120 ? 0 : magnitude * Math.cos(angle + deg120);
    }
  }
}


