import { LightningElement, api, track } from 'lwc';

// Constants
const DEATH_LINK = 'javascript:void(0)';

// LWC
export default class EvoMessageCenter extends LightningElement {
  @track _data; // object: data used to render
  _bExpanded = false; // boolean: true if expanded / false if collapsed
  _bAnimating = false; // boolean: true if animating / false if animation is done
  _map = new Map(); // Map: used to access binds unique key generated for each item to the item data inside this._data object
  _currentKey = ''; // string: holds the key of the item that is currently active (current page menuitem)
  _media; // MediaQueryList: used to detect mobile/desktop screen size changes and also on load
  _bMobile; // boolean: current viewport - true if mobile viewport / false if desktop viewport
  _totalNewNotif; // number/boolean/null

  /**
   * bExpanded setter/getter
   */
  get bExpanded() {
    return this._bExpanded;
  }
  set bExpanded(value) {
    if (typeof value === 'boolean' && this._bExpanded !== value) {
      this._bAnimating = true;
      this._bExpanded = value;
    }
  }

  /**
   * Items data setter/getter
   */
  @api
  get msgCenterData() {
    return this._data;
  }

  set msgCenterData(data) {
    // Validate data
    if (typeof data !== 'object') {
      console.error('Evo Message Center: Invalid Data object.');
      return;
    }

    // Deep copy data
    data = JSON.parse(JSON.stringify(data));

    // Check label
    if (!data.label || typeof data.label !== 'string') console.warn('Evo Message Center: Missed label.');

    // Check zIndex
    if (data.zIndex && data.zIndex !== 'auto' && data.zIndex !== 'initial' && data.zIndex !== 'inherit') {
        data.zIndex = parseInt(data.zIndex);
        if (Number.isNaN(data.zIndex)) {
          console.warn('Evo Message Center: Invalid zIndex.');
          data.zIndex = null;
        }
    }

    if (this.validateItemsData(data.items)) {
      // Generate keys and map of items in the menu
      this.prepareItemsData(data.items);
      this._data = data;
    }
  }

  /**
   * Validates/modifies the data of the items to avoid setting invalid data.
   * @param {Array} arr Items data
   * @returns {boolean} true: data is valid / false: data is invalid
   */
  validateItemsData(arr) {
    // Check items array
    if (!Array.isArray(arr)) {
      console.error('Evo Message Center: Invalid array of items.');
      return false;
    }

    // will be set to false if invalid value is found
    var bValid = true;

    // Check items value

    // Function to validate a single link data
    const validateLink = item => {
      if (!item.text || typeof item.text !== 'string') {
        console.warn('Evo Message Center: Invalid link/button text.');
        item.text = '';
      }

      // Check href data
      if (item.href) {
        if (typeof item.href === 'object') {
          if (item.href.origin) {
            try {
              new URL(item.href.origin);
            } catch {
              console.error(`Evo Message Center: Invalid origin for ${item.text} item.`);
              bValid = false;
            }
          };
          if (item.href.pathname && typeof item.href.pathname !== 'string') {
            console.error(`Evo Message Center: Invalid pathname for ${item.text} item.`);
            bValid = false;
          }
          if (item.href.search && typeof item.href.search !== 'string') {
            console.error(`Evo Message Center: Invalid search for ${item.text} item.`);
            bValid = false;
          }
          if (item.href.hash && typeof item.href.hash !== 'string') {
            console.error(`Evo Message Center: Invalid hash for ${item.text} item.`);
            bValid = false;
          }
          if (item.href.dynamicSearchParams && typeof item.href.dynamicSearchParams !== 'boolean' && !Array.isArray(item.href.dynamicSearchParams)) {
            console.error(`Evo Message Center: Invalid dynamicSearchParams for ${item.text} item.`);
            bValid = false;
          }
          if (Array.isArray(item.href.dynamicSearchParams)) {
            for (const j of item.href.dynamicSearchParams) {
              if (typeof j !== 'string') {
                console.error(`Evo Message Center: Invalid dynamicSearchParam for ${item.text} item.`);
                bValid = false;
              }
            }
          }
        } else if (typeof item.href !== 'string') {
          console.error(`Evo Message Center: Invalid href for ${item.text} item.`);
          item.href = DEATH_LINK;
        }

        if (item.eventName) {
          console.warn('Evo Message Center: Link contains href and event. Event will be used.');
        }
      }

      // Check target
      if (item.target !== undefined && typeof item.target !== 'string') {
        console.warn(`Evo Message Center: Invalid link target for ${item.text} item.`);
        item.target = undefined;
      }

      // Check event data
      if (item.eventName) {
        if (typeof item.eventName !== 'string') {
          console.error(`Evo Message Center: Invalid eventName for ${item.text} item.`);
          bValid = false;
          item.eventName = undefined;
          item.eventDetail = undefined;
          if (!item.href) item.href = DEATH_LINK;
        }
      } else if (!item.href) {
        console.error(`Evo Message Center: No href or event specified for ${item.text} item.`);
        bValid = false;
      }
    }

    // Function to validate the new information
    const validateNew = item => {
      if (typeof item.new === 'number' && item.new >= 0) {
        item.new = parseInt(item.new);
      } else if (typeof item.new !== 'boolean' && item.new !== null) {
        console.warn(`Evo Message Center: Invalid new value for ${item.text} item.`);
        item.new = null;
      }
    }

    // Go over menu items
    for (const item of arr) {
      // Validate link data
      validateLink(item);
      validateNew(item);
    }

    return bValid;
  }

