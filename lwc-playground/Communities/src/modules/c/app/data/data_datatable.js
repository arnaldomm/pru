const columnsDetails = [
  {
    "cellAttributes": "width:10%",
    "fieldName": "effectiveDate",
    "label": "Date",
    "sortable": true,
    "type": "date",
    "typeAttributes": {
      "month": "2-digit",
      "day": "2-digit",
      "year": "numeric"
    }
  },
  {
    "fieldName": "category",
    "label": "Type",
    "sortable": true,
    "type": "text"
  },
  {
    "cellAttributes": "width:300px",
    "fieldName": "type",
    "label": "Name",
    "sortable": true,
    "type": "text"
  },
  {
    "cellAttributes": "text-align:right",
    "fieldName": "grossAmount",
    "label": "Gross Amount*",
    "sortable": false,
    "type": "currency"
  },
  {
    "cellAttributes": "text-align:right",
    "fieldName": "netAmount",
    "label": "Net Amount**",
    "sortable": false,
    "type": "currency"
  },
  {
    "fieldName": "statusDescription",
    "label": "Status",
    "sortable": true,
    "type": "text"
  },
  {
    "fieldName": "showDetails",
    "label": "Details",
    "sortable": false,
    "type": "button",
    "typeAttributes": {
      "label": "View",
      "name": "showdetails",
      "title": "View",
      "disabled": "showButton",
      "value": "view",
      "iconPosition": "left"
    }
  }
]

