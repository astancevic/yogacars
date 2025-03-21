// src/pages/api/fetchVehicleFilters.ts
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
export const prerender = false
export const config = { runtime: 'edge' };

export async function GET() {
    try {
        const db = await open({
            filename: path.resolve('data', 'vehicles.db'),
            driver: sqlite3.Database,
        });

        // Get distinct values for various filter categories
        const query = `
            SELECT 
                v.body AS bodyType, 
                v.drivetrain, 
                v.dealerCity, 
                v.fuel_type, 
                v.mileage, 
                v.year, 
                p.msrp AS price
            FROM vehicles v
            JOIN pricing p ON v.pricing_id = p.id
        `;
        const vehicleData = await db.all(query);

        // Get manufacturers (makes)
        const makesQuery = `
            SELECT DISTINCT m.id, m.name
            FROM manufacturers m
            JOIN vehicles v ON m.id = v.manufacturer_id
            ORDER BY m.name
        `;
        const makes = await db.all(makesQuery);

        // Get models with their parent manufacturer
        const modelsQuery = `
            SELECT DISTINCT mo.id, mo.name, mo.manufacturer_id as parent
            FROM models mo
            JOIN vehicles v ON mo.id = v.model_id
            ORDER BY mo.name
        `;
        const models = await db.all(modelsQuery);

        // Extract distinct values and calculate ranges
        const prices = vehicleData.map(row => row.price).filter(Boolean);
        const miles = vehicleData.map(row => row.mileage).filter(Boolean);
        const years = vehicleData.map(row => row.year).filter(Boolean);
        const locations = [...new Set(vehicleData.map(row => row.dealerCity))].filter(Boolean);
        const fuelTypes = [...new Set(vehicleData.map(row => row.fuel_type))].filter(Boolean);
        const bodyTypes = [...new Set(vehicleData.map(row => row.bodyType))].filter(Boolean);
        const drivetrains = [...new Set(vehicleData.map(row => row.drivetrain))].filter(Boolean);

        // Format the filter data for the frontend
        const filterData = {
            // Array filters - converted to checkboxes
            make: makes.map(make => make.name),
            model: models.map(model => ({
                name: model.name,
                parent: model.parent.toString()
            })),
            location: locations,
            fuelType: fuelTypes,
            bodyType: bodyTypes.filter(type => type && type !== 'unknown'),
            drivetrain: drivetrains,

            // Range filters
            price: prices.length ? {
                min: Math.floor(Math.min(...prices)),
                max: Math.ceil(Math.max(...prices))
            } : { min: 0, max: 100000 },

            miles: miles.length ? {
                min: Math.floor(Math.min(...miles)),
                max: Math.ceil(Math.max(...miles))
            } : { min: 0, max: 150000 },

            year: years.length ? {
                min: Math.min(...years),
                max: Math.max(...years)
            } : { min: 2015, max: new Date().getFullYear() + 1 },

            // Store counts for each category for analytics
            counts: {
                makes: makes.length,
                models: models.length,
                locations: locations.length,
                bodyTypes: bodyTypes.length
            }
        };

        return new Response(JSON.stringify(filterData), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching vehicle filters:', error);
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? error : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}