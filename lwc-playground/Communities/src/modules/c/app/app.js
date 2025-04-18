import { LightningElement } from 'lwc';
import msgCenterData from './data/data_evoMessageCenter.js';
import navData from './data/data_evoNavigation.js';
import msgListDataData from './data/data_evoMessageList.js';
import * as datatableData from './data/data_datatable.js';

export default class App extends LightningElement {
  // static renderMode = 'light'; // the default is 'shadow'

  handleEvent(event) {
    console.group(`Parent Handle Event`);
    console.log(event);
    console.groupEnd();
  }

  _msgCenterData = msgCenterData;
  _navData = navData;
  _msgListDataData = msgListDataData;

  _columnsDetails = datatableData.columnsDetails;
  _clientData = datatableData.clientData;

}