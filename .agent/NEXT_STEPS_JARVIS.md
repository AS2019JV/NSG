# Next Steps: Jarvis System Orchestration with n8n

## Overview
This document outlines the architecture and implementation steps to fully activate the "Jarvis" voice assistant within NSG Clarity, using n8n as the backend orchestrator.

## 1. Architecture Flow
The system follows a standard **Voice-to-Action** pipeline:

1.  **Frontend (NSG Clarity)**:
    *   Captures User Audio (via Microphone API).
    *   Sends Audio Blob to Next.js API Route.
    *   Displays "Listening" / "Processing" states (visualized by the Neon Border effect).

2.  **Backend Proxy (Next.js API)**:
    *   Endpoint: `/api/jarvis/message`
    *   Forwards the audio payload to the n8n Webhook.
    *   Handles authentication to ensure only authorized users access the agent.

3.  **Orchestrator (n8n Workflow)**:
    *   **Webhook Node (POST)**: Receives audio file.
    *   **Whisper Node (OpenAI)**: Transcribes Audio to Text.
    *   **LLM Agent Node (OpenAI GPT-4o)**:
        *   *System Prompt*: "You are JARVIS, a highly advanced AI assistant for NSG Clarity. You speak concisely, professionally, and with a tone of sophisticated intelligence (Iron Man style). Current context: [User Screen/Data]."
        *   *Tools*: Access to Calendar, Email, Context Engine.
    *   **Text-to-Speech Node (ElevenLabs)**: Generates audio response (Voice: "Fin" or "George" for British/Jarvis tone).
    *   **Response Node**: Returns JSON `{ text: "...", audio_base64: "...", emotion: "neutral" }`.

4.  **Frontend (Response)**:
    *   Plays returned Audio.
    *   Displays Text Typewriter effect.
    *   Resets to "Idle" state.

## 2. n8n Workflow Implementation Steps

### Step A: Setup Webhook
1.  Create a new n8n workflow.
2.  Add a **Webhook** node.
    *   Method: `POST`
    *   Path: `jarvis-entry`
    *   Authentication: Header Auth (match with your App's secret).

### Step B: Transcription & Intelligence
1.  Add **OpenAI** node (Operation: *Audio Transcription*).
    *   Input: Binary Data (from Webhook).
2.  Add **OpenAI** node (Operation: *Chat*).
    *   Connect to Transcription output.
    *   Define System Prompt: "You are Jarvis. Respond efficiently."

### Step C: Voice Generation
1.  Add **ElevenLabs** node.
    *   Operation: *Text to Speech*.
    *   Voice ID: Choose a calm, deep male voice.
    *   Model: `eleven_turbo_v2` (for low latency).

### Step D: Return Response
1.  Add **Code** node to format the JSON response.
2.  Add **Respond to Webhook** node.
    *   Respond With: JSON.
    *   Body: Output of the Code node.

## 3. Frontend Integration Required
To move from the current "Mock" UI to the real system:
1.  Implement `useAudioRecorder` hook in `JarvisAssistant.tsx`.
2.  Create `/app/api/jarvis/route.ts` to forward requests to n8n.
3.  Update `JarvisAssistant.tsx` to play the returned audio blob.

## 4. UI/UX Refinements
-   **Latency Hiding**: While n8n processes (3-5s), play a subtle "Thinking" sound effect and pulsate the purple border.
-   **Streaming**: For faster responses, consider streaming the text first while audio generates.

## 5. Security
-   Ensure the n8n webhook is protected by a secret token.
-   Do not expose the n8n URL directly to the client; always proxy through Next.js.
