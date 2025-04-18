export default {
  label: 'Main navigation',
  zIndex: 9000,
  items: [
    {
      text: 'Product Summary',
      eventName: 'productsummary',
      eventDetail: {
        name: 'Product Summary'
      },
      current: true,
    },
    {
      text: 'Salesforce.com',
      href: {
        origin: 'https://salesforce.com',
        pathname: '/solutions/industries/financial-services/insurance/',
        search: '?pagename name=Documents&pid=123456789',
        hash: '#main',
        dynamicSearchParams: ['pid', 'page'] // set to 'true' to include all search params in the URL
      },
      // href: {
      //   origin: 'https://prudential-serviceinc--uxdev.sandbox.my.site.com',
      //   pathname: '/customer/s/ux-os',
      //   search: '?pagename name=kk',
      //   hash: '',
      //   dynamicSearchParams: ['pid', 'page'] // set to 'true' to include all search params in the URL
      // },
      target: '_blank',
      current: null
    },
    {
      "text": "Menuitem - Submenu",
      "expanded": false,
      "submenu": [
        {
          "text": "Investment Allocation",
          "eventName": "evonavigation_ann360pagecommpage",
          "eventDetail": {
            "pageName": "Investment Allocation",
            "pageApi": "PRU_ANN360_Investment_Allocation__c"
          },
          "current": false
        },
        {
          "text": "Prudential.com",
          "href": "https://www.prudential.com",
          "target": "_blank",
          "current": null
        },
        {
          "text": "Salesforce.com",
          "href": "https://www.salesforce.com",
          "target": "_blank",
          "current": null
        }
      ]
    },
    // {
    //   text: 'Menuitem with Submenu',
    //   expanded: false,
    //   submenu: [
    //     {
    //       text: 'Product Summary',
    //       href: '#',
    //       target: '_self',
    //       current: false
    //     },
    //     {
    //       text: 'Investment Allocation',
    //       href: '#',
    //       target: '_self',
    //       current: false
    //     },
    //     {
    //       text: 'Transactions',
    //       href: '#',
    //       target: '_self',
    //       current: false
    //     },
    //     {
    //       text: 'Taxes & Documents',
    //       href: '#',
    //       target: '_self',
    //       current: false
    //     }
    //   ]
    // },
    {
      text: 'Transactions',
      href: '#',
      target: '_self',
      label: 'Transactions',
      current: false
    },
    {
      text: 'Taxes & Documents',
      href: '#',
      target: '_self',
      label: 'Taxes and Documents',
      current: false
    },
    // {
    //   text: 'My Financial Life',
    //   href: '#',
    //   target: '_self',
    //   label: 'My Financial Life',
    //   current: false
    // }
  ]
};

// export default {
//   label: 'Main navigation',
//   zIndex: 9000,
//   items: [
//     {
//       text: 'Current page', // Link with simple href format
//       href: 'https://referencetothispage.com',
//       target: '_blank',
//       current: true,
//     },
//     {
//       text: 'Prudential', // Link with complex href and dynamic params with dynamic params
//       href: {
//         origin: 'https://www.prudential.com',
//         pathname: '/financial-education/foundation-for-healty-financial-future/',
//         search: '?param1=value1&param2=value2',
//         hash: '#main',
//         dynamicSearchParams: ['param3', 'param4'] // set to 'true' to include all search params in the URL
//       },
//       target: '_self',
//       current: false,
//     },
//     {
//       text: 'Vlocity', // Link with custom event format
//       eventName: 'evonavigation_navigate',
//       eventDetail: {
//         data1: 'some data',
//         data2: 'more data'
//       },
//       target: '_blank',
//       current: false,
//     },
//     // {
//     //   text: "Menuitem", // Expandable group of links
//     //   expanded: false,
//     //   submenu: [
//     //     {
//     //       text: 'Salesforce',
//     //       href: 'https://www.salesforce.com',
//     //       target: '_blank',
//     //       current: false
//     //     },
//     //     {
//     //       text: 'Trailhead',
//     //       href: 'https://trailhead.salesforce.com/',
//     //       target: '_blank',
//     //       current: false
//     //     },
//     //     {
//     //       text: 'Vlocity',
//     //       href: 'http://www.vlocity.com',
//     //       target: '_blank',
//     //       current: false
//     //     }
//     //   ]
//     // }
//     {
//       text: "I would like to", // Expandable group of links
//       expanded: false,
//       submenu: [
//         {
//           text: 'Make a payment',
//           href: 'https://www.salesforce.com',
//           current: false
//         },
//         {
//           text: 'Allocate my premiums',
//           href: 'https://trailhead.salesforce.com/',
//           current: false
//         },
//         {
//           text: 'Change my beneficiaries',
//           href: 'http://www.vlocity.com',
//           current: false
//         }
//       ]
//     }
//   ]
// };