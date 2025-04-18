import { LightningElement } from 'lwc';

export default class Testdatatable extends LightningElement {
  keyFieldName = "id";
  hideRowSelection = true;
  defaultsortdirection = 'asc'; // desc
  sortedby = 'opportunityName';
  enableinfiniteloading = false;
  wraptextmaxlines = 3;
  draftValues = [];

  /** Columns */
  columns = [
    {
      label: 'Opportunity name',
      fieldName: 'opportunityName',
      type: 'text',
      sortable: true,
      wrapText: true
    },
    {
      label: 'Confidence',
      fieldName: 'confidence',
      type: 'percent',
      cellAttributes: {
        iconName: {
          fieldName: 'trendIcon'
        },
        iconPosition: 'right',
      },
    },
    {
      label: 'Amount',
      fieldName: 'amount',
      type: 'currency',
      typeAttributes: {
        currencyCode: 'USD',
        step: '0.001',
        minimumFractionDigits: '2',
        maximumFractionDigits: '3',
      },
    },
    {
      label: 'Contact Email',
      fieldName: 'contact',
      type: 'email',
      editable: true
    },
    {
      label: 'Contact Phone',
      fieldName: 'phone',
      type: 'phone'
    },
    {
      label: 'Company Website',
      fieldName: 'website',
      type: 'url',
      typeAttributes: { label: { fieldName: 'websiteLabel' }, tooltip: { fieldName: 'websiteTooltip' }, target: { fieldName: 'websiteTarget' } },
    },
    {
      label: "Date",
      fieldName: "date",
      type: "date-local",
      typeAttributes: {
        month: "2-digit",
        day: "2-digit"
      }
    },
    {
      label: 'View Details',
      type: 'button',
      typeAttributes: {
        label: 'View Details',
        name: 'showdetails',
        title: 'View',
        variant: 'base'
      }
    },
    {
      label: 'Add',
      type: 'button',
      typeAttributes: {
        label: 'Add',
        name: 'add',
        title: 'Add',
        variant: 'base'
      }
    },
    {
      type: 'action',
      typeAttributes: {
        rowActions: [
          { label: 'Show details', name: 'show_details' },
          { label: 'Delete', name: 'delete' }
        ],
        menuAlignment: 'right'
      }
    }
  ];

  /** Data */
  data = [
    {
      id: 'a',
      opportunityName: 'Cloudhubasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
      confidence: 0.2,
      amount: 25000,
      contact: 'jrogers@cloudhub.com',
      phone: '2352235235',
      trendIcon: 'utility:down',
      website: 'https://www.cloudhub.com',
      websiteLabel: 'www.cloudhub.com',
      websiteTooltip: 'CloudHub',
      websiteTarget: '_blank',
      date: '2023-04-05T13:45:42.220Z',
    },
    {
      id: 'b',
      opportunityName: 'Quip',
      confidence: 0.78,
      amount: 740000,
      contact: 'quipy@quip.com',
      phone: '2352235235',
      trendIcon: 'utility:up',
      website: 'https://www.quip.com',
      websiteLabel: 'www.quip.com',
      websiteTooltip: 'Quip',
      websiteTarget: '_self',
      date: '1984-03-02T05:00:00.000Z',
    },
  ];

  renderedCallback() {
    console.log(`renderedCallback()`);
  }


  handleRowAction(event) {
    console.log(event);
  }

  handleSort(event) {
    console.log(event);
  }

  handleSave(event) {
    console.log(`handleSave()`);
    console.log(event);

    const records = event.detail.draftValues.slice().map((draftValue) => Object.assign({}, draftValue));
    records.forEach(record => {
      for (let d of this.data) {
        if (d.id === record.id) {
          d = Object.assign(d, record);
          break;
        }
      }
    });

    // Clear all datatable draft values (this will re-render the datatable)
    this.draftValues = [];
  }
}