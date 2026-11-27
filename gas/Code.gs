/*
 * GOOGLE APPS SCRIPT — RSVP & WEDDING WISHES
 * 1. Buat Google Sheet baru.
 * 2. Extensions > Apps Script, tempel kode ini.
 * 3. Deploy > New deployment > Web app.
 * 4. Execute as: Me | Who has access: Anyone.
 * 5. Salin URL Web App ke config.js (appsScriptUrl).
 */
const SHEET_NAME = "RSVP";

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Nama", "Kehadiran", "Jumlah Tamu", "Ucapan"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const name = String(data.name || "").trim().slice(0, 100);
    const attendance = String(data.attendance || "").trim();
    const guests = Math.max(1, Math.min(4, Number(data.guests) || 1));
    const message = String(data.message || "").trim().slice(0, 500);
    if (!name || !["Hadir", "Tidak Hadir"].includes(attendance)) {
      throw new Error("Nama dan konfirmasi kehadiran wajib diisi.");
    }
    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, attendance === "Hadir" ? guests : 0, message]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

function doGet(e) {
  try {
    if (e.parameter.action !== "wishes") return json_({ ok: true, message: "Fabi & Oca RSVP endpoint" });
    const sheet = getSheet_();
    const rows = sheet.getDataRange().getValues();
    const wishes = rows.slice(1).filter(r => r[4]).map(r => ({
      name: String(r[1]), message: String(r[4]), timestamp: r[0]
    }));
    return json_({ ok: true, wishes: wishes.slice(-100) });
  } catch (err) {
    return json_({ ok: false, error: err.message, wishes: [] });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupSheet() {
  getSheet_();
}