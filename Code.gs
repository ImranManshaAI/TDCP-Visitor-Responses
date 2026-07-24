/**
 * TDCP Office Visitor Intake — Backend
 * ----------------------------------------
 * This is filled in by OFFICE STAFF while the tourist is at the counter,
 * not by the tourist directly.
 *
 * Deploy inside a Google Sheet: Extensions > Apps Script, paste this file
 * in as Code.gs, then Deploy > New deployment > Web app.
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Copy the resulting Web App URL into form.html and dashboard.html.
 *
 * See SETUP_GUIDE.md for full step-by-step instructions.
 */

var SHEET_NAME = 'Responses';

// ⚠️ Must exactly match SHARED_KEY in form.html and dashboard.html
var REQUIRED_KEY = 'tdcp-bwp-bus-desk';

var HEADERS = [
  'S.No',
  'Office Visit Date',
  'Name',
  'Phone Number',
  'Preferred Visit Date',
  'Group Size',
  'Origin Country',
  'Origin City',
  'Email',
  'CNIC (Optional)',
  'Sites Selected',
  'Additional Service',
  'Additional Service Details',
  'Remarks / Info Provided',
  'Logged By'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  var out;
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.key !== REQUIRED_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getSheet_();

    // Serial number = count of existing rows below the header
    var serial = sheet.getLastRow(); // header occupies row 1, so this equals prior data-row count

    // Sites arrives as an array (or comma-separated string as fallback); render as a numbered list in one cell
    var sitesList = Array.isArray(data.sites) ? data.sites : (data.sites ? String(data.sites).split(',') : []);
    var sitesFormatted = sitesList.map(function (s, i) { return (i + 1) + '. ' + s.trim(); }).join('\n');

    sheet.appendRow([
      serial,
      data.officeVisitDate || '',
      data.name || '',
      data.contact || '',
      data.preferredDate || '',
      data.groupSize || '',
      data.originCountry || '',
      data.origin || '',
      data.email || '',
      data.idNumber || '',
      sitesFormatted,
      data.additionalService || 'No',
      data.additionalServiceDetails || '',
      data.remarks || '',
      data.loggedBy || ''
    ]);

    out = { status: 'success', serial: serial };
  } catch (err) {
    out = { status: 'error', message: err.toString() };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var out;
  try {
    if (!e.parameter.key || e.parameter.key !== REQUIRED_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getSheet_();
    var values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      out = [];
    } else {
      var headers = values[0];
      out = values.slice(1).map(function (row) {
        var obj = {};
        headers.forEach(function (h, i) { obj[h] = row[i]; });
        return obj;
      });
    }
  } catch (err) {
    out = { status: 'error', message: err.toString() };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