const clientData = [
  {
    "category": "Non-Financial",
    "eventCode": "C235",
    "grossAmount": 0,
    "netAmount": 0,
    "showButton": false,
    "statusDescription": "Completed",
    "transactionIndentifier": "201907194372921314",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=201907194372921314&eventCode=C235&pid=0YT2h0000000D6VGAU",
    "type": "Add Contract Advisor Relationship",
    "effectiveDate": "2022-11-09"
  },
  {
    "category": "Withdrawal",
    "effectiveDate": "2022-11-09",
    "eventCode": "S505",
    "grossAmount": -300,
    "netAmount": -300,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202211090828152085",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202211090828152085&eventCode=S505&pid=0YT2h0000000D6VGAU",
    "type": "Systematic Withdrawal"
  },
  {
    "category": "Non-Financial",
    "effectiveDate": "2022-11-08",
    "eventCode": "C505",
    "grossAmount": 0,
    "netAmount": 0,
    "showButton": false,
    "statusDescription": "Completed",
    "transactionIndentifier": "202211084407187277",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202211084407187277&eventCode=C505&pid=0YT2h0000000D6VGAU",
    "type": "Add Systematic AW"
  },
  {
    "category": "Non-Financial",
    "effectiveDate": "2022-11-02",
    "eventCode": "C507",
    "grossAmount": 0,
    "netAmount": 0,
    "showButton": false,
    "statusDescription": "Completed",
    "transactionIndentifier": "202211025351609084",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202211025351609084&eventCode=C507&pid=0YT2h0000000D6VGAU",
    "type": "Cancel Systematic Withdrawal"
  },
  {
    "category": "Withdrawal",
    "effectiveDate": "2022-08-08",
    "eventCode": "S505",
    "grossAmount": -500,
    "netAmount": -500,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202208062002219737",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202208062002219737&eventCode=S505&pid=0YT2h0000000D6VGAU",
    "type": "Systematic Withdrawal"
  },
  {
    "category": "Withdrawal",
    "effectiveDate": "2022-07-26",
    "eventCode": "C230",
    "grossAmount": -50,
    "netAmount": -50,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202207263597608890",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202207263597608890&eventCode=C230&pid=0YT2h0000000D6VGAU",
    "type": "Advisory Fee"
  },
  {
    "category": "Withdrawal",
    "effectiveDate": "2022-07-19",
    "eventCode": "C201",
    "grossAmount": -50,
    "netAmount": -50,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202207192434473099",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202207192434473099&eventCode=C201&pid=0YT2h0000000D6VGAU",
    "type": "Policy Anniv. Admin Charges"
  },
  {
    "category": "Reallocations",
    "effectiveDate": "2022-01-21",
    "eventCode": "T780",
    "grossAmount": 70486.97,
    "netAmount": 70486.97,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202201214263142960",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202201214263142960&eventCode=T780&pid=0YT2h0000000D6VGAU",
    "type": "Fund Substitution"
  },
  {
    "category": "Reallocations",
    "effectiveDate": "2022-01-21",
    "eventCode": "T780",
    "grossAmount": -70486.97,
    "netAmount": -70486.97,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202202022776976528",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976528&eventCode=T780&pid=0YT2h0000000D6VGAU",
    "type": "Fund Substitution (R)"
  },
  {
    "category": "Reallocations",
    "effectiveDate": "2022-01-21",
    "eventCode": "T780",
    "grossAmount": 97577.57,
    "netAmount": 97577.57,
    "showButton": true,
    "statusDescription": "Completed",
    "transactionIndentifier": "202202022777476666",
    "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022777476666&eventCode=T780&pid=0YT2h0000000D6VGAU",
    "type": "Fund Substitution"
  },
  // {
  //   "category": "Investment",
  //   "effectiveDate": "2021-11-02",
  //   "eventCode": "P300",
  //   "grossAmount": 20000,
  //   "netAmount": 20000,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022777476665",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022777476665&eventCode=P300&pid=0YT2h0000000D6VGAU",
  //   "type": "Contribution"
  // },
  // {
  //   "category": "Investment",
  //   "effectiveDate": "2021-11-02",
  //   "eventCode": "P300",
  //   "grossAmount": 20000,
  //   "netAmount": 20000,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202111023268571827",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202111023268571827&eventCode=P300&pid=0YT2h0000000D6VGAU",
  //   "type": "Contribution"
  // },
  // {
  //   "category": "Investment",
  //   "effectiveDate": "2021-11-02",
  //   "eventCode": "P300",
  //   "grossAmount": -20000,
  //   "netAmount": -20000,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976530",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976530&eventCode=P300&pid=0YT2h0000000D6VGAU",
  //   "type": "Contribution (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976532",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976532&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976533",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976533&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976534",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976534&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976535",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976535&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976536",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976536&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976537",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976537&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // },
  // {
  //   "category": "Withdrawal",
  //   "effectiveDate": "2021-10-28",
  //   "eventCode": "S500",
  //   "grossAmount": 100,
  //   "netAmount": 100,
  //   "showButton": true,
  //   "statusDescription": "Completed",
  //   "transactionIndentifier": "202202022776976538",
  //   "trxDetailsURL": "/customer/s/pru-ann360-transaction-detailed-view?transactionIndentifier=202202022776976538&eventCode=S500&pid=0YT2h0000000D6VGAU",
  //   "type": "Partial Surrender (R)"
  // }
]
// clientData = [
//   {
//     "capRate": 3,
//     "investmentName": "Dow Jones. Real Estate Index 1 Year Cap",
//     "startingIndexValue": 391.84,
//     "currentIndexValue": 345.96,
//     "percentageOfPortfolio": 23.87,
//     "renewalDate": "2019-05-02",
//     "holdingValue": 7743.75
//   },
//   {
//     "capRate": 3,
//     "investmentName": "Dow Jones. Real Estate Index 1 Year Cap",
//     "startingIndexValue": 391.84,
//     "currentIndexValue": 345.96,
//     "percentageOfPortfolio": 23.87,
//     "renewalDate": "2019-05-02",
//     "holdingValue": 7743.75
//   },
// ];

// _columnsDetails = [
//   {
//     "label": "Current Index Value",
//     "fieldName": "currentIndexValue",
//     "type": "number",
//     "sortable": false
//   },
//   {
//     "label": "Starting Index Value",
//     "fieldName": "startingIndexValue",
//     "type": "number",
//     "sortable": false
//   },
//   {
//     "label": "Maturity Date",
//     "fieldName": "renewalDate",
//     "type": "date",
//     "sortable": true
//   },
//   {
//     "label": "Name",
//     "fieldName": "investmentName",
//     "type": "text",
//     "sortable": true
//   },
//   {
//     "label": "Value",
//     "fieldName": "holdingValue",
//     "type": "currency",
//     "sortable": true
//   },
//   {
//     "label": "% of Account Value",
//     "fieldName": "percentageOfPortfolio",
//     "type": "number",
//     "sortable": false
//   },
//   {
//     "label": "Cap Rate",
//     "fieldName": "capRate",
//     "type": "text",
//     "sortable": false
//   }
// ];


export {columnsDetails, clientData};