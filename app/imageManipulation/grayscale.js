'use strict';

export default function grayscale(imageData) {
  const data = imageData.data;
  const height = imageData.height;
  const width = imageData.width;

  // create grayscale
  const dataGrays = new Array(data.length / 4);
  for (let i = 0; i < dataGrays.length; i++) {
    dataGrays[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  }


  for (let x = 0; x < width - 1; x++) {
    for (let y = 0; y < height - 1; y++) {
      data[4 * (y * width + x)] = dataGrays[y * width + x];
      data[4 * (y * width + x) + 1] = dataGrays[y * width + x];
      data[4 * (y * width + x) + 2] = dataGrays[y * width + x];
    }
  }
}


