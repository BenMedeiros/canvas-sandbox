'use strict';

import {
  blackAndWhite,
  clearOutputCanvas,
  filterColor,
  pixelate,
  productSmallPixelated,
  scaleCanvasTiny
} from "../app/imageManipulation/controls.js";

import * as reduceColorBit from "../app/imageManipulation/reduceColorBit.js";
import {LabelInputType} from "./LabelInputType.js";
import {trackFileUpload} from "../app/src/fileHandler.js";

console.log('main.js loaded');

function createButton(fn, settingLabelInputs) {
  const btnEl = document.createElement("button");
  btnEl.id = fn.name;
  btnEl.name = fn.name;
  btnEl.innerText = fn.name;

  document.getElementById('controls').appendChild(btnEl);
  if (settingLabelInputs && Array.isArray(settingLabelInputs)) {
    btnEl.onclick = () => createControlDetailsSection(fn, settingLabelInputs);
  } else {
    // simple click, no settings
    btnEl.onclick = fn;
  }

  return btnEl;
}

// save the element if it's been created to remove it when its not used
let controlDetailsElement = null;

function createControlDetailsSection(fn, labelInputs) {

  const div = document.createElement("div");
  div.id = 'control-details';

  const h3 = document.createElement("h3");
  h3.innerText = fn.name;
  div.appendChild(h3);

  for (const labelInput of labelInputs) {
    labelInput.createElementIn(div);
  }

  const btnEl = document.createElement("button");
  btnEl.innerText = 'Update';
  btnEl.onclick = () => {
    let fnBinded = fn;
    for (const labelInput of labelInputs) {
      fnBinded = fnBinded.bind(null, labelInput.getValue());
    }
    fnBinded();
  };
  div.appendChild(btnEl);

  if (controlDetailsElement) controlDetailsElement.remove();
  document.getElementById('controls').appendChild(div);
  controlDetailsElement = div;

}

function createControls() {
  createButton(scaleCanvasTiny, [
    new LabelInputType('scale', 'number', 'Scale %', null, 10)
  ]);
  createButton(clearOutputCanvas);
  createButton(filterColor, [
    new LabelInputType('red', 'checkbox', 'Red', true),
    new LabelInputType('green', 'checkbox', 'Green', false),
    new LabelInputType('blue', 'checkbox', 'Blue', false),

  ]);
  createButton(blackAndWhite, [
    new LabelInputType('red', 'number', 'Red', 50),
    new LabelInputType('green', 'number', 'Green', 50),
    new LabelInputType('blue', 'number', 'Blue', 50),

  ]);
  createButton(pixelate, [
    new LabelInputType('pixelSize', 'number', 'Pixel Size', 10, 10),
    new LabelInputType('xOffset', 'number', 'X Offset', 0),
    new LabelInputType('yOffset', 'number', 'Y Offset', 0 )
  ]);
  createButton(productSmallPixelated, []);


}


createControls();
trackFileUpload();
