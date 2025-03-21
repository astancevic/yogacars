import { getPopularMakes } from '@/lib/db/db';

export const config = { runtime: 'edge' };


export async function GET() {
    try {
        // Fetch vehicle makes, optionally filtering by type
        const makes = await getPopularMakes();

        // Process makes to ensure proper structure before sending
        const processedMakes = makes.map(make => ({
            id: make.id,
            name: make.name,
            models: make.models.map(model => ({
                id: model.id,
                name: model.name,
                vehicles: model.vehicles.map(vehicle => {
                    // Ensure vehicle is an object, not a string
                    if (typeof vehicle === 'string') {
                        try {
                            return JSON.parse(vehicle);
                        } catch (e) {
                            console.error("Error parsing vehicle in API route:", e);
                            return null;
                        }
                    }
                    return vehicle;
                }).filter(Boolean)
            }))
        }));

        return new Response(JSON.stringify(processedMakes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in vehicle popular makes API:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch vehicle popular makes' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}