const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const model = 'gemini-1.5-flash';
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const data = JSON.stringify({
    contents: [{
        parts: [{ text: "Hello" }]
    }]
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Testing raw API call to ${model}...`);

const req = https.request(url, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:');
        console.log(body);
    });
});

req.on('error', (error) => {
    console.error('Request Error:', error);
});

req.write(data);
req.end();
