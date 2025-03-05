import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import nodePath from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ request }) {
  try {
    const db = await open({
      filename: nodePath.resolve("data", "vehicles.db"),
      driver: sqlite3.Database
    });
    const filters = await request.json();
    let query = `SELECT COUNT(*) AS count FROM vehicles`;
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
    const result = await db.get(query, ...params);
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error fetching vehicle count:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
