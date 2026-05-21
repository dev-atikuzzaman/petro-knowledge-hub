// src/sheetsService.js

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_SHEETS_API_KEY;

export async function getMembersFromSheet() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
    console.log("Fetching from:", url); // debug

    const res = await fetch(url);
    const data = await res.json();

    console.log("Sheet response:", data); // এটা দেখো browser console এ

    if (!data.values || data.values.length < 2) {
      console.warn("Sheet এ data নেই বা header ছাড়া row নেই");
      return [];
    }

    const [headers, ...rows] = data.values;

    return rows.map((row, i) => ({
      id: i + 1,
      ...Object.fromEntries(headers.map((h, j) => [h, row[j] || ""]))
    }));

  } catch (err) {
    console.error("Sheet fetch error:", err);
    return [];
  }
}
