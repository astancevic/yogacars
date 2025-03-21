import { getModels } from '@/lib/db/db';
export const config = { runtime: 'edge' };

// Use memory cache to store results
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
type CacheItem = {
    data: any;
    timestamp: number;
};

const modelsCache = new Map<string, CacheItem>();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const manufacturerId = url.searchParams.get('manufacturerId');
        const type = url.searchParams.get('type');

        // Create a cache key based on query parameters
        const cacheKey = `models-${manufacturerId || 'all'}-${type || 'all'}`;

        // Check if we have a valid cached response
        const cachedItem = modelsCache.get(cacheKey);
        const now = Date.now();

        if (cachedItem && now - cachedItem.timestamp < CACHE_TTL) {
            // Return cached data if it's still valid
            return new Response(JSON.stringify(cachedItem.data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=300' // 5 minutes browser caching
                },
            });
        }

        // Convert manufacturerId to a number if provided
        const manufacturerIdNum = manufacturerId ? parseInt(manufacturerId, 10) : null;

        // Fetch vehicle models with optional filters
        const models = await getModels(manufacturerIdNum, type);

        // Cache the results
        modelsCache.set(cacheKey, {
            data: models,
            timestamp: now
        });

        return new Response(JSON.stringify(models), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=300' // 5 minutes browser caching
            },
        });
    } catch (error) {
        console.error('Error in vehicle models API:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch vehicle models' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}