  /**
   * Generate unique keys for the items, popullates Map that uses keys to find items data, and generates hrefs
   * @param {Array} arr Items data
   */
  prepareItemsData(arr) {
    var key = 0;

    const generateKeys = arr => {
      for (const el of arr) {
        el.key = (key++).toString();
        this._map.set(el.key, el);
      }
    }
    generateKeys(arr);

    /* Option 1 - Show the amount of new notifications. This option is possible if all items.new are numbers,
     * Option 2 - If option 1 is not possible, show if there are new notifications. This option is possible if all items.new are numbers or booleans.
     * Option 3 - If option 2 is not possible, does not show any new information. This option will set all the values to null.
     */
    const generateNewInfo = arr => {
      // Detect the maximun amount of information to display.
      var capability = 'number'; // 'number' 'boolean' 'null'
      for (const el of arr) {
        if (typeof el.new === 'boolean' && capability === 'number') {
          capability = 'boolean';
        } else if (el.new === null) {
          capability = 'null';
          break;
        }
      }

      // Normalize individual values and compute this._totalNewNotif
      switch (true) {
        case capability === 'number':
          this._totalNewNotif = 0;
          for (const el of arr) {
            this._totalNewNotif += el.new;
            el.newStr = el.new.toString();
          }
          this._totalNewNotifStr = this._totalNewNotif > 0 ? this._totalNewNotif.toString() : '';
          break;
        case capability === 'boolean':
          this._totalNewNotif = false;
          for (const el of arr) {
            el.new = !!el.new;
            this._totalNewNotif = this._totalNewNotif || el.new;
            el.newStr = '';
          }
          this._totalNewNotifStr = '';
          break;
        case capability === 'null':
          this._totalNewNotif = null;
          for (const el of arr) {
            el.new = null;
            el.newStr = '';
          }
          this._totalNewNotifStr = '';
          break;
      }

    }
    generateNewInfo(arr);

    const generateHref = arr => {
      for (const el of arr) {
        // Generate href from object
        if (typeof el.href === 'object') {
          /*
          {
            href: {
              "origin": "https://prudential-serviceinc--uxdev.sandbox.my.site.com",
              "pathname": "/customer/s/ux-os",
              "search": "?page=Product Summary",
              "hash": "#main",
              "dynamicSearchParams": ["pid"] // set to 'true' to include all search params in the URL
            }
          }
          */
          const url = new URL(encodeURI(el.href.origin ?? window.location.origin));
          if (el.href.pathname) {
            url.pathname = encodeURI(el.href.pathname);
          }
          if (el.href.search) {
            url.search = encodeURI(el.href.search);
          }
          if (el.href.hash) {
            url.hash = encodeURI(el.href.hash);
          }

          if (el.href.dynamicSearchParams === true) {
            // Append all search params in the page URL
            const allParams = new URLSearchParams(window.location.search);
            for (const [key, value] of allParams.entries()) {
              if (url.searchParams.has(key)) {
                url.searchParams.delete(key);
              }
              url.searchParams.append(key, value);
            }
          } else if (Array.isArray(el.href.dynamicSearchParams)) {
            // Append only selected search paramas
            const allParams = new URLSearchParams(window.location.search);

            for (const key of el.href.dynamicSearchParams) {
              const value = allParams.get(key);
              if (value) {
                if (url.searchParams.has(key)) {
                  url.searchParams.delete(key);
                }
                url.searchParams.append(key, value);
              }
            }
          }
          el.href = url.toString();

        } else if (typeof el.eventName === 'string') {
          /*
          {
            "eventName": "evomessacecenter_ann360commpage",
            "eventDetail": {                          // eventDetail is optional (used in ANN360 pages to communicate navigation params to event listener in FlexCard)
              "pageName": "Product Summary",
              "pageApi": PRU_ANN360_PRODUCT_SUMMARY__c
            }
          }
          */
          el.href = DEATH_LINK; // insert dead link in the HTML template. In the click listener an event will be fired
        }

        // Set Opens New Window variables
        el.bNewWindow = el.target === '_blank'; // Set boolean to show hide opens new window icon

        // If no label specified, create a label
        if (!el.label) {
          let newText = '';
          if (typeof el.new === 'number' && el.new > 0) {
            newText = `(${el.new} new)`;
          } else if (typeof el.new === 'boolean' && el.new) {
            newText = `(new ${el.text})`;
          }

          el.label = el.text + newText + (el.bNewWindow ? ' (opens new window)' : ''); // adds new messages and "(opens new window)" if needed
        }


        if (el.submenu) {
          generateHref(el.submenu);
        }
      }
    }
    generateHref(arr);
  }

