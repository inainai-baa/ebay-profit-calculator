#!/usr/bin/env node
/**
 * Fetch the public Google Sheets CSV export and rewrite pricing-data.js.
 *
 * Sheet must be readable via “リンクを知っている全員” (or published).
 * If export returns 401/403, ask the client to share/publish, then re-run.
 *
 * Usage (from repo root):
 *   node detekoi-land-mockup/scripts/sync-pricing.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHEET_ID = "1KVFjIxc7vbl8023GIMnyl-SUaqKYUlXDJeO7_Nyut4E";
const GID = "0";
const EXPORT_CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
const SOURCE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=drivesdk`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "pricing-data.js");

function clean(s) {
  return String(s || "")
    .replace(/[\u3000\s]+/g, " ")
    .trim();
}

/** Minimal CSV parser (handles quoted newlines / commas). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (ch === "\n" || (ch === "\r" && next === "\n")) {
      if (ch === "\r") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (ch === "\r") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function buildData(rows) {
  const facility = [];
  let current = "";
  for (const r of rows.slice(3, 12)) {
    const name = clean(r[0]);
    const category = clean(r[2]);
    const unit = clean(r[3]);
    const green = clean(r[4]);
    const yellow = clean(r[5]);
    if (name.startsWith("※")) break;
    if (name) current = name;
    if (!(category || unit || green || yellow)) continue;
    facility.push({ item: current || "", category, unit, green, yellow });
  }

  const facilityNote = clean(rows[12]?.[0] || "");
  const rentals = [];
  for (const r of rows.slice(15, 35)) {
    const item = clean(r[0]);
    const detail = clean(r[2]);
    const price = clean(r[5]);
    if (!item && !price) continue;
    if (item === "注意事項") break;
    rentals.push({ item, detail, price });
  }

  const notes = [];
  for (const r of rows.slice(36)) {
    const t = clean(r[0]);
    if (t && t !== "注意事項") notes.push(t);
  }

  const today = new Date().toISOString().slice(0, 10);
  return {
    title: clean(rows[0]?.[2]) || "長崎でてこいランド料金表",
    asOf: clean(rows[0]?.[5]) || "",
    sheetId: SHEET_ID,
    exportCsv: EXPORT_CSV,
    sourceUrl: SOURCE_URL,
    syncedAt: today,
    facilityNote,
    sections: [
      { id: "facility", title: "施設使用料金", kind: "facility", rows: facility },
      { id: "rental", title: "レンタル用品", kind: "rental", rows: rentals },
      { id: "notes", title: "注意事項", kind: "notes", items: notes },
    ],
  };
}

const res = await fetch(EXPORT_CSV, { redirect: "follow" });
if (!res.ok) {
  console.error(
    `Sheet export failed: HTTP ${res.status}.\n` +
      `Ask the client to share the sheet (リンクを知っている全員が閲覧可) or File → Share → Publish to web, then retry.\n` +
      EXPORT_CSV
  );
  process.exit(1);
}
const text = await res.text();
if (/<!DOCTYPE html>/i.test(text) || /accounts\.google/i.test(text)) {
  console.error(
    "Export returned HTML (likely private). Publish or share the sheet for public CSV export."
  );
  process.exit(1);
}

const data = buildData(parseCsv(text));
const body =
  "/* Generated from Google Sheet — run scripts/sync-pricing.mjs to refresh */\n" +
  "window.DETEKOI_PRICING = " +
  JSON.stringify(data, null, 2) +
  ";\n";
writeFileSync(OUT, body, "utf8");
console.log(
  `Wrote ${OUT} (${data.sections[0].rows.length} facility / ${data.sections[1].rows.length} rental / ${data.sections[2].items.length} notes)`
);
