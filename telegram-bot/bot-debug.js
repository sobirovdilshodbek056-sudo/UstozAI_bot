// Debug version of bot.js - More detailed logging
require('dotenv').config();
const { Telegraf } = require('telegraf');
const AIHandler = require('./utils/aiHandler');

const TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!TOKEN) {
    console.error('❌ BOT_TOKEN topilmadi!');
    process.exit(1);
}

console.log('🔄 DEBUG MODE: Bot ishga tushmoqda...\n');

const bot = new Telegraf(TOKEN, {
    telegram: {
        apiRoot: 'https://api.telegram.org',
        agent: null,
        webhookReply: false
    },
    handlerTimeout: 90_000
});

let aiHandler;
try {
    aiHandler = new AIHandler(GEMINI_API_KEY);
    console.log('✅ AI handler tayyor\n');
} catch (error) {
    console.error('❌ AI handler xatosi:', error.message);
    console.log('⚠️  Bot AI siz ishga tushadi\n');
}

// Logging middleware
bot.use(async (ctx, next) => {
    console.log('\n━━━ Yangi xabar ━━━');
    console.log('Update Type:', ctx.updateType);
    console.log('User:', ctx.from?.first_name || 'Unknown');
    console.log('Message:', ctx.message?.text || 'N/A');

    const start = Date.now();
    try {
        await next();
    } catch (err) {
        console.error('❌ Middleware xatosi:', err);
        throw err;
    }
    const ms = Date.now() - start;
    console.log(`Bajarildi: ${ms}ms`);
    console.log('━━━━━━━━━━━━━━━━━\n');
});

// Start command
bot.command('start', async (ctx) => {
    console.log('📍 /start buyrug\'i');
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
        console.log('✅ /start javobi yuborildi');
    } catch (error) {
        console.error('❌ /start xatosi:', error);
        await ctx.reply('❌ Xatolik yuz berdi. /start ni qayta bosing.');
    }
});

// Text message handler
bot.on('text', async (ctx) => {
    try {
        const userMessage = ctx.message.text;

        if (userMessage.startsWith('/')) {
            console.log('⏭️ Buyruq, o\'tkazib yuborildi');
            return;
        }

        console.log(`📝 Savol qabul qilindi: "${userMessage}"`);

        if (!aiHandler) {
            console.log('⚠️ AI handler mavjud emas');
            await ctx.reply(
                '⚠️ AI xizmati hozirda mavjud emas.\n\n' +
                'Admin GEMINI_API_KEY ni .env fayliga qo\'shishi kerak.'
            );
            return;
        }

        console.log('⏳ Typing action yuborilmoqda...');
        await ctx.sendChatAction('typing');

        console.log('🤖 AI ga so\'rov yuborilmoqda...');
        const aiResponse = await aiHandler.getResponse(userMessage);
        console.log('✅ AI dan javob olindi:', aiResponse.substring(0, 50) + '...');

        // Check message length
        const MAX_MESSAGE_LENGTH = 4000;
        console.log(`📏 Javob uzunligi: ${aiResponse.length} belgi`);

        if (aiResponse.length > MAX_MESSAGE_LENGTH) {
            console.log('📦 Xabar uzun, bo\'lib yuboriladi');
            const parts = [];
            for (let i = 0; i < aiResponse.length; i += MAX_MESSAGE_LENGTH) {
                parts.push(aiResponse.substring(i, i + MAX_MESSAGE_LENGTH));
            }

            console.log(`📤 ${parts.length} ta qismda yuboriladi`);
            for (let i = 0; i < parts.length; i++) {
                console.log(`  Qism ${i + 1}/${parts.length} yuborilmoqda...`);
                await ctx.reply(parts[i]);
                if (i < parts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        } else {
            console.log('📤 Javob yuborilmoqda...');
            await ctx.reply(aiResponse);
        }

        console.log('✅ Javob muvaffaqiyatli yuborildi');

    } catch (error) {
        console.error('\n❌❌❌ TEXT HANDLER XATOSI ❌❌❌');
        console.error('Xato turi:', error.name);
        console.error('Xato xabari:', error.message);
        console.error('Stack trace:');
        console.error(error.stack);
        console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n');

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
    console.error('\n❌❌❌ BOT CATCH XATOSI ❌❌❌');
    console.error('Xato:', err);
    console.error('Context:', ctx.update);
    console.error('❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n');

    try {
        ctx.reply('❌ Xatolik yuz berdi. Iltimos /start ni bosing.');
    } catch (e) {
        console.error('Reply xatosi:', e.message);
    }
});

// Launch bot
console.log('🚀 Bot ishga tushirilmoqda...\n');
bot.telegram.deleteWebhook()
    .then(() => {
        console.log('✅ Webhook o\'chirildi');
        return bot.launch();
    })
    .then(() => {
        console.log('\n' + '═'.repeat(50));
        console.log('✅✅✅ BOT ISHGA TUSHDI! ✅✅✅');
        console.log('📱 Telegramda /start ni bosing');
        console.log('🤖 Bot: @UstozAI_7bot');
        console.log('═'.repeat(50) + '\n');
    })
    .catch((err) => {
        console.error('\n❌ BOT ISHGA TUSHMADI:');
        console.error('Xato:', err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    });

// Graceful stop
process.once('SIGINT', () => {
    console.log('\n🛑 Bot to\'xtatilmoqda...');
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    console.log('\n🛑 Bot to\'xtatilmoqda...');
    bot.stop('SIGTERM');
});

module.exports = bot;
