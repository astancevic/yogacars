import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from "node:path";

const dbPath = path.resolve('data', 'vehicles.db');
const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
});

export async function getVehicles() {
    try {
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


    return {vehicles, count};
    }catch (error) {
        console.log('Error: ', error);
    }
}

export const fetchVehicles = async (filters: any) => {
    let query = `SELECT vin, body, bodyType, dateInStock, invoice, sellingPrice, year, type, miles, dealerState, dealerCity, trim, heroImageUrl,
                 (SELECT name FROM makes WHERE makes.id = vehicles.makeId) AS makeName,
                 (SELECT name FROM models WHERE models.id = vehicles.modelId) AS modelName
                 FROM vehicles`;

    const whereClauses: string[] = [];
    const params: Record<string, any> = {};

    if (filters.where) {
        Object.entries(filters.where).forEach(([key, value]) => {
            whereClauses.push(`${key} = ?`);
            params[key] = value;
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
        params.take = filters.take;
    }

    if (filters.skip) {
        query += ` OFFSET ?`;
        params.skip = filters.skip;
    }

    // Execute query asynchronously
    const result = await db.all(query, ...Object.values(params));
    return result;
};

export const fetchVehicleCount = async (filters: any) => {
    let query = `SELECT COUNT(*) AS count FROM vehicles`;
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filters && filters.where) {
        Object.entries(filters.where).forEach(([key, value]) => {
            whereClauses.push(`${key} = ?`);
            params.push(value);
        });
    }

    if (whereClauses.length) {
        query += ` WHERE ` + whereClauses.join(' AND ');
    }

    const result = await db.get(query, ...params);
    return result;
};

export const fetchDistinctTrims = async () => {
    const query = `SELECT DISTINCT trim FROM vehicles`;
    // Execute query asynchronously
    const result = await db.all(query);
    return result;
};