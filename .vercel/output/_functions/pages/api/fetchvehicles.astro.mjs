import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import nodePath from 'node:path';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  try {
    const db = await open({
      filename: nodePath.resolve("data", "vehicles.db"),
      driver: sqlite3.Database
    });
    const filters = await request.json();
    let query = `SELECT vin, body, bodyType, dateInStock, invoice, sellingPrice, year, type, miles, dealerState, dealerCity, trim, heroImageUrl,
                     (SELECT name FROM makes WHERE makes.id = vehicles.makeId) AS makeName,
                     (SELECT name FROM models WHERE models.id = vehicles.modelId) AS modelName
                     FROM vehicles`;
    const whereClauses = [];
    const params = [];
    if (filters.where) {
      Object.entries(filters.where).forEach(([key, value]) => {
        whereClauses.push(`${key} = ?`);
        params.push(value);
      });
    }
    if (whereClauses.length) {
      query += ` WHERE ` + whereClauses.join(" AND ");
    }
    if (filters.orderBy) {
      query += ` ORDER BY ${filters.orderBy}`;
    }
    if (filters.take) {
      query += ` LIMIT ?`;
      params.push(filters.take);
    }
    if (filters.skip) {
      query += ` OFFSET ?`;
      params.push(filters.skip);
    }
    const vehicles = await db.all(query, ...params);
    return new Response(JSON.stringify(vehicles), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
