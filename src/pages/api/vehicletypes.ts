import { getVehicleTypes } from '@/lib/db/db';
export const config = { runtime: 'edge' };


export async function GET() {
    try {
        const types = await getVehicleTypes();
        return new Response(JSON.stringify(types), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.error('Error in vehicle types API:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch vehicle types' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}