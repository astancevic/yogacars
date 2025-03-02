import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from "node:path";

// Function to fetch vehicles from SQLite
export async function getVehicles() {
    try {

        const dbPath = path.resolve('data', 'vehicles.db'); // Adjust based on your file structure
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });


    const vehicles = await db.all(`
    SELECT v.year, v.type, v.dealerCity, v.dealerState, v.fuel_type, v.mileage, v.image_url, v.drivetrain, m.name AS make_name, mo.name AS model_name, t.name AS trim, p.msrp AS sellingPrice
    FROM vehicles v
    JOIN manufacturers m ON v.manufacturer_id = m.id
    JOIN models mo ON v.model_id = mo.id
    JOIN trims t ON v.trim_id = t.id
    JOIN pricing p ON v.pricing_id = p.id
    LIMIT 30
  `);

        const count = await db.get(`
            SELECT COUNT(*) AS totalCount
            FROM vehicles v
        `);

    await db.close();

    return {vehicles, count};
    }catch (error) {
        console.log('Error: ', error);
    }
}
