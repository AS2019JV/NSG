const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const content = fs.readFileSync(envPath, 'utf8');

const lines = content.split('\n');
const newLines = lines.map(line => {
    if (line.includes('=') && !line.startsWith('#')) {
        const parts = line.split('=');
        const key = parts[0];
        const value = parts.slice(1).join('=').trim();
        return `${key}=${value}`;
    }
    return line;
});

fs.writeFileSync(envPath, newLines.join('\n'));
console.log('Successfully trimmed .env values');
