import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import nodePath from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function GET() {
  try {
    const db = await open({
      filename: nodePath.resolve("data", "vehicles.db"),
      driver: sqlite3.Database
    });
    const vehicles = await db.all(`
            SELECT v.year, v.type, v.dealerCity, v.dealerState, v.fuel_type, v.mileage, v.image_url, v.drivetrain,
                   m.name AS make_name, mo.name AS model_name, t.name AS trim, p.msrp AS sellingPrice
            FROM vehicles v
            JOIN manufacturers m ON v.manufacturer_id = m.id
            JOIN models mo ON v.model_id = mo.id
            JOIN trims t ON v.trim_id = t.id
            JOIN pricing p ON v.pricing_id = p.id
            LIMIT 30
        `);
    const count = await db.get(`SELECT COUNT(*) AS totalCount FROM vehicles`);
    return new Response(JSON.stringify({ vehicles, count }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
