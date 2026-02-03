const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function diagnose() {
    console.log("🔍 Diagnosing API Key...");
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("  - Key pattern:", apiKey ? "Valid format (AIza...)" : "Missing");

    // Try to use the API
    const genAI = new GoogleGenerativeAI(apiKey);

    // Using a model that definitely exists
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        console.log("📡 Attempting simple generation...");
        const result = await model.generateContent("Test");
        console.log("✅ SUCCESS! API is working.");
    } catch (error) {
        console.log("❌ FAILED!");
        console.log("  - Error Message:", error.message);
        console.log("  - Status:", error.status);
        console.log("  - StatusText:", error.statusText);

        if (error.message.includes("404") || error.message.includes("NOT_FOUND")) {
            console.log("\n⚠️  DIAGNOSIS: API NOT ENABLED");
            console.log("The '404 Not Found' error on a valid model means the API is not enabled in your Google Cloud Project.");
        }
    }
}

diagnose();
