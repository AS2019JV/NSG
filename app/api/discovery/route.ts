import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        // Log for development/debugging
        console.log("Discovery Lead Captured:", data);

        // Here we would typically send to n8n or CRM
        // const webhookUrl = process.env.N8N_WEBHOOK_URL;
        // if (webhookUrl) {
        //     await fetch(webhookUrl, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             source: "ai_discovery_studio",
        //             ...data,
        //             timestamp: new Date().toISOString()
        //         })
        //     });
        // }

        return NextResponse.json({ 
            success: true, 
            message: "Lead processed correctly",
            received: data 
        });

    } catch (error) {
        console.error("Discovery API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
