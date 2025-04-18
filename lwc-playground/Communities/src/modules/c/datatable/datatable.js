import { LightningElement, api } from 'lwc';

export default class Datatable extends LightningElement {
  // static renderMode = 'light'; // the default is 'shadow'

  _clientsData;
  _columnsDetails;
  _ascendingSort = true;
  _pageNumber = 1;
  _recordsToDisplay = []; // Data used for rendering the <tbody> cells

  @api theme; // string newport/lightning

  @api
  get clientdata() {
    return this._clientsData
  }
  set clientdata(data) {
    // TODO - validation and data formatting here
    data = JSON.parse(JSON.stringify(data));
    this._clientsData = data;
  }

  @api
  get columns() {
    return this._columnsDetails;
  }
  set columns(data) {
    // TODO - validation and data formatting here
    data = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < data.length; i++) {
      data[i].key = i
    }
    this._columnsDetails = data;
  }

  /**
   * Get the the sort direction
   */
  @api
  get sortdirection() {
    return this._ascendingSort ? 'Ascending' : 'Descending';
  }
  
  /**
   * Set sort direction
   * @param {string} value "Ascending"|"Descending" and it is case INsensitive
   */
  set sortdirection(value) {
    if(typeof value === 'string') {
      value = value.toUpperCase();
      if (value === 'ASCENDING') {
        this._ascendingSort = true;
      } else if (value === 'DESCENDING') {
        this._ascendingSort = false;
      } else {
        console.warn(`Invalid value assigned to sortdirection!\nString should be equal to "Ascending" or "Descending" and it is case insensitive.`);
      }
    } else {
      console.warn(`Invalid value assigned to sortdirection!\nsortdirection expect an string.`);
    }
  }

  /**
   * Get page number that is being displayed
   */
  @api
  get pageno() {
    return this._pageNumber;
  }

  /**
   * Set page number that will be displayed
   * @param {number|string} value whole number of the page to be displayed
   */
  set pageno(value) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    if (!isNaN(value) && value >=1) {
      this._pageNumber = Math.trunc(value);
    } else {
      console.warn(`Invalid value assigned to pageno!\npageno expect a number or string representing a valid number and it must be greather or equal than 1.`)
    }
  }

  /**
   * Component is connected and public variables updated
   */
  connectedCallback() {
    this.prepareData();
  }

  /**
   * Prepare data to render HTML
   */
  prepareData() {
    for (let i = 0; i < this._clientsData.length; i++) {
      const clientData = this._clientsData[i];
      const rowDetails = {
        key: i, // used in the HTML for each row
        value: [] // store info for cells in one row
      };
      for (let j = 0; j < this._columnsDetails.length; j++) {
        const columnDetail = this._columnsDetails[j];
        rowDetails.value.push({
          key: j, // used in the HTML for each cell inside a row
          label: columnDetail.label,
          value: this.formatCellValues(clientData[columnDetail.fieldName], columnDetail.type, columnDetail.typeAttributes)
          // TODO - add more needed details here
        })
      }
      this._recordsToDisplay.push(rowDetails);
    }
  }

  /**
   * Prepare cell values to display
   * @param {*} value 
   * @param {*} type 
   * @param {*} typeAttributes 
   */
  formatCellValues(value, type, typeAttributes) {
    switch (type) {
      case 'date':
      case 'date-local':
        const date = new Date(value);
        value = date.toLocaleDateString('en-US', typeAttributes ? typeAttributes : undefined)
        break;
      case 'number':
        
        break;
      case 'currency':
        const temp = parseFloat(value);
        value = `${(temp < 0 ? '-' : '')}$${Math.abs(value).toFixed(2)}`; // TODO - need to use the typeAttributes
        break;
      case 'percent':
        value = `%${value}`; // TODO - need to use the typeAttributes
        break;
      case 'url':
        
        break;
      case 'button':
        
        break;
    }

    return value;
  }

  // renderedCallback() {
  //   console.log(`renderedCallback(Datatable)`);
  // }
}