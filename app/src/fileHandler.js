'use strict';

import {bindCanvas} from "../imageManipulation/controls.js";

export function trackFileUpload() {
  const imgEl = document.getElementById("img");

  imgEl.onload = (e) => {
    console.log(e);
  };

  imgEl.addEventListener('input', (e) => {
    deleteCanvases();

    for (const file of e.target.files) {
      loadLocalFileImage(file);
    }
  });
}

function loadLocalFileImage(file) {
  const fr = new FileReader();

  fr.onload = () => {
    const img = new Image();
    img.onload = () => createCanvasAndOutputForImg(img);
    img.src = fr.result;
  };

  fr.readAsDataURL(file);
}

function loadServerImage(src){
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;

  img.onload = () => createCanvasAndOutputForImg(img);
}

function createCanvasAndOutputForImg(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const canvasOutput = document.createElement("canvas");
  canvasOutput.width = img.width;
  canvasOutput.height = img.height;
  const div = document.createElement("div");
  div.appendChild(canvas);
  div.appendChild(canvasOutput);

  canvas.getContext("2d").drawImage(img, 0, 0);

  canvasesEl.appendChild(div);
  openCanvases.push({canvas, canvasOutput});
  bindCanvas(canvas, canvasOutput);
}

function deleteCanvases() {
  for (let i = 0; i < openCanvases.length; i++) {
    openCanvases[i].canvas.remove();
    openCanvases[i].canvasOutput.remove();
  }
}

const canvasesEl = document.getElementById("canvases");
const openCanvases = []; //map of all canvas objects and outputs

// loadServerImage('/img/004.png');
loadServerImage('/img/costco_high_quality.jpg');
