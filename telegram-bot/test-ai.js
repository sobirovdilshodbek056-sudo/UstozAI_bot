// Test AI Handler
require('dotenv').config();
const AIHandler = require('./utils/aiHandler');

async function testAI() {
    console.log('🔍 AI handler test qilinmoqda...\n');

    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        console.log('API Key mavjud:', GEMINI_API_KEY ? 'Ha ✅' : 'Yo\'q ❌');
        console.log('API Key uzunligi:', GEMINI_API_KEY?.length || 0);
        console.log('');

        const aiHandler = new AIHandler(GEMINI_API_KEY);
        console.log('✅ AI Handler yaratildi');
        console.log('  - Model:', aiHandler.model.model);
        console.log('\n');

        console.log('📤 Test savol yuborilmoqda...');
        const response = await aiHandler.getResponse('Salom! 2+2 nechiga teng?');

        console.log('\n📥 Javob olindi:');
        console.log('─'.repeat(50));
        console.log(response);
        console.log('─'.repeat(50));
        console.log('\n✅ TEST MUVAFFAQIYATLI!');

    } catch (error) {
        console.error('\n❌ XATOLIK:');
        console.error('Xato xabari:', error.message);
        console.error('Xato turi:', error.name);
        console.error('');
        console.error('To\'liq xato:', error);
    }
}

testAI();
