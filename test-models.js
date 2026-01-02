const https = require('https');
const fs = require('fs');
const path = require('path');

function getEnvValue(key) {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(new RegExp(`^${key}=(.*)`));
            if (match) return match[1].trim();
        }
    }
    return null;
}

const apiKey = getEnvValue('NEXT_PUBLIC_GEMINI_API_KEY');

if (!apiKey) {
    console.error("No API Key found in .env");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log("Error or no models found:", json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.log("Raw Response:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
