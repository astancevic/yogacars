// src/pages/api/vehicles.ts
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
export const prerender = false

export async function GET() {
    try {
        // Initialize database connection inside the API function
        const db = await open({
            filename: path.resolve('data', 'vehicles.db'),
            driver: sqlite3.Database,
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
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
