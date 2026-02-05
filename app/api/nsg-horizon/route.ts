import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';


/**
 * Proxy for NSG Horizon Webhook
 * Path: /api/nsg-horizon
 */
const BASE_URL = CONFIG.N8N_URL;

export async function POST(req: Request) {
  try {
    if (!BASE_URL) {
      return NextResponse.json({ error: "Server Configuration Error: Missing Webhook URL" }, { status: 500 });
    }

    const body = await req.json();
    // We expect { userId: string } in body, but pass whatever comes to n8n
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };

    // Use BASE_URL directly
    const targetUrl = `${BASE_URL}/nsg-horizon`;
    console.log(`[N8N Horizon] Forwarding to: ${targetUrl}`);

    const response = await fetch(targetUrl, fetchOptions);

    if (!response.ok) {
      const text = await response.text();
      console.warn(`[N8N Horizon] received ${response.status} from ${targetUrl}:`, text.substring(0, 100));
      return NextResponse.json({
        error: "N8N Workflow Error",
        status: response.status,
        details: text,
        targetUrl: targetUrl
      }, { status: response.status });
    }

    let data = await response.json();
    
    // Normalization: Handle n8n containers
    if (Array.isArray(data) && data.length > 0) data = data[0];
    if (data && typeof data === 'object' && data.json) data = data.json;

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
