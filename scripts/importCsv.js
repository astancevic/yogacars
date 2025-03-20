import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import csv from "csv-parser";

// Use absolute paths instead of relative paths
const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.resolve(DATA_DIR, "vehicles.db");

// Log paths to help debug
console.log("Working directory:", process.cwd());
console.log("Data directory:", DATA_DIR);
console.log("Database file path:", DB_FILE);

// Check if data directory exists, create if it doesn't
if (!fs.existsSync(DATA_DIR)) {
    console.log(`Creating data directory: ${DATA_DIR}`);
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Find all CSV files in the data directory
const csvFiles = fs.readdirSync(DATA_DIR)
    .filter(file => file.toLowerCase().endsWith('.csv'))
    .map(file => path.resolve(DATA_DIR, file));

if (csvFiles.length === 0) {
    console.error(`Error: No CSV files found in ${DATA_DIR}`);
    process.exit(1);
}

console.log(`Found ${csvFiles.length} CSV files: ${csvFiles.map(f => path.basename(f)).join(', ')}`);

async function createDatabase() {
    console.log("Opening database connection...");
    const db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database,
    });
    console.log("Database connection established.");

    // Create tables with UNIQUE constraints to prevent duplicates
    console.log("Creating tables...");
    await db.exec(`
        CREATE TABLE IF NOT EXISTS manufacturers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS models (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            manufacturer_id INTEGER,
            FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id),
            UNIQUE(name, manufacturer_id)
        );

        CREATE TABLE IF NOT EXISTS trims (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            model_id INTEGER,
            FOREIGN KEY (model_id) REFERENCES models(id),
            UNIQUE(name, model_id)
        );

        CREATE TABLE IF NOT EXISTS pricing (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            msrp REAL,
            misc_price1 REAL,
            misc_price2 REAL,
            misc_price3 REAL
        );

        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER,
            body TEXT,
            type TEXT,
            drivetrain TEXT,
            dealerCity TEXT,
            dealerState TEXT,
            fuel_type TEXT,
            mileage INTEGER,
            image_url TEXT,
            manufacturer_id INTEGER,
            sellingPrice INTEGER,
            model_id INTEGER,
            trim_id INTEGER,
            pricing_id INTEGER,
            FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id),
            FOREIGN KEY (model_id) REFERENCES models(id),
            FOREIGN KEY (trim_id) REFERENCES trims(id),
            FOREIGN KEY (pricing_id) REFERENCES pricing(id)
        );
    `);

    console.log("Database and tables created.");

    // Prepared statements for inserting records - all using OR IGNORE to prevent duplicates
    console.log("Preparing SQL statements...");
    const insertManufacturerStmt = await db.prepare(`
        INSERT OR IGNORE INTO manufacturers (name) VALUES (?)
    `);
    const insertModelStmt = await db.prepare(`
        INSERT OR IGNORE INTO models (name, manufacturer_id) VALUES (?, ?)
    `);
    const insertTrimStmt = await db.prepare(`
        INSERT OR IGNORE INTO trims (name, model_id) VALUES (?, ?)
    `);
    const insertPricingStmt = await db.prepare(`
        INSERT INTO pricing (msrp, misc_price1, misc_price2, misc_price3) VALUES (?, ?, ?, ?)
    `);
    const insertVehicleStmt = await db.prepare(`
        INSERT INTO vehicles (year, body, type, drivetrain, dealerCity, dealerState, fuel_type, mileage, image_url, manufacturer_id, model_id, trim_id, pricing_id, sellingPrice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Process each CSV file
    let totalRowsProcessed = 0;
    let totalRowsImported = 0;

    for (const csvFile of csvFiles) {
        const fileName = path.basename(csvFile);
        console.log(`\nProcessing file: ${fileName}`);

        // Track statistics for this file
        let fileRowsProcessed = 0;
        let fileRowsImported = 0;
        const fileInsertPromises = [];

        // Process the CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFile)
                .on('error', (err) => {
                    console.error(`Error reading CSV file ${fileName}:`, err);
                    reject(err);
                })
                .pipe(csv())
                .on("data", async (row) => {
                    fileRowsProcessed++;
                    totalRowsProcessed++;

                    try {
                        // Log progress every 100 rows
                        if (fileRowsProcessed % 100 === 0) {
                            console.log(`${fileName}: Processed ${fileRowsProcessed} rows...`);
                        }

                        // Field naming might vary across CSV files, handle different possible names
                        const make = row.Make || row.make || row.MAKE || row.Manufacturer || row.manufacturer;
                        const model = row.Model || row.model || row.MODEL;
                        const trim = row.Trim || row.trim || row.TRIM;
                        const msrp = row.MSRP || row.msrp || row.Price || row.price || row.PRICE;

                        // Validate the row - minimal requirements: make, model, and some price
                        if (!make || !model || !msrp) {
                            return; // Skip the row if required fields are missing
                        }

                        // Insert Manufacturer if not already present
                        const manufacturerResult = await db.get(`
                            SELECT id FROM manufacturers WHERE name = ?`, [make]);
                        let manufacturerId = manufacturerResult ? manufacturerResult.id : null;
                        if (!manufacturerId) {
                            const insertManufacturerResult = await insertManufacturerStmt.run(make);
                            manufacturerId = insertManufacturerResult.lastID;
                        }

                        // Insert Model if not already present based on model name and manufacturer_id
                        // Using SELECT based on the UNIQUE constraint to avoid duplicates
                        const modelResult = await db.get(`
                            SELECT id FROM models WHERE name = ? AND manufacturer_id = ?`, [model, manufacturerId]);
                        let modelId = modelResult ? modelResult.id : null;

                        if (!modelId) {
                            // If model does not exist, insert it
                            const insertModelResult = await insertModelStmt.run(model, manufacturerId);

                            // Get the ID of the newly inserted model, or the existing one if it was a duplicate
                            if (insertModelResult.lastID) {
                                modelId = insertModelResult.lastID;
                            } else {
                                // If no new row was inserted due to OR IGNORE, get the existing ID
                                const existingModel = await db.get(`
                                    SELECT id FROM models WHERE name = ? AND manufacturer_id = ?`,
                                    [model, manufacturerId]);
                                modelId = existingModel ? existingModel.id : null;
                            }
                        }

                        // Insert Trim if applicable and not already present
                        let trimId = null;
                        if (trim) {
                            const trimResult = await db.get(`
                                SELECT id FROM trims WHERE name = ? AND model_id = ?`, [trim, modelId]);
                            trimId = trimResult ? trimResult.id : null;
                            if (!trimId) {
                                const insertTrimResult = await insertTrimStmt.run(trim, modelId);

                                // Similar logic as model to handle OR IGNORE
                                if (insertTrimResult.lastID) {
                                    trimId = insertTrimResult.lastID;
                                } else {
                                    const existingTrim = await db.get(`
                                        SELECT id FROM trims WHERE name = ? AND model_id = ?`,
                                        [trim, modelId]);
                                    trimId = existingTrim ? existingTrim.id : null;
                                }
                            }
                        }

                        // Extract other data fields with fallbacks for different field names
                        const year = row.Year || row.year || row.YEAR || null;
                        const body = row.Body || row.body || row.BODY || row.BodyType || row.bodyType || row.bodytype || null;
                        const type = row.Type || row.type || row.TYPE || row.VehicleType || row.vehicleType || null;
                        const drivetrain = row.Drivetrain || row.drivetrain || row.DRIVETRAIN || null;
                        const dealerCity = row['Dealer City'] || row.DealerCity || row.dealerCity || row.City || row.city || null;
                        const dealerState = row['Dealer State'] || row.DealerState || row.dealerState || row.State || row.state || null;
                        const fuelType = row.Fuel_Type || row.FuelType || row.fuelType || row.fuel_type || row.FUEL_TYPE || null;
                        const mileage = row.Miles || row.miles || row.MILES || row.Mileage || row.mileage || row.MILEAGE || null;
                        const imageUrl = row.ImageList || row.ImageURL || row.imageURL || row.ImageUrl || row.imageUrl || row.image_url || null;

                        // Handle price data
                        const miscPrice1 = row.MiscPrice1 || row.miscPrice1 || row.OtherPrice1 || null;
                        const miscPrice2 = row.MiscPrice2 || row.miscPrice2 || row.OtherPrice2 || null;
                        const miscPrice3 = row.MiscPrice3 || row.miscPrice3 || row.OtherPrice3 || null;

                        const sellingPrice = row.SellingPrice;

                        // Insert Pricing
                        const insertPricingResult = await insertPricingStmt.run(
                            msrp, miscPrice1, miscPrice2, miscPrice3
                        );
                        const pricingId = insertPricingResult.lastID;

                        // Insert Vehicle
                        fileInsertPromises.push(
                            insertVehicleStmt.run(
                                year, body, type, drivetrain, dealerCity, dealerState,
                                fuelType, mileage, imageUrl, manufacturerId, modelId,
                                trimId, pricingId, sellingPrice
                            )
                        );

                        fileRowsImported++;
                        totalRowsImported++;
                    } catch (err) {
                        console.error(`Error processing row ${fileRowsProcessed} in ${fileName}:`, err);
                    }
                })
                .on("end", () => {
                    console.log(`File ${fileName} reading complete. Processed ${fileRowsProcessed} rows.`);
                    resolve();
                })
                .on("error", (err) => {
                    console.error(`Error parsing CSV ${fileName}:`, err);
                    reject(err);
                });
        });

        // Wait for all inserts from this file to complete
        await Promise.all(fileInsertPromises);
        console.log(`File ${fileName} import complete. Imported ${fileRowsImported} vehicles.`);
    }

    // Finalize the statements after all inserts are completed
    try {
        console.log("\nFinalizing prepared statements.");
        await insertManufacturerStmt.finalize();
        await insertModelStmt.finalize();
        await insertTrimStmt.finalize();
        await insertPricingStmt.finalize();
        await insertVehicleStmt.finalize();
    } catch (err) {
        console.error("Error finalizing statements:", err);
    }

    // Create some useful indexes
    console.log("Creating indexes...");
    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_vehicles_manufacturer ON vehicles(manufacturer_id);
        CREATE INDEX IF NOT EXISTS idx_vehicles_model ON vehicles(model_id);
        CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
        CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
        CREATE INDEX IF NOT EXISTS idx_vehicles_mileage ON vehicles(mileage);
        CREATE INDEX IF NOT EXISTS idx_vehicles_body ON vehicles(body);
    `);

    // Function to deduplicate existing models if needed
    async function deduplicateModels() {
        console.log("Checking for duplicate models...");

        // First, identify duplicate models (these shouldn't exist with new constraints but check anyway)
        const duplicates = await db.all(`
            SELECT name, manufacturer_id, COUNT(*) as count
            FROM models
            GROUP BY name, manufacturer_id
            HAVING count > 1
        `);

        console.log(`Found ${duplicates.length} model names with duplicates`);

        // For each set of duplicates, keep one and update references
        for (const dup of duplicates) {
            // Get all IDs for this duplicate set
            const modelIds = await db.all(`
                SELECT id
                FROM models
                WHERE name = ? AND manufacturer_id = ?
                ORDER BY id
            `, [dup.name, dup.manufacturer_id]);

            // Keep the first ID, remove the others
            const keepId = modelIds[0].id;
            const removeIds = modelIds.slice(1).map(m => m.id);

            console.log(`Keeping model ID ${keepId} for "${dup.name}" and removing IDs: ${removeIds.join(', ')}`);

            // Update vehicle references to the duplicate models
            for (const removeId of removeIds) {
                await db.run(`
                    UPDATE vehicles
                    SET model_id = ?
                    WHERE model_id = ?
                `, [keepId, removeId]);

                // Update trim references
                await db.run(`
                    UPDATE trims
                    SET model_id = ?
                    WHERE model_id = ?
                `, [keepId, removeId]);
            }

            // Delete the duplicate model entries
            await db.run(`
                DELETE FROM models
                WHERE id IN (${removeIds.map(() => '?').join(',')})
            `, removeIds);
        }

        console.log("Model deduplication check complete.");
    }

    // Run the deduplication function
    await deduplicateModels();

    console.log("\nAll CSV files processed.");
    console.log(`Total rows processed: ${totalRowsProcessed}`);
    console.log(`Total rows imported: ${totalRowsImported}`);
}

// Run the database creation and import
createDatabase().catch((err) => {
    console.error("Error during database creation and import:", err);
});