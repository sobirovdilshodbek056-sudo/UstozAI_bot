const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    console.log("🔑 API Key checking...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ API Key not found in .env");
        return;
    }
    console.log("✅ API Key found (" + apiKey.length + " chars)");

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("📡 Fetching available models...");
        // Note: unfortunately the SDK might not expose listModels easily in all versions, 
        // but let's try to just run a simple generation with a few likely candidates.

        const candidates = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro',
            'gemini-1.0-pro',
            'gemini-flash'
        ];

        for (const modelName of candidates) {
            console.log(`\n🧪 Testing model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test.");
                const response = await result.response;
                console.log(`✅ SUCCESS working model: ${modelName}`);
                console.log(`Response: ${response.text()}`);
                return; // Stop at first working model
            } catch (error) {
                console.log(`❌ Failed ${modelName}: ${error.message.split('\n')[0]}`);
                if (error.message.includes('404')) {
                    console.log(`   (Model likely does not exist or not accessible)`);
                }
            }
        }

        console.log("\n❌ No working models found in candidates list.");

    } catch (error) {
        console.error("Critical error:", error);
    }
}

listModels();
