const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const fs = require('fs');

async function findModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest',
        'gemini-1.0-pro',
        'gemini-pro',
        'gemini-flash'
    ];

    let working = null;

    console.log("Starting model check...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            await response.text();
            console.log("SUCCESS ✅");
            working = modelName;
            break;
        } catch (error) {
            console.log(`FAILED ❌ (${error.message.split('\n')[0]})`);
        }
    }

    if (working) {
        fs.writeFileSync('working_model.txt', working); // Save result to file
        console.log(`\nFOUND WORKING MODEL: ${working}`);
    } else {
        fs.writeFileSync('working_model.txt', 'NONE');
        console.log("\nNO WORKING MODELS FOUND.");
    }
}

findModel();
