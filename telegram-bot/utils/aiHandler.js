const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIHandler {
    constructor(apiKey) {
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('❌ GEMINI_API_KEY topilmadi! .env fayliga API key qo\'shing.');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            }
        });

        this.systemPrompt = `Siz UstozAI - o'zbek tilida yordam beruvchi sun'iy intellekt o'qituvchisiz.

QOIDALAR:
- Har doim o'zbek tilida javob bering
- Qisqa va aniq javoblar bering
- Murakkab mavzularni oddiy tilda tushuntiring
- Matematika, fan, til va boshqa fanlar bo'yicha yordam bering
- Do'stona va sabr-toqatli bo'ling
- Agar javob bilmasangiz, halol bo'ling

Talaba: `;
    }

    async getResponse(userMessage) {
        try {
            console.log('🤖 AI javob tayyorlanmoqda...');

            const prompt = this.systemPrompt + userMessage;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('✅ AI javob tayyor');
            return text;

        } catch (error) {
            console.error('❌ AI xatosi:');
            console.error('  - Xato xabari:', error.message);
            console.error('  - Xato turi:', error.name);

            // Check specific error types
            if (error.message.includes('API key') || error.message.includes('API_KEY')) {
                console.error('  - Sabab: API key muammosi');
                return '❌ API key xatosi. Iltimos, admin bilan bog\'laning.';
            }

            if (error.message.includes('quota') || error.message.includes('QUOTA')) {
                console.error('  - Sabab: API limit tugadi');
                return '❌ API limit tugadi. Iltimos, keyinroq urinib ko\'ring.';
            }

            if (error.message.includes('blocked') || error.message.includes('SAFETY')) {
                console.error('  - Sabab: Content safety filter');
                return '❌ Kechirasiz, bu so\'rov ruxsat etilmagan. Iltimos, boshqa savol bering.';
            }

            if (error.message.includes('404') || error.message.includes('NOT_FOUND')) {
                console.error('  - Sabab: Model topilmadi yoki API yoqilmagan');
                return '❌ Google API xatosi (404). Iltimos, Google AI Studio da "Generative Language API" yoqilganligini tekshiring.';
            }

            console.error('  - To\'liq xato:', error);
            return '❌ Kechirasiz, javob tayyorlashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
        }
    }
}

module.exports = AIHandler;
