import {getMaxMinPrice} from '@/lib/db/db';

export async function GET() {
    try {
        const types = await getMaxMinPrice();
        return new Response(JSON.stringify(types), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.error('Error in vehicle price API:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch vehicle price' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}