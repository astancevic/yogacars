// import fs from "fs";
// import sqlite3 from "sqlite3";
// import { open } from "sqlite";
// import csv from "csv-parser";
// import path from "path";
//
// // Use absolute paths for files
// const CSV_FILE = path.resolve(__dirname, "../data/vehicles.csv");
// const DB_FILE = path.resolve(__dirname, "../data/vehicles.db");
//
// async function createDatabase() {
//     const db = await open({
//         filename: DB_FILE,
//         driver: sqlite3.Database,
//     });
//
//     // Create tables if they do not exist
//     await db.exec(`
//         CREATE TABLE IF NOT EXISTS manufacturers (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT UNIQUE NOT NULL
//         );
//
//         CREATE TABLE IF NOT EXISTS models (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             manufacturer_id INTEGER,
//             FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
//         );
//
//         CREATE TABLE IF NOT EXISTS trims (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             model_id INTEGER,
//             FOREIGN KEY (model_id) REFERENCES models(id)
//         );
//
//         CREATE TABLE IF NOT EXISTS pricing (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             msrp REAL,
//             misc_price1 REAL,
//             misc_price2 REAL,
//             misc_price3 REAL
//         );
//
//         CREATE TABLE IF NOT EXISTS vehicles (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             year INTEGER,
//             body TEXT,
//             type TEXT,
//             drivetrain TEXT,
//             dealerCity TEXT,
//             dealerState TEXT,
//             fuel_type TEXT,
//             mileage INTEGER,
//             image_url TEXT,
//             manufacturer_id INTEGER,
//             model_id INTEGER,
//             trim_id INTEGER,
//             pricing_id INTEGER,
//             FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id),
//             FOREIGN KEY (model_id) REFERENCES models(id),
//             FOREIGN KEY (trim_id) REFERENCES trims(id),
//             FOREIGN KEY (pricing_id) REFERENCES pricing(id)
//         );
//     `);
//
//     console.log("Database and tables created.");
//
//     // Prepare insert statements
//     const insertManufacturerStmt = await db.prepare(`
//         INSERT OR IGNORE INTO manufacturers (name) VALUES (?)
//     `);
//     const insertModelStmt = await db.prepare(`
//         INSERT OR IGNORE INTO models (name, manufacturer_id) VALUES (?, ?)
//     `);
//     const insertTrimStmt = await db.prepare(`
//         INSERT OR IGNORE INTO trims (name, model_id) VALUES (?, ?)
//     `);
//     const insertPricingStmt = await db.prepare(`
//         INSERT INTO pricing (msrp, misc_price1, misc_price2, misc_price3) VALUES (?, ?, ?, ?)
//     `);
//     const insertVehicleStmt = await db.prepare(`
//         INSERT INTO vehicles (year, body, type, drivetrain, dealerCity, dealerState, fuel_type, mileage, image_url, manufacturer_id, model_id, trim_id, pricing_id)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);
//
//     // Explicitly define the type of insertDataPromises as an array of Promises
//     const insertDataPromises: Promise<any>[] = [];
//
//     fs.createReadStream(CSV_FILE)
//         .pipe(csv())
//         .on("data", async (row) => {
//             try {
//                 // Validate the row
//                 if (!row.Make || !row.Model || !row.Trim || !row.MSRP) {
//                     console.log(`Skipping row due to missing fields: ${JSON.stringify(row)}`);
//                     return;
//                 }
//
//                 console.log(`Processing row: ${JSON.stringify(row)}`);
//
//                 // Insert Manufacturer
//                 let manufacturerId = await db.get(`
//                     SELECT id FROM manufacturers WHERE name = ?`, [row.Make]);
//                 if (!manufacturerId) {
//                     const result = await insertManufacturerStmt.run(row.Make);
//                     manufacturerId = result.lastID;
//                 }
//                 console.log(`Inserted manufacturer: ${row.Make}`);
//
//                 // Insert Model
//                 let modelId = await db.get(`
//                     SELECT id FROM models WHERE name = ? AND manufacturer_id = ?`, [row.Model, manufacturerId]);
//                 if (!modelId) {
//                     const result = await insertModelStmt.run(row.Model, manufacturerId);
//                     modelId = result.lastID;
//                 }
//                 console.log(`Inserted model: ${row.Model}`);
//
//                 // Insert Trim
//                 let trimId = await db.get(`
//                     SELECT id FROM trims WHERE name = ? AND model_id = ?`, [row.Trim, modelId]);
//                 if (!trimId && row.Trim) {
//                     const result = await insertTrimStmt.run(row.Trim, modelId);
//                     trimId = result.lastID;
//                 }
//                 console.log(`Inserted trim: ${row.Trim}`);
//
//                 // Insert Pricing
//                 const result = await insertPricingStmt.run(row.MSRP, row.MiscPrice1, row.MiscPrice2, row.MiscPrice3);
//                 const pricingId = result.lastID;
//                 console.log(`Inserted pricing: ${row.MSRP}`);
//
//                 // Insert Vehicle
//                 insertDataPromises.push(
//                     insertVehicleStmt.run(
//                         row.Year, row.Body, row.Type, row.Drivetrain, row['Dealer City'], row['Dealer State'], row.Fuel_Type,
//                         row.Miles, row.ImageList, manufacturerId, modelId, trimId, pricingId
//                     )
//                 );
//                 console.log(`Inserted vehicle: ${row.Year}, ${row.Body}`);
//
//             } catch (err) {
//                 console.error("Error inserting row:", err);
//             }
//         })
//         .on("end", async () => {
//             console.log("CSV file successfully processed.");
//
//             // Wait for all insert promises to resolve
//             await Promise.all(insertDataPromises);
//
//             try {
//                 console.log("Finalizing prepared statements.");
//                 await insertManufacturerStmt.finalize();
//                 await insertModelStmt.finalize();
//                 await insertTrimStmt.finalize();
//                 await insertPricingStmt.finalize();
//                 await insertVehicleStmt.finalize();
//             } catch (err) {
//                 console.error("Error finalizing statements:", err);
//             }
//
//             // Close the database connection
//             await db.close();
//         })
//         .on("error", (err) => {
//             console.error("CSV parsing error:", err);
//         });
// }
//
// createDatabase().catch((err) => console.error("Database error:", err));
