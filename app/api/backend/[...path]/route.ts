import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';

// ============================================
// Backend Proxy API Route
// ============================================
// This route acts as a secure proxy between the client and the backend
// It forwards all requests to the actual backend API while keeping
// the backend URL hidden from the client bundle

type RouteContext = {
    params: Promise<{ path: string[] }>;
};

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    const params = await context.params;
    return forwardRequest(request, params.path, 'GET');
}

export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    const params = await context.params;
    return forwardRequest(request, params.path, 'POST');
}

export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    const params = await context.params;
    return forwardRequest(request, params.path, 'PUT');
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    const params = await context.params;
    return forwardRequest(request, params.path, 'PATCH');
}

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    const params = await context.params;
    return forwardRequest(request, params.path, 'DELETE');
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

// ============================================
// Helper Function to Forward Requests
// ============================================
async function forwardRequest(
    request: NextRequest,
    pathSegments: string[],
    method: string
) {
    try {
        // Construct the backend URL
        const path = pathSegments.join('/');

        // DEBUG: Health check for the proxy
        if (path === 'debug/ping') {
            return NextResponse.json({
                status: 'Proxy is alive',
                config: {
                    API_URL: CONFIG.API_URL,
                    APP_ENV: CONFIG.APP_ENV,
                    isProduction: CONFIG.isProduction
                },
                request: {
                    method,
                    path,
                    url: request.url
                }
            });
        }

        const backendUrl = CONFIG.API_URL;
        const fullUrl = `${backendUrl}/${path}${request.nextUrl.search}`;

        if (process.env.NODE_ENV === 'development' || process.env.APP_ENV === 'production') {
            console.log(`[Backend Proxy] ${method} ${request.nextUrl.pathname} -> ${fullUrl}`);
        }

        // Forward headers (especially Authorization)
        const headers: HeadersInit = {};
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }
        headers['Content-Type'] = request.headers.get('content-type') || 'application/json';

        // Prepare request options
        const options: RequestInit = {
            method,
            headers,
        };

        // Add body for POST, PUT, PATCH requests
        if (method !== 'GET' && method !== 'DELETE') {
            try {
                const body = await request.text();
                if (body) {
                    options.body = body;
                }
            } catch (error) {
                console.error('[Backend Proxy] Error reading request body:', error);
            }
        }

        // Forward the request to the backend
        const response = await fetch(fullUrl, options);
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Backend Proxy] Response from ${fullUrl}: ${response.status}`);
        }

        // Get response data
        const contentType = response.headers.get('content-type');
        let data: any;
        
        if (contentType?.includes('application/json')) {
            try {
                data = await response.json();
                if (process.env.NODE_ENV === 'development' && response.status >= 400) {
                    console.error(`[Backend Proxy] Error data:`, data);
                }
            } catch (pErr) {
                console.error('[Backend Proxy] Error parsing JSON:', pErr);
                data = { message: 'Error parsing response from backend' };
            }
        } else {
            const text = await response.text();
            data = { message: text || `Backend returned status ${response.status}` };
        }

        // Ensure data is an object and has a message if it's an error status
        if (typeof data !== 'object' || data === null) {
            data = { message: String(data) };
        }

        // If it's an error status but no message is present, add a generic one
        if (response.status >= 400 && !data.message && !data.error) {
            data.message = `Backend request failed with status ${response.status}`;
        }

        // Return the response with the same status code
        const nextResponse = NextResponse.json(data, { status: response.status });
        
        // Add CORS headers to the response
        nextResponse.headers.set('Access-Control-Allow-Origin', '*');
        nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return nextResponse;
        
    } catch (error) {
        console.error('[Backend Proxy] Error forwarding request:', error);
        return NextResponse.json(
            { 
                error: 'Internal proxy error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { 
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }
}
