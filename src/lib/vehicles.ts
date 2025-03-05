import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from "node:path";
import type {FilterState} from "@/components/Car/SideBarFilters.tsx";

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

export const fetchDistinctFilters = async (): Promise<FilterState> => {
    try {
        // Fetch distinct values from `vehicles`, joining pricing for price
        const query = `
            SELECT DISTINCT v.body AS bodyType,
                            v.manufacturer_id, 
                            v.model_id, 
                            v.drivetrain, 
                            v.dealerCity, 
                            v.fuel_type,
                            v.mileage,
                            v.year,
                            p.msrp AS price
            FROM vehicles v
            JOIN pricing p ON v.pricing_id = p.id
        `;

        const result = await db.all(query);

        // Fetch distinct models
        const modelsQuery = `
            SELECT DISTINCT id, name, manufacturer_id 
            FROM models
            WHERE id IN (SELECT DISTINCT model_id FROM vehicles)
        `;

        // Fetch distinct manufacturers
        const makeQuery = `
            SELECT DISTINCT name 
            FROM manufacturers
            WHERE id IN (SELECT DISTINCT manufacturer_id FROM vehicles)
        `;

        // Execute queries
        const models = await db.all(modelsQuery);
        const make = await db.all(makeQuery);

        // Extract min and max values for price, miles, and year
        const prices = result.map((row: any) => row.price).filter(Boolean);
        const miles = result.map((row: any) => row.mileage).filter(Boolean);
        const years = result.map((row: any) => row.year).filter(Boolean);

        return {
            make: make.map((row: any) => row.name), // Array of strings
            model: models.map((row: any) => ({ name: row.name, parent: row.manufacturer_id.toString() })), // Parent as string
            location: [...new Set(result.map((row: any) => row.dealerCity))].filter(Boolean),
            fuelType: [...new Set(result.map((row: any) => row.fuel_type))].filter(Boolean),
            bodyType: [...new Set(result.map((row: any) => row.bodyType))].filter(Boolean),
            drivetrain: [...new Set(result.map((row: any) => row.drivetrain))].filter(Boolean),
            price: prices.length
                ? { min: Math.min(...prices), max: Math.max(...prices) }
                : undefined,
            miles: miles.length
                ? { min: Math.min(...miles), max: Math.max(...miles) }
                : undefined,
            year: years.length
                ? { min: Math.min(...years), max: Math.max(...years) }
                : undefined,
        };
    } catch (error) {
        console.error("Error fetching distinct filters:", error);
        throw error;
    }
};