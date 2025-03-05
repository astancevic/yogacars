import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
export const prerender = false

export async function POST({ request }) {
    try {
        const db = await open({
            filename: path.resolve('data', 'vehicles.db'),
            driver: sqlite3.Database,
        });

        const filters = await request.json();

        let query = `SELECT COUNT(*) AS count FROM vehicles`;
        const whereClauses: string[] = [];
        const params: any[] = [];

        if (filters.where) {
            Object.entries(filters.where).forEach(([key, value]) => {
                whereClauses.push(`${key} = ?`);
                params.push(value);
            });
        }

        if (whereClauses.length) {
            query += ` WHERE ` + whereClauses.join(' AND ');
        }

        const result = await db.get(query, ...params);
        return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error fetching vehicle count:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
