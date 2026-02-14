import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const authHeader = req.headers.get('authorization');

    // Determine if this is a PDF upload by inspecting the FormData
    let targetUrl = `${CONFIG.N8N_URL}/education`;
    let fetchBody: BodyInit;
    const fetchHeaders: Record<string, string> = {};

    if (authHeader) {
      fetchHeaders['Authorization'] = authHeader;
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const document = formData.get("document") as File | null;
      const isPdf = document?.name?.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        // Route PDFs to the backend for server-side text extraction
        targetUrl = `${CONFIG.API_URL}/education/ingest-pdf`;
        console.log(`[Education Ingest] PDF detected ("${document?.name}"), routing to backend: ${targetUrl}`);
      } else {
        console.log(`[Education Ingest] Non-PDF content, forwarding to n8n: ${targetUrl}`);
      }

      fetchBody = formData;
      // Note: Fetch naturally sets the correct boundary when body is FormData
    } else {
      const body = await req.json();
      fetchBody = JSON.stringify(body);
      fetchHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: fetchBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Education API] Error (${response.status}):`, errorText);

      // Try to parse as JSON for structured error messages
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server responded with ${response.status}`, details: errorText };
      }

      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Education Ingest API Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
