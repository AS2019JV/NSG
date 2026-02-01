import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl = (process.env.N8N_WEBHOOK || "").trim();
    
    if (!webhookUrl || webhookUrl === "") {
      return NextResponse.json(
        { error: 'N8N_WEBHOOK environment variable is not defined or empty' },
        { status: 500 }
      );
    }

    // Forward the request to N8N
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // 5. Smart Parsing (Normalization)
    let data;
    try {
      data = await response.json();
      
      // Handle n8n array [ { ... } ]
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }
      
      // Handle n8n 'json' key nesting
      if (data && typeof data === 'object' && data.json) {
        data = data.json;
      }
    } catch {
      data = await response.text();
      try { data = JSON.parse(data as string); } catch { /* ignore */ }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `N8N responded with ${response.status}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
