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
export async function getPopularMakes(limit: number = 4): Promise<Make[]> {
    const db = await getDb();
    try {
        // Query to fetch top makes with most vehicles, including their models and one vehicle per model
        const sql = `
            -- Get popular makes with most vehicles
            WITH PopularMakes AS (
                SELECT 
                    m.id AS make_id,
                    m.name,
                    COUNT(v.id) AS vehicle_count
                FROM 
                    manufacturers m
                JOIN 
                    vehicles v ON v.manufacturer_id = m.id
                GROUP BY 
                    m.id, m.name
                ORDER BY 
                    vehicle_count DESC
                LIMIT ?
            )
            
            -- Select makes with their most popular models
            SELECT 
                pm.make_id AS id,
                pm.name,
                json_group_array(
                    json_object(
                        'id', mod.id,
                        'name', mod.name,
                        'vehicles', json_array(
                            (
                                SELECT json_object(
                                    'vin', v.id,
                                    'body', v.body,
                                    'year', v.year,
                                    'type', v.type,
                                    'miles', v.mileage,
                                    'dealerState', v.dealerState,
                                    'dealerCity', v.dealerCity,
                                    'trim', (SELECT t.name FROM trims t WHERE t.id = v.trim_id),
                                    'heroImageUrl', v.image_url,
                                    'invoice', (SELECT p.msrp FROM pricing p WHERE p.id = v.pricing_id),
                                    'make', json_object('name', pm.name),
                                    'model', json_object('name', mod.name)
                                )
                                FROM vehicles v
                                WHERE v.model_id = mod.id
                                ORDER BY v.year DESC
                                LIMIT 1
                            )
                        )
                    )
                ) AS models
            FROM 
                PopularMakes pm
            JOIN 
                models mod ON mod.manufacturer_id = pm.make_id
            GROUP BY 
                pm.make_id, pm.name
            ORDER BY 
                pm.vehicle_count DESC
        `;

        const statement = await getPreparedStatement(db, sql);
        const results = await statement.all(limit) as any[];

        // Process the results to convert the JSON string to an actual object
        return results.map(make => {
            // Parse the JSON array string into an actual array
            let models;
            try {
                models = JSON.parse(make.models);
            } catch (e) {
                console.error("Error parsing models JSON:", e);
                models = [];
            }

            // Return properly formatted make object
            return {
                id: make.id,
                name: make.name,
                models: models.slice(0, 10).map((model: any) => {
                    // Ensure the vehicles array exists and each vehicle has necessary properties
                    let vehicles = [];
                    if (model.vehicles && Array.isArray(model.vehicles)) {
                        vehicles = model.vehicles.map((vehicle: any) => {
                            // If vehicle is a string (serialized JSON), parse it
                            if (typeof vehicle === 'string') {
                                try {
                                    vehicle = JSON.parse(vehicle);
                                } catch (e) {
                                    console.error("Error parsing vehicle JSON:", e);
                                    return null;
                                }
                            }

                            if (!vehicle) return null;

                            // Ensure all required properties exist
                            return {
                                vin: vehicle.vin || `unknown-${make.id}-${model.id}`,
                                body: vehicle.body || '',
                                year: vehicle.year || new Date().getFullYear(),
                                type: vehicle.type || 'Unknown',
                                miles: vehicle.miles || 0,
                                dealerState: vehicle.dealerState || '',
                                dealerCity: vehicle.dealerCity || '',
                                trim: vehicle.trim || '',
                                heroImageUrl: vehicle.heroImageUrl || '',
                                invoice: vehicle.invoice || null,
                                make: vehicle.make || { name: make.name },
                                model: vehicle.model || { name: model.name }
                            };
                        }).filter(Boolean);
                    }

                    return {
                        id: model.id,
                        name: model.name,
                        vehicles: vehicles
                    };
                })
            };
        });
    } catch (error) {
        console.error('Error fetching popular makes:', error);

        // If the CTE approach fails (older SQLite version), fall back to a simpler query
        try {
            // Fallback query that just returns makes ordered by name
            const fallbackSql = `
                SELECT DISTINCT m.id, m.name
                FROM manufacturers m
                JOIN vehicles v ON v.manufacturer_id = m.id
                ORDER BY m.name ASC
                LIMIT ?
            `;

            const fallbackStatement = await getPreparedStatement(db, fallbackSql);
            const makesList = await fallbackStatement.all(limit) as any[];

            // Create a response with the correct structure even in fallback mode
            return makesList.map(make => ({
                id: make.id,
                name: make.name,
                models: []
            }));
        } catch (fallbackError) {
            console.error('Error with fallback query:', fallbackError);
            return [];
        }
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