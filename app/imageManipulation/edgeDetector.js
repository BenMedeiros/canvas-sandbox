'use strict';

export default function detect(imageData, direction) {
  const data = imageData.data;
  const height = imageData.height;
  const width = imageData.width;

  // create grayscale
  const dataGrays = new Array(data.length / 4);
  for (let i = 0; i < dataGrays.length; i++) {
    dataGrays[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  }

  let sorbelFn = null;
  const directionInt = direction === 'left' || direction === 'up' ? -1 : 1;
  if (direction === 'right' || direction === 'left') {
    sorbelFn = (x, y) => {
      return directionInt * (dataGrays[(y - 1) * width + (x + 1)] - dataGrays[(y - 1) * width + (x - 1)]
        + 2 * dataGrays[(y) * width + (x + 1)] - 2 * dataGrays[(y) * width + (x - 1)]
        + dataGrays[(y + 1) * width + (x + 1)] - dataGrays[(y + 1) * width + (x - 1)]);
    };
  } else if (direction === 'up' || direction === 'down') {
    sorbelFn = (x, y) => {
      return directionInt * (dataGrays[(y + 1) * width + (x - 1)] - dataGrays[(y - 1) * width + (x - 1)]
        + 2 * dataGrays[(y + 1) * width + (x)] - 2 * dataGrays[(y - 1) * width + (x)]
        + dataGrays[(y + 1) * width + (x + 1)] - dataGrays[(y - 1) * width + (x + 1)]);
    };
  } else {
    throw new Error('Direction must be up/down/left/right');
  }

  let minSorbel = 0;
  let maxSorbel = 0;
  // ignore border of picture since 3x3 sorbel
  for (let y = 1; y < height - 2; y++) {
    for (let x = 1; x < width - 2; x++) {
      //sorbel could be min/max of +/- 4 * 255, if moving from black to white
      let edgeSorbel = sorbelFn(x, y) / 4;

      if (edgeSorbel < minSorbel) {
        minSorbel = edgeSorbel;
        console.log('min', minSorbel);
      }
      if (edgeSorbel > maxSorbel) {
        maxSorbel = edgeSorbel;
        console.log('max', maxSorbel);
      }

      data[4 * (y * width + x)] = edgeSorbel;
      data[4 * (y * width + x) + 1] = edgeSorbel;
      data[4 * (y * width + x) + 2] = edgeSorbel;
    }
  }
}


