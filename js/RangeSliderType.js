'use strict';

export class RangeSliderType {
  element = null;
  parentsElements = [];

  constructor(name, min, max, value) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.value = value;
    this.inputUpdateFnRunning = false;
  }

  createElementIn(parentEl, inputUpdateFn) {
    if (this.parentsElements.indexOf(parentEl) !== -1) {
      console.error('Already exists in this element', this);
    }

    const divEl = document.createElement("div");

    const labelEl = document.createElement("label");
    labelEl.htmlFor = this.name;
    labelEl.innerText = this.name;
    divEl.appendChild(labelEl);

    const inputEl = document.createElement("input");
    inputEl.type = 'range';
    inputEl.id = this.name;
    // inputEl.name = this.name;
    inputEl.min = this.min;
    inputEl.max = this.max;
    inputEl.value = this.value;

    divEl.appendChild(inputEl);
    this.element = inputEl;

    const inputTextEl = document.createElement("span");
    inputTextEl.textContent = this.value;
    divEl.appendChild(inputTextEl);

    parentEl.appendChild(divEl);
    this.parentsElements.push(parentEl);

    inputEl.addEventListener("input", (event) => {
      inputTextEl.textContent = event.target.value;
      if(this.inputUpdateFnRunning){
        console.log('update alrady running');
      }else{
        this.inputUpdateFnRunning = true;
        inputUpdateFn();
        console.log('completed input update fn', this.getValue());
        this.inputUpdateFnRunning = false;
      }
    });

  }

  getValue() {
    return this.element.value;
  }
}
