import { LightningElement, api, track } from 'lwc';

// Constants
const DEATH_LINK = 'javascript:void(0)';

// LWC
export default class EvoMessageList extends LightningElement {
  @track _data; // object: data used to render

  /**
   * Items data setter/getter
   */
  @api
  get data() {
    return this._data;
  }

  set data(data) {
    // Validate data
    if (typeof data !== 'object') {
      console.error('Evo Message List: Invalid Data object.');
      return;
    }

    // Deep copy data
    data = JSON.parse(JSON.stringify(data));
    if (this.validateData(data)) {
      this.prepareData(data);
      this._data = data;
    }
  }

   /**
   * Validates/modifies the object data to avoid setting invalid values.
   * @param {Object} data Object data
   * @returns {boolean} true: data is valid / false: data is invalid
   */
   validateData(data) {
    // Cheking 'messages' array. In case that there are no messages, it should be an empty array
    if(!Array.isArray(data.messages)) {
      console.error(`Evo Message List: Invalid 'messages' array`);
      return false;
    }
    
    for (const msg of data.messages) {
      // Checking 'read' format
      if (typeof msg.read !== 'boolean') {
        console.error(`Evo Message List: Invalid 'read' boolean`);
        return false;
      }

      // Cheking 'date' format
      const date = new Date(msg.date);
      if (isNaN(date)) {
        console.error(`Evo Message List: Invalid 'date' format`);
        return false;
      }
    }

    return true;
   }

  /**
   * Prepare data to be rendered
   * @param {Object} data Items data
   */
  prepareData(data) {
    // // Table heading level
    // data.headingLevel = parseInt(data.headingLevel);
    // if (!(data.headingLevel >= 1)) {
    //   console.warn(`Evo Message List: 'headingLevel' set to default value.`);
    //   data.headingLevel === 3;
    // }

    // Date format. This format was selected to make all dates the same length
    var intlDateFormat = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    data.messages.forEach(msg => {
      msg.date = intlDateFormat.format(new Date(msg.date));
      msg.unreadClass = msg.read ? 'evo-message-list__table-row': 'evo-message-list__table-row evo-message-list__table-row_unread';
    });
  }

  /**
   * Connected callback hook used to set the viewport variables
   */
  // connectedCallback() {
  // }

  /**
   * Disconnected callback hook used to remove event listeners
   */
  // disconnectedCallback() {
  // }

  /**
   * Rendered callback hook used to post processing
   */
  // renderedCallback() {
  // }



  /**
   * Listener for clicks to open messages
   * @param {MouseEvent} event
   */
  handleMsgClick(event) {
    event.preventDefault();
  }
}