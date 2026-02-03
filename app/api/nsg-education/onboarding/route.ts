import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId, step } = body;

    // Connect to n8n webhook
    const BASE_URL = CONFIG.N8N_URL;
    const WEBHOOK_URL = `${BASE_URL}/nsg-strategy-onboarding`;

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId, step })
    });

    if (!response.ok) {
        throw new Error(`N8N responded with ${response.status}`);
    }

    let n8nData = await response.json();

    // Normalization
    if (Array.isArray(n8nData) && n8nData.length > 0) n8nData = n8nData[0];
    if (n8nData && typeof n8nData === 'object' && n8nData.json) n8nData = n8nData.json;

    return NextResponse.json({
        success: true,
        data: n8nData
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
