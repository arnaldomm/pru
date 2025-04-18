import { LightningElement } from 'lwc';

export default class SvgExample extends LightningElement {
  renderedCallback() {
    this.template.querySelector('div').innerHTML = `<svg><use xlink:href="#event" /></svg>`;
  }
}