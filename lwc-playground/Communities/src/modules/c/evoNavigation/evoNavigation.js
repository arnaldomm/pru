import { LightningElement, api, track } from 'lwc';

// Constants
const DEATH_LINK = 'javascript:void(0)';

// LWC
export default class EvoNavigation extends LightningElement {
  @track _data; // object: data used to render
  _bExpanded = false; // boolean: true if expanded / false if collapsed - used in mobile
  _bAnimating = false; // boolean: true if animating / false if animation is done - used in mobile
  _map = new Map(); // Map: used to access binds unique key generated for each item to the item data inside this._data object
  _currentKey = ''; // string: holds the key of the item that is currently active (current page menuitem)
  _media; // MediaQueryList: used to detect mobile/desktop screen size changes and also on load
  _bMobile; // boolean: current viewport - true if mobile viewport / false if desktop viewport

  /**
   * Items data setter/getter
   */
  @api
  get navData() {
    return this._data;
  }

  set navData(data) {
    this._data = {};
    // Validate data
    if (typeof data !== 'object') {
      console.error('Evo Navigation: Invalid navData object.');
      return;
    }

    // Deep copy data
    data = JSON.parse(JSON.stringify(data));

    // Check label
    if (!data.label || typeof data.label !== 'string') console.warn('Evo Navigation: Missed label.');

    // Check zIndex
    if (data.zIndex && data.zIndex !== 'auto' && data.zIndex !== 'initial' && data.zIndex !== 'inherit') {
        data.zIndex = parseInt(data.zIndex);
        if (Number.isNaN(data.zIndex)) {
          console.warn('Evo Navigation: Invalid zIndex.');
          data.zIndex = null;
        }
    }

    if (this.validateItemsData(data.items)) {
      // Generate keys and map of items in the menu
      this.prepareItemsData(data.items);
      this._data = data;
      this._data.renderer = false;
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
      console.error('Evo Navigation: Invalid array of items.');
      return false;
    }

    // will be set to false if invalid value is found
    var bValid = true;

    // Check items value
    var currentAlreadyFound = false;

    // Function to validate a single link data
    const validateLink = item => {
      if (!item.text || typeof item.text !== 'string') {
        console.warn('Evo Navigation: Invalid link/button label.');
        item.text = '';
      }

      // Check current
      if (item.current !== null && typeof item.current !== 'boolean') {
        console.warn(`Evo Navigation: Invalid current data for ${item.text} item.`);
        item.current = null; // make item not selectable
      }
      if (item.current === true) {
        if (currentAlreadyFound) console.warn('Evo Navigation: Duplicate active link.');
        currentAlreadyFound = true;
      }

      // Check href data
      if (item.href) {
        if (typeof item.href === 'object') {
          if (item.href.origin) {
            try {
              new URL(item.href.origin);
            } catch {
              console.error(`Evo Navigation: Invalid origin for ${item.text} item.`);
              bValid = false;
            }
          };
          if (item.href.pathname && typeof item.href.pathname !== 'string') {
            console.error(`Evo Navigation: Invalid pathname for ${item.text} item.`);
            bValid = false;
          }
          if (item.href.search && typeof item.href.search !== 'string') {
            console.error(`Evo Navigation: Invalid search for ${item.text} item.`);
            bValid = false;
          }
          if (item.href.hash && typeof item.href.hash !== 'string') {
            console.error(`Evo Navigation: Invalid hash for ${item.text} item.`);
            bValid = false;
          }
          if (item.href.dynamicSearchParams && typeof item.href.dynamicSearchParams !== 'boolean' && !Array.isArray(item.href.dynamicSearchParams)) {
            console.error(`Evo Navigation: Invalid dynamicSearchParams for ${item.text} item.`);
            bValid = false;
          }
          if (Array.isArray(item.href.dynamicSearchParams)) {
            for (const j of item.href.dynamicSearchParams) {
              if (typeof j !== 'string') {
                console.error(`Evo Navigation: Invalid dynamicSearchParam for ${item.text} item.`);
                bValid = false;
              }
            }
          }
        } else if (typeof item.href !== 'string') {
          console.error(`Evo Navigation: Invalid href for ${item.text} item.`);
          item.href = DEATH_LINK;
        }

        if (item.eventName) {
          console.warn('Evo Navigation: Link contains href and event. Event will be used.');
        }
      }

      // Check target
      if (item.target !== undefined && typeof item.target !== 'string') {
        console.warn(`Evo Navigation: Invalid link target for ${item.text} item.`);
        item.target = undefined;
      }

      // Check event data
      if (item.eventName) {
        if (typeof item.eventName !== 'string') {
          console.error(`Evo Navigation: Invalid eventName for ${item.text} item.`);
          bValid = false;
          item.eventName = undefined;
          item.eventDetail = undefined;
          if (!item.href) item.href = DEATH_LINK;
        }
      } else if (!item.href) {
        console.error(`Evo Navigation: No href or event specified for ${item.text} item.`);
        bValid = false;
      }
    }

    // Go over top menu items
    for (const item of arr) {
      if (Array.isArray(item.submenu)) {
        // Validate collapsible data
        if (!item.text || typeof item.text !== 'string') {
          console.warn('Evo Navigation: Invalid link/button label.');
          item.text = '';
        }

        if (typeof item.expanded !== 'boolean') {
          console.warn(`Evo Navigation: Invalid expanded for ${item.text} item.`);
          item.expanded = false;
        }

        // Go over second level items
        for (const subitem of item.submenu) {
          // Validate link data
          validateLink(subitem);
        }
      } else {
        // Validate link data
        validateLink(item);
      }
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
        if (el.current) {
          this._currentKey = el.key;
        }

        if (el.submenu) {
          el.id = `submenu${el.key}`; // used to bind the button to the submenu
          generateKeys(el.submenu);
        }
      }
    }
    generateKeys(arr);

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
            "eventName": "evonavigation_ann360commpage",
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
          el.label = el.text + (el.bNewWindow ? ' (opens new window)' : ''); // adds open new window if needed
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
    this._bAnimating = false; // avoid any animation when switching breakpoints
    this._bExpanded = false; // close the bar when switching breakpoints
    this._bMobile = !this._media.matches;
  }

  /**
   * Rendered callback hook used to post processing
   */
  renderedCallback() {
    // Highlight the expandable menuitem when the child element is active
    const currentEl = this.template.querySelector('[data-locator=current]');
    const expandableMenuitemEls = this.template.querySelectorAll('.evo-nav__menutitem_expandable');
    expandableMenuitemEls.forEach(el => {
      if (el.nextSibling?.contains(currentEl)) {
        el.classList.add('evo-nav__menuitem_current');
      } else {
        el.classList.remove('evo-nav__menuitem_current');
      }
    });
  }

  /**
   * Listener for when show/hide animation for the hamburger menu ends
   */
  handleAnimationEnd() {
    this._bAnimating = false;
  }

  /**
   * Listener for clicks in the hamburger menu
   */
  handleHamburgerClick() {
    this._bAnimating = true;
    this._bExpanded = !this._bExpanded;
    if (this._bExpanded) {
      setTimeout(() => {
        this.template.querySelector('.evo-nav__menuitem:not(.evo-nav__menuitem_current)').focus({ preventScroll: true });
      }, 0);
    }
  }

  /**
   * Listener for clicks in the expandable buttons
   * @param {MouseEvent} event
   */
  handleExpandableClick(event) {
    event.preventDefault();
    this._map.get(event.currentTarget.dataset.submenuKey).expanded = !this._map.get(event.currentTarget.dataset.submenuKey).expanded;
    this._data.renderer = !this._data.renderer;
  }

  /**
   * Listener for clicks in the links
   * @param {MouseEvent} event
   */
  handleLinkClick(event) {
    const targetKey = event.currentTarget.dataset.linkKey;
    if (typeof this._map.get(targetKey)?.current === 'boolean') {
      if (typeof this._map.get(this._currentKey)?.current === 'boolean') {
        this._map.get(this._currentKey).current = false;
      }
      this._map.get(targetKey).current = true;
      this._currentKey = targetKey;
    }

    if (this._bMobile) {
      this._bAnimating = true;
      this._bExpanded = false;
      setTimeout(() => {
        this.template.querySelector('.evo-nav__currentpage').focus({ preventScroll: true });
      }, 0);
    } else if (event.currentTarget.dataset.submenuKey) {
      this._map.get(event.currentTarget.dataset.submenuKey).expanded = false;
      this.template.querySelector(`.evo-nav__menutitem_expandable[data-submenu-key="${event.currentTarget.dataset.submenuKey}"]`).focus();
      this._data.renderer = !this._data.renderer;
    }

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
    // Check if escape key was pressed to close the hamburger menu
    if (this._bMobile && this._bExpanded && event.key === 'Escape') {
      event.preventDefault();
      this._bAnimating = true;
      this._bExpanded = false;
      setTimeout(() => {
        this.template.querySelector('[data-locator=hamburger-button]').focus({ preventScroll: true });
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
      case event.key === 'Escape' && menuitemEl.classList.contains('evo-nav__menutitem_expandable') && this._map.get(menuitemEl.dataset.submenuKey).expanded:
        // Escape in expanded disclosure button
        event.preventDefault();
        event.stopPropagation();
        this._map.get(menuitemEl.dataset.submenuKey).expanded = false;
        this._data.renderer = !this._data.renderer;
        setTimeout(() => {
          menuitemEl.focus({ preventScroll: true });
        }, 0);
        break;
      case event.key === 'ArrowDown' && menuitemEl.getAttribute('aria-expanded') === 'true':
        // Arrow down in disclosure button that has expanded menuitem
        event.preventDefault();
        menuitemEl.parentNode.querySelector('.evo-nav__submenuitem')?.focus();
        break;
      case event.key === 'ArrowUp' && this._bMobile:
      case event.key === 'ArrowLeft' && !this._bMobile:
        // Arrow up/left in menuitem
        {
          event.preventDefault();
          const menuitemEls = this.template.querySelectorAll('.evo-nav__menuitem');
          for (let i = 0; i < menuitemEls.length; i++) {
            if (menuitemEls[i] === menuitemEl) {
              menuitemEls[i - 1]?.focus();
              break;
            }
          }
        }
        break;
      case event.key === 'ArrowDown' && this._bMobile && menuitemEl.getAttribute('aria-expanded') !== 'true':
      case event.key === 'ArrowRight' && !this._bMobile:
        // Arrow down/right in menuitem
        {
          event.preventDefault();
          const menuitemEls = this.template.querySelectorAll('.evo-nav__menuitem');
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
          const firstMenuitemEl = this.template.querySelector('.evo-nav__menuitem');
          if (menuitemEl !== firstMenuitemEl) {
            firstMenuitemEl?.focus();
          }
        }
        break;
      case event.key === 'End':
        // End in menuitem
        {
          event.preventDefault();
          const menuitemEls = this.template.querySelectorAll('.evo-nav__menuitem');
          const lastMenuitemEl = menuitemEls[menuitemEls.length - 1];
          if (menuitemEl !== lastMenuitemEl) {
            lastMenuitemEl?.focus();
          }
        }
        break;
    }
  }

  /**
   * Listener for keys in the submenuitems
   * @param {KeyboardEvent} event 
   */
  handleSubenuitemKeydown(event) {
    const submenuitemEl = event.currentTarget;
    switch (true) {
      case event.key === 'Escape':
        // Escape in a submenuitem
        event.preventDefault();
        event.stopPropagation();
        this._map.get(submenuitemEl.dataset.submenuKey).expanded = false;
        this._data.renderer = !this._data.renderer;
        setTimeout(() => {
          this.template.querySelector(`.evo-nav__menutitem_expandable[data-submenu-key="${submenuitemEl.dataset.submenuKey}"]`).focus({ preventScroll: true });
        }, 0);
        break;
      case event.key === 'ArrowUp':
        // Arrow up in a submenuitem
        {
          event.preventDefault();
          const submenuitemEls = this.template.querySelectorAll(`.evo-nav__submenuitem[data-submenu-key="${submenuitemEl.dataset.submenuKey}"]`);
          for (let i = 0; i < submenuitemEls.length; i++) {
            if (submenuitemEls[i] === submenuitemEl) {
              submenuitemEls[i - 1]?.focus();
              break;
            }
          }
        }
        break;
      case event.key === 'ArrowDown':
        // Arrow down in a submenuitem
        {
          event.preventDefault();
          const submenuitemEls = this.template.querySelectorAll(`.evo-nav__submenuitem[data-submenu-key="${submenuitemEl.dataset.submenuKey}"]`);
          for (let i = 0; i < submenuitemEls.length; i++) {
            if (submenuitemEls[i] === submenuitemEl) {
              submenuitemEls[i + 1]?.focus();
              break;
            }
          }
        }
        break;
      case event.key === 'Home':
        // Home in submenuitem
        {
          event.preventDefault();
          const firstSubmenuitemEl = this.template.querySelector(`.evo-nav__submenuitem[data-submenu-key="${submenuitemEl.dataset.submenuKey}"]`);
          if (submenuitemEl !== firstSubmenuitemEl) {
            firstSubmenuitemEl?.focus();
          }
        }
        break;
      case event.key === 'End':
        // End in submenuitem
        {
          event.preventDefault();
          const submenuitemEls = this.template.querySelectorAll(`.evo-nav__submenuitem[data-submenu-key="${submenuitemEl.dataset.submenuKey}"]`);
          const lastSubmenuitemEl = submenuitemEls[submenuitemEls.length - 1];
          if (submenuitemEl !== lastSubmenuitemEl) {
            lastSubmenuitemEl?.focus();
          }
        }
        break;
    }
  }

  /**
   * Listener for focus out of the navigation component
   * Helpfull for when using keyboard in mobile view (small percent of users)
   * In Safari for this to work is important to check: Settings/Advance/Press Tab to highlight each item on a webpage
   * @param {FocusEvent} event
   */
  handleFocusOut(event) {
    if (this._bMobile && this._bExpanded && event.relatedTarget && !event.currentTarget?.contains(event.relatedTarget)) {
      this._bAnimating = true;
      this._bExpanded = false;
    }
  }

  /**
   * Listener for focus out of a submenu
   * @param {FocusEvent} event
   */
  handleSubmenuFocusOut(event) {
    // Collapse expandable when focus goes outside
    if (!event.currentTarget.contains(event.relatedTarget)) {
      const key = event.currentTarget.dataset.submenuKey;

      if (this._map.get(key).expanded) {
        this._map.get(key).expanded = false;
        this._data.renderer = !this._data.renderer;
      }
    }
  }

  /**
   * Getter used in the template to set the right classes for the menu
   * so it annimates in mobile breakpoint when sliding in/out
   */
  get navMenuClass() {
    if (this._bExpanded) {
      return 'evo-nav__menu evo-nav__menu_slidein';
    } else if (!this._bExpanded && this._bAnimating) {
      return 'evo-nav__menu evo-nav__menu_slideout';
    } else {
      return 'evo-nav__menu';
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
   * Getter used in the template to show the current page name in mobile
   */
  get _currentPage() {
    return this._map.get(this._currentKey)?.text ?? '';
  }

  /**
   * Getter used in the template to set the accessible text for the hamburger menu
   */
  get _hamburgerButtonLabel() {
    return this._bExpanded ? 'Close menu' : 'Open menu';
  }
}