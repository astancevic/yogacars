import { getMakes } from '@/lib/db/db';
export const config = { runtime: 'edge' };

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type');

        // Fetch vehicle makes, optionally filtering by type
        const makes = await getMakes(type);

        return new Response(JSON.stringify(makes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in vehicle makes API:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch vehicle makes' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
