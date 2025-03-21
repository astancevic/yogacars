import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from "node:path";

export const prerender = false;
export const config = { runtime: 'edge' };

export async function GET({ request }) {
    try {
        // Get the URL from the request
        const url = new URL(request.url);
        const params = url.searchParams;

        console.log("Vehicle API received params:", Object.fromEntries(params.entries()));

        // Initialize database connection
        const db = await open({
            filename: path.resolve('data', 'vehicles.db'),
            driver: sqlite3.Database,
        });

        // Base query with all joins
        let baseQuery = `
            SELECT 
                v.year, 
                v.body AS bodyType, 
                v.type, 
                v.dealerCity, 
                v.dealerState, 
                v.fuel_type, 
                v.mileage, 
                v.image_url, 
                v.drivetrain,
                m.name AS make_name, 
                mo.name AS model_name, 
                t.name AS trim, 
                p.msrp AS sellingPrice
            FROM vehicles v
            JOIN manufacturers m ON v.manufacturer_id = m.id
            JOIN models mo ON v.model_id = mo.id
            JOIN trims t ON v.trim_id = t.id
            JOIN pricing p ON v.pricing_id = p.id
        `;

        // Filter and query parameter handling
        const whereClauses: string[] = [];
        const queryParams: any[] = [];

        // Helper function to handle multiple value filters
        const addMultiValueFilter = (paramName: string, columnName: string) => {
            if (params.has(paramName)) {
                const values = params.get(paramName)!.split(',');
                if (values.length > 0) {
                    const placeholders = values.map(() => '?').join(',');
                    whereClauses.push(`${columnName} IN (${placeholders})`);
                    queryParams.push(...values);
                }
            }
        };

        // Make filter
        addMultiValueFilter('make', 'm.name');

        // Model filter
        addMultiValueFilter('model', 'mo.name');

        // Body Type filter
        addMultiValueFilter('bodyType', 'v.body');

        // Drivetrain filter
        addMultiValueFilter('drivetrain', 'v.drivetrain');

        // Fuel Type filter
        addMultiValueFilter('fuelType', 'v.fuel_type');

        // Location filter
        addMultiValueFilter('location', 'v.dealerCity');

        // Price Range filter
        if (params.has('minPrice')) {
            console.log("Min price:", params.get('minPrice'));
            whereClauses.push('p.msrp >= ?');
            queryParams.push(Number(params.get('minPrice')));
        }
        if (params.has('maxPrice')) {
            whereClauses.push('p.msrp <= ?');
            queryParams.push(Number(params.get('maxPrice')));
        }

        // Mileage Range filter
        if (params.has('minMiles')) {
            whereClauses.push('v.mileage >= ?');
            queryParams.push(Number(params.get('minMiles')));
        }
        if (params.has('maxMiles')) {
            whereClauses.push('v.mileage <= ?');
            queryParams.push(Number(params.get('maxMiles')));
        }

        // Year Range filter
        if (params.has('minYear')) {
            whereClauses.push('v.year >= ?');
            queryParams.push(Number(params.get('minYear')));
        }
        if (params.has('maxYear')) {
            whereClauses.push('v.year <= ?');
            queryParams.push(Number(params.get('maxYear')));
        }

        // Add WHERE clause if any filters exist
        const whereClause = whereClauses.length > 0
            ? `WHERE ${whereClauses.join(' AND ')}`
            : '';

        // Sorting
        let orderClause = 'ORDER BY v.year DESC';
        if (params.has('orderBy')) {
            const orderBy = params.get('orderBy');
            const direction = params.has('direction') ? params.get('direction') : 'DESC';

            const columnMap = {
                'selling_price': 'p.msrp',
                'newest': 'v.year',
                'highest_price': 'p.msrp',
                'lowest_price': 'p.msrp',
                'highest_mileage': 'v.mileage',
                'lowest_mileage': 'v.mileage'
            };

            const column = columnMap[orderBy] || 'v.year';
            orderClause = `ORDER BY ${column} ${direction}`;
        }

        // Pagination
        const take = params.has('take') ? parseInt(params.get('take')) : 24;
        const skip = params.has('skip') ? parseInt(params.get('skip')) : 0;

        // Construct full query for vehicles
        const fullQuery = `${baseQuery} ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
        queryParams.push(take, skip);

        // Construct count query
        const countQuery = `
            SELECT COUNT(*) AS count
            FROM vehicles v
            JOIN manufacturers m ON v.manufacturer_id = m.id
            JOIN models mo ON v.model_id = mo.id
            JOIN trims t ON v.trim_id = t.id
            JOIN pricing p ON v.pricing_id = p.id
            ${whereClause}
        `;

        console.log("Executing query:", fullQuery);
        console.log("With params:", queryParams);

        // Execute both queries
        const vehicles = await db.all(fullQuery, ...queryParams);
        const countResult = await db.get(countQuery, ...queryParams.slice(0, -2));

        return new Response(JSON.stringify({
            vehicles,
            count: countResult.count,
            filters: {
                appliedWhere: whereClauses,
                appliedOrder: orderClause
            }
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in vehicles API:', error);
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}