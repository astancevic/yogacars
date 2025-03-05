import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';

export async function GET() {
    try {
        const db = await open({
            filename: path.resolve('data', 'vehicles.db'),
            driver: sqlite3.Database,
        });

        const query = `
            SELECT DISTINCT v.body AS bodyType, v.manufacturer_id, v.model_id, v.drivetrain, v.dealerCity, 
                            v.fuel_type, v.mileage, v.year, p.msrp AS price
            FROM vehicles v
            JOIN pricing p ON v.pricing_id = p.id
        `;
        const result = await db.all(query);

        const modelsQuery = `SELECT DISTINCT id, name, manufacturer_id FROM models WHERE id IN (SELECT DISTINCT model_id FROM vehicles)`;
        const makeQuery = `SELECT DISTINCT name FROM manufacturers WHERE id IN (SELECT DISTINCT manufacturer_id FROM vehicles)`;

        const models = await db.all(modelsQuery);
        const make = await db.all(makeQuery);

        const prices = result.map((row: any) => row.price).filter(Boolean);
        const miles = result.map((row: any) => row.mileage).filter(Boolean);
        const years = result.map((row: any) => row.year).filter(Boolean);

        return new Response(JSON.stringify({
            make: make.map((row: any) => row.name),
            model: models.map((row: any) => ({ name: row.name, parent: row.manufacturer_id.toString() })),
            location: [...new Set(result.map((row: any) => row.dealerCity))].filter(Boolean),
            fuelType: [...new Set(result.map((row: any) => row.fuel_type))].filter(Boolean),
            bodyType: [...new Set(result.map((row: any) => row.bodyType))].filter(Boolean),
            drivetrain: [...new Set(result.map((row: any) => row.drivetrain))].filter(Boolean),
            price: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : undefined,
            miles: miles.length ? { min: Math.min(...miles), max: Math.max(...miles) } : undefined,
            year: years.length ? { min: Math.min(...years), max: Math.max(...years) } : undefined,
        }), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error fetching distinct filters:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
