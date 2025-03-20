// src/lib/db/optimized-db.ts
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from "node:path";
import { fileURLToPath } from 'url';

export interface Make {
    id: number;
    name: string;
}

export interface Model {
    id: number;
    name: string;
    manufacturer: string;
}

// Create singleton DB connection
let dbPromise: Promise<Database<sqlite3.Database>> | null = null;
const DB_PATH = path.resolve('data', 'vehicles.db');

/**
 * Initialize database connection with optimized settings
 */
export async function getDb(): Promise<Database<sqlite3.Database>> {
    if (!dbPromise) {
        dbPromise = open({
            filename: DB_PATH,
            driver: sqlite3.Database,
            // Add optimized SQLite configuration
            mode: sqlite3.OPEN_READONLY, // Read-only mode for better performance
        }).then(db => {
            // Set pragmas for better performance
            return db.exec(`
                PRAGMA journal_mode = OFF;
                PRAGMA synchronous = OFF;
                PRAGMA cache_size = 10000;
                PRAGMA temp_store = MEMORY;
                PRAGMA mmap_size = 30000000000;
            `).then(() => db);
        });
    }
    return dbPromise;
}

/**
 * Prepared statement cache to avoid recompiling statements
 */
const statementCache = new Map<string, any>();

/**
 * Get cached prepared statement
 */
async function getPreparedStatement(db: Database<sqlite3.Database>, sql: string): Promise<any> {
    if (!statementCache.has(sql)) {
        const statement = await db.prepare(sql);
        statementCache.set(sql, statement);
    }
    return statementCache.get(sql);
}

/**
 * Get all distinct vehicle types (conditions) with optimized query
 */
export async function getVehicleTypes(): Promise<string[]> {
    const db = await getDb();
    try {
        // Use indexed column for faster distinct selection
        const sql = 'SELECT DISTINCT type FROM vehicles WHERE type IS NOT NULL';
        const statement = await getPreparedStatement(db, sql);
        const result = await statement.all();
        return result.map(row => row.type as string);
    } catch (error) {
        console.error('Error fetching vehicle types:', error);
        return [];
    }
}

/**
 * Get max and min prices with optimized query
 */
export async function getMaxMinPrice(): Promise<any> {
    const db = await getDb();
    try {
        // Use direct index scan instead of full table scan
        const sql = 'SELECT MAX(sellingPrice) as maxPrice, MIN(sellingPrice) as minPrice FROM vehicles WHERE sellingPrice IS NOT NULL';
        const statement = await getPreparedStatement(db, sql);
        return await statement.get();
    } catch (error) {
        console.error('Error fetching price range:', error);
        return { maxPrice: 100000, minPrice: 0 };
    }
}

/**
 * Get all makes with optimized query, optionally filtered by vehicle type
 */
export async function getMakes(type: string | null = null): Promise<Make[]> {
    const db = await getDb();
    try {
        let sql: string;
        const params: any[] = [];

        if (type) {
            // Query to fetch makes where vehicles have a specific type
            sql = `
                SELECT DISTINCT m.id, m.name
                FROM manufacturers m
                JOIN vehicles v ON v.manufacturer_id = m.id
                WHERE v.type = ?
                ORDER BY m.name ASC
            `;
            params.push(type);
        } else {
            // Query to fetch all manufacturers, regardless of vehicle type
            sql = `
                SELECT DISTINCT m.id, m.name
                FROM manufacturers m
                JOIN vehicles v ON v.manufacturer_id = m.id
                ORDER BY m.name ASC
            `;
        }

        const statement = await getPreparedStatement(db, sql);
        return await statement.all(params) as Make[];
    } catch (error) {
        console.error('Error fetching makes:', error);
        return [];
    }
}

/**
 * Get all models with optimized query, optionally filtered by manufacturer and/or vehicle type
 */
export async function getModels(manufacturerId: number | null = null, type: string | null = null): Promise<Model[]> {
    const db = await getDb();
    console.log('manufacturerId:', manufacturerId);
    try {
        let sql: string;
        const params: any[] = []; // Params array to use for positional placeholders

        // Base query with optimized joins
        sql = `
            SELECT DISTINCT mod.id, mod.name, man.name AS manufacturer
            FROM models mod
            JOIN manufacturers man ON mod.manufacturer_id = man.id
        `;

        // Only join the vehicles table if we need to filter by type
        if (type) {
            sql += ` JOIN vehicles v ON mod.id = v.model_id AND v.type = ?`;
            params.push(type); // Add type to the params array
        }

        // Add manufacturer filter if provided
        if (manufacturerId !== null) {
            // If both filters are used, we need to add AND to the WHERE clause
            if (params.length > 0) {
                sql += ` AND mod.manufacturer_id = ?`;
            } else {
                sql += ` WHERE mod.manufacturer_id = ?`;
            }
            params.push(manufacturerId); // Add manufacturerId to the params array
        }

        sql += ` ORDER BY mod.name ASC`;

        const statement = await getPreparedStatement(db, sql);
        return await statement.all(params) as Model[];
    } catch (error) {
        console.error('Error fetching models:', error);
        return [];
    }
}