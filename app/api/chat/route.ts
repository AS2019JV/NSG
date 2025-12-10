import { NextResponse } from 'next/server';

/**
 * Unified N8N Proxy Configuration
 * Centralizes connection logic for both Chat and Document services.
 */
const BASE_URL = 'https://personal-n8n.suwsiw.easypanel.host';

// Helper to construct URLs
const getN8NUrl = (path: string, isTest: boolean) => 
    `${BASE_URL}/${isTest ? 'webhook-test' : 'webhook'}/${path}`;

export async function POST(req: Request) {
  try {
    // 1. Determine Request Type & Target Path
    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    
    // Logic: Files -> nsg-documents, everything else -> nsg-chat
    const endpointPath = isMultipart ? 'nsg-documents' : 'nsg-chat';
    
    // 2. Prepare Fetch Options
    const fetchOptions: RequestInit = { method: 'POST' };
    
    if (isMultipart) {
        // FormData: Boundary is automatically set by fetch
        fetchOptions.body = await req.formData();
    } else {
        // JSON: Manual content-type
        fetchOptions.body = JSON.stringify(await req.json());
        fetchOptions.headers = { 'Content-Type': 'application/json' };
    }

    // 3. Execution with Fallback Strategy
    // Strategy: Try Production Webhook first. If 404 (Inactive), try Test Webhook.
    
    const prodUrl = getN8NUrl(endpointPath, false);
    console.log(`[Proxy] POST ${prodUrl} (${isMultipart ? 'Multipart' : 'JSON'})`);

    let response = await fetch(prodUrl, fetchOptions);

    if (response.status === 404) {
        const testUrl = getN8NUrl(endpointPath, true);
        console.warn(`[Proxy] Production 404. Retrying with Test Webhook: ${testUrl}`);
        
        // Clone options body if necessary (FormData is reusable in standard fetch, but good practice to be aware)
        // In this context, re-using fetchOptions is safe.
        response = await fetch(testUrl, fetchOptions);
    }

    // 4. Handle Final Response
    if (!response.ok) {
        console.error(`[Proxy] N8N Error: ${response.status}`);
        const text = await response.text();
        
        return NextResponse.json({ 
            error: "N8N Workflow Error",
            status: response.status,
            details: text || "Check N8N execution logs."
        }, { status: 502 });
    }

    // Return Data (Try JSON, fall back to text)
    const responseText = await response.text();
    try {
        return NextResponse.json(JSON.parse(responseText));
    } catch {
        return NextResponse.json({ message: responseText });
    }

  } catch (error: any) {
    console.error('[Proxy] Server Error:', error);
    return NextResponse.json(
        { error: error.message || "Internal Server Error" }, 
        { status: 500 }
    );
  }
}
