/**
 * TDCP Tourist Feedback System — Backend
 * ----------------------------------------
 * Deploy this inside a Google Sheet: Extensions > Apps Script, paste this
 * file in as Code.gs, then Deploy > New deployment > Web app.
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Copy the resulting Web App URL into form.html and dashboard.html.
 *
 * See SETUP_GUIDE.md for full step-by-step instructions.
 */

var SHEET_NAME = 'Responses';

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Contact', 'Email', 'ID Number',
      'Visit Date', 'Site Visited', 'City of Origin',
      'Group Size', 'Rating', 'Remarks'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  var out;
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.contact || '',
      data.email || '',
      data.idNumber || '',
      data.visitDate || '',
      data.site || '',
      data.origin || '',
      data.groupSize || '',
      data.rating || '',
      data.remarks || ''
    ]);

    out = { status: 'success' };
  } catch (err) {
    out = { status: 'error', message: err.toString() };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var out;
  try {
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
