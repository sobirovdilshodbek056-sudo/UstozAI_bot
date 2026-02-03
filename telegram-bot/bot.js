// UstozAI Telegram Bot - AI Q&A Version
require('dotenv').config();
const { Telegraf } = require('telegraf');
const AIHandler = require('./utils/aiHandler');

// Configuration
const TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!TOKEN) {
    console.error('❌ BOT_TOKEN topilmadi!');
    process.exit(1);
}

console.log('🔄 Bot ishga tushmoqda...');

// Initialize bot with improved configuration
const bot = new Telegraf(TOKEN, {
    telegram: {
        apiRoot: 'https://api.telegram.org',
        agent: null,
        webhookReply: false
    },
    handlerTimeout: 90_000
});

// Initialize AI Handler
let aiHandler;
try {
    aiHandler = new AIHandler(GEMINI_API_KEY);
    console.log('✅ AI handler tayyor');
} catch (error) {
    console.error(error.message);
    console.log('⚠️  Bot AI siz ishga tushadi');
}

// Logging middleware
bot.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${ctx.updateType} - ${ms}ms`);
});

// Start command
bot.command('start', async (ctx) => {
    try {
        const firstName = ctx.from.first_name || 'Do\'st';

        const welcomeMessage =
            `🎓 *Assalomu alaykum, ${firstName}!*\n\n` +
            `Men *UstozAI* - sizning sun'iy intellekt o'qituvchingizman!\n\n` +
            `✨ *Men nima qila olaman:*\n` +
            `• 💡 Har qanday savolga javob beraman\n` +
            `• 🧮 Matematika masalalarini yechaman\n` +
            `• 📚 Darslik mavzularini tushuntiraman\n` +
            `• 🌍 Turli fanlar bo'yicha yordam beraman\n\n` +
            `🇺🇿 To'liq o'zbek tilida!\n\n` +
            `💬 Shunchaki savolingizni yozing va men javob beraman!`;

        await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Start error:', error);
        await ctx.reply('❌ Xatolik yuz berdi. /start ni qayta bosing.');
    }
});

// Help command
bot.command('help', async (ctx) => {
    try {
        const helpMessage =
            `📚 *UstozAI Yordami*\n\n` +
            `*Buyruqlar:*\n` +
            `/start - Botni boshlash\n` +
            `/help - Yordam ma'lumotlari\n\n` +
            `*Qanday foydalanish:*\n` +
            `Shunchaki menga savol yozing va men javob beraman!\n\n` +
            `*Misol savollar:*\n` +
            `• "O'zbekiston poytaxti qayer?"\n` +
            `• "2+2 nechiga teng?"\n` +
            `• "Fotosintez nima?"\n` +
            `• "Ingliz tilida salom qanday aytiladi?"\n\n` +
            `Har qanday savol bering! 😊`;

        await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Help error:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
});

// Text message handler - AI responses
bot.on('text', async (ctx) => {
    try {
        const userMessage = ctx.message.text;

        // Skip commands
        if (userMessage.startsWith('/')) {
            return;
        }

        console.log(`📝 Savol: ${userMessage}`);

        // Check if AI is available
        if (!aiHandler) {
            await ctx.reply(
                '⚠️ AI xizmati hozirda mavjud emas.\n\n' +
                'Admin GEMINI_API_KEY ni .env fayliga qo\'shishi kerak.'
            );
            return;
        }

        // Send typing action
        await ctx.sendChatAction('typing');

        // Get AI response
        const aiResponse = await aiHandler.getResponse(userMessage);

        // Telegram message limit is 4096 characters
        const MAX_MESSAGE_LENGTH = 4000; // Leave some buffer

        if (aiResponse.length > MAX_MESSAGE_LENGTH) {
            // Split into multiple messages
            const parts = [];
            for (let i = 0; i < aiResponse.length; i += MAX_MESSAGE_LENGTH) {
                parts.push(aiResponse.substring(i, i + MAX_MESSAGE_LENGTH));
            }

            for (const part of parts) {
                await ctx.reply(part);
                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between messages
            }
        } else {
            // Send response
            await ctx.reply(aiResponse);
        }

        console.log('✅ Javob yuborildi');

    } catch (error) {
        console.error('❌ Text handler error:');
        console.error('  - Xato xabari:', error.message);
        console.error('  - Xato turi:', error.name);
        console.error('  - Stack:', error.stack);

        try {
            await ctx.reply(
                '❌ Kechirasiz, javob tayyorlashda xatolik yuz berdi.\n' +
                'Iltimos, qayta urinib ko\'ring.'
            );
        } catch (replyError) {
            console.error('❌ Javob yuborishda ham xatolik:', replyError.message);
        }
    }
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('❌ Xatolik yuz berdi. Iltimos /start ni bosing.').catch(() => { });
});

// Launch bot
bot.telegram.deleteWebhook()
    .then(() => {
        console.log('✅ Webhook o\'chirildi');
        return bot.launch();
    })
    .then(() => {
        console.log('');
        console.log('✅✅✅ BOT ISHGA TUSHDI! ✅✅✅');
        console.log('📱 Telegramda /start ni bosing');
        console.log('🤖 Bot: @UstozAI_7bot');
        console.log('');
    })
    .catch((err) => {
        console.error('❌ XATOLIK:', err.message);
        console.error('To\'liq xato:', err);
        process.exit(1);
    });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Keep-alive server for Render
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('UstozAI Bot is alive!');
}).listen(PORT, () => {
    console.log(`🌍 Server is running on port ${PORT}`);
});

module.exports = bot;

