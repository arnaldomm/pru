import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import App from 'c/app';

const elm = createElement('c-app', { is: App });
document.body.insertBefore(elm, document.body.firstElementChild);