  /**
   * Connected callback hook used to set the viewport variables
   */
  connectedCallback() {
    // To detect changes in the viewport
    this.handleBreakpointChange = this.handleBreakpointChange.bind(this);
    this._media = matchMedia('screen and (min-width: 64rem)'); // for this component, mobile is considered up to 1024 (cell phones + tablets)
    this._media.addEventListener('change', this.handleBreakpointChange);
    this.handleBreakpointChange();
  }

  /**
   * Disconnected callback hook used to remove event listeners
   */
  disconnectedCallback() {
    this._media.removeEventListener('change', this.handleBreakpointChange);
  }

  /**
   * Media query listener used to update the viewport variable
   */
  handleBreakpointChange = () => {
    // this._bAnimating = false; // avoid any animation when switching breakpoints
    // this._bExpanded = false; // close the bar when switching breakpoints
    this._bMobile = !this._media.matches;
  }

  /**
   * Rendered callback hook used to post processing
   */
  // renderedCallback() {
  // }

  /**
   * Listener for when show/hide animation for the hamburger menu ends
   */
  handleAnimationEnd() {
    this._bAnimating = false;
  }

  /**
   * Listener for clicks in the button menu
   */
  handleButtonClick() {
    this.bExpanded = !this._bExpanded;
    if (this.bExpanded) {
      setTimeout(() => {
        this.template.querySelector('.evo-message-center__menuitem').focus({ preventScroll: true });
      }, 0);
    }
  }

  /**
   * Listener for clicks in the links
   * @param {MouseEvent} event
   */
  handleLinkClick(event) {
    this.bExpanded = false;
   
    if (event.currentTarget.href === DEATH_LINK) {
      const lnkData = this._map.get(this._currentKey);
      if (lnkData?.eventDetail) {
        this.dispatchEvent(new CustomEvent(lnkData.eventName, {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: lnkData.eventDetail ? lnkData.eventDetail : null
        }));
      }
    }
  }

  /**
   * Listener for keys in the component
   * @param {KeyboardEvent} event
   */
  handleKeydown(event) {
    // Check if escape key was pressed to close the mobile menu
    if (this.bExpanded && event.key === 'Escape') {
      event.preventDefault();
      this.bExpanded = false;
      setTimeout(() => {
        this.template.querySelector('[data-locator=button]').focus({ preventScroll: true });
      }, 200);
    }
  }

  /**
   * Listener for keys in the top level menuitems
   * @param {KeyboardEvent} event
   */
  handleMenuitemKeydown(event) {
    const menuitemEl = event.currentTarget;
    switch (true) {
      case event.key === 'ArrowDown' && menuitemEl.getAttribute('aria-expanded') === 'true':
        // Arrow down in disclosure button that has expanded menuitem
        event.preventDefault();
        menuitemEl.parentNode.querySelector('.evo-message-center__submenuitem')?.focus();
        break;
      case event.key === 'ArrowUp':
        // Arrow up/left in menuitem
        {
          event.preventDefault();
          const menuitemEls = this.template.querySelectorAll('.evo-message-center__menuitem');
          for (let i = 0; i < menuitemEls.length; i++) {
            if (menuitemEls[i] === menuitemEl) {
              menuitemEls[i - 1]?.focus();
              break;
            }
          }
        }
        break;
      case event.key === 'ArrowDown':
        // Arrow down/right in menuitem
        {
          event.preventDefault();
          const menuitemEls = this.template.querySelectorAll('.evo-message-center__menuitem');
          for (let i = 0; i < menuitemEls.length; i++) {
            if (menuitemEls[i] === menuitemEl) {
              menuitemEls[i + 1]?.focus();
              break;
            }
          }
        }
        break;
      case event.key === 'Home':
        // Home in menuitem
        {
          event.preventDefault();
          const firstMenuitemEl = this.template.querySelector('.evo-message-center__menuitem');
          if (menuitemEl !== firstMenuitemEl) {
            firstMenuitemEl?.focus();
          }
        }
        break;
      case event.key === 'End':
        // End in menuitem
        {
          event.preventDefault();
          const menuitemEls = this.template.querySelectorAll('.evo-message-center__menuitem');
          const lastMenuitemEl = menuitemEls[menuitemEls.length - 1];
          if (menuitemEl !== lastMenuitemEl) {
            lastMenuitemEl?.focus();
          }
        }
        break;
    }
  }

  /**
   * Listener for focus out of the nav component
   * @param {FocusEvent} event
   */
  handleFocusOut(event) {
    if ((!event.currentTarget.contains(event.relatedTarget) || this._bMobile && event.relatedTarget === this.template.querySelector('[data-locator=button]')) && this.bExpanded) {
      this.bExpanded = false;
    }
  }

  /**
   * Getter used in the template to set the right classes for the menu
   * so it annimates in mobile breakpoint when sliding in/out
   */
  get navMenuClass() {
    // return 'evo-message-center__menu evo-message-center__menu_visible';
    if (this.bExpanded) {
      return 'evo-message-center__menu evo-message-center__menu_visible';
    } else if (!this.bExpanded && this._bAnimating) {
      return 'evo-message-center__menu evo-message-center__menu_hidden';
    } else {
      return 'evo-message-center__menu';
    }
  }

  /**
   * Getter used in the template to set the z-index in the style property of the component
   */
  get zIndex() {
    if (this._data.zIndex) {
      return `z-index: ${this._data.zIndex};`;
    } else {
      return undefined;
    }
  }

  /**
   * Getter used in the template to generate the total new notifications number
   */
  get totalNewNotifNumber() {
    return typeof this._totalNewNotif === 'number' ? this._totalNewNotif : null;
  }

  /**
   * Getter used in the template to generate the button total new notifications a11y copy
   */
  get totalNewNotifString() {
    const openCloseStr = `${this._bExpanded ? 'Close' : 'Open'} menu`;

    if (typeof this._totalNewNotif === 'number' && this._totalNewNotif > 0) {
      return `${openCloseStr} (there ${this._totalNewNotif === 1 ? 'is' : 'are'} ${this._totalNewNotif} new messages/alers)`;
    } else if (typeof this._totalNewNotif === 'boolean' && this._totalNewNotif) {
      return `${openCloseStr} (there are new messages/alerts)`;
    } else {
      return openCloseStr;
    }
  }

  /**
   * Getter used in the template to generate the new messages notification
   */
  get newMessagesString() {
    if (this._data.zIndex) {
      return `z-index: ${this._data.zIndex};`;
    } else {
      return undefined;
    }
  }
}