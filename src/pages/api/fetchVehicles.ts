import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
export const prerender = false
export const config = { runtime: 'edge' };

export async function POST({ request }) {
    try {
        const db = await open({
            filename: path.resolve('data', 'vehicles.db'),
            driver: sqlite3.Database,
        });

        const filters = await request.json();

        let query = `SELECT vin, body, bodyType, dateInStock, invoice, sellingPrice, year, type, miles, dealerState, dealerCity, trim, heroImageUrl,
                     (SELECT name FROM makes WHERE makes.id = vehicles.makeId) AS makeName,
                     (SELECT name FROM models WHERE models.id = vehicles.modelId) AS modelName
                     FROM vehicles`;

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
        return new Response(JSON.stringify(vehicles), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
