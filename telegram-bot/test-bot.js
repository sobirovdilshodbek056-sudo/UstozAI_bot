// Test Bot - Oddiy versiya
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN || '8449334072:AAFHy3rMweD-NM9JkxnDeKMn8kKhYzZgdmg');

// Simple session
bot.use((ctx, next) => {
    ctx.session = ctx.session || {};
    return next();
});

// Start command
bot.command('start', async (ctx) => {
    try {
        const firstName = ctx.from.first_name || 'Do\'st';

        const message = `🎓 *Assalomu alaykum, ${firstName}!*\n\nMen *UstozAI* - sizning sun'iy intellekt o'qituvchingizman!\n\n✨ *Men nima qila olaman:*\n• 💡 Savollaringizga javob beraman\n• 📝 Test tuzaman\n• 🌍 Til o'rgataman\n\n👇 Pastdan tanlov qiling:`;

        const keyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback('🤖 AI bilan suhbat', 'chat'),
                Markup.button.callback('📝 Testlar', 'tests')
            ],
            [
                Markup.button.callback('🌍 Til o\'rganish', 'languages'),
                Markup.button.callback('❓ Yordam', 'help')
            ]
        ]);

        await ctx.reply(message, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    } catch (error) {
        console.error('Start error:', error);
        await ctx.reply('❌ Xatolik yuz berdi. Qaytadan /start ni bosing.');
    }
});

// Help command
bot.command('help', async (ctx) => {
    await ctx.reply('📚 *Yordam*\n\n/start - Botni boshlash\n/help - Yordam\n\nQo\'shimcha savollar bo\'lsa yozing!', {
        parse_mode: 'Markdown'
    });
});

// Callback handlers
bot.action('chat', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('🤖 *AI Chat*\n\nSavolingizni yozing, men javob beraman!', { parse_mode: 'Markdown' });
});

bot.action('tests', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('📝 *Testlar*\n\nTestlar tez orada qo\'shiladi!', { parse_mode: 'Markdown' });
});

bot.action('languages', async (ctx) => {
    await ctx.answerCbQuery();
    const message = `🌍 *Til tanlang*\n\nQaysi tilni o'rganmoqchisiz?`;

    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback('🇺🇸 English', 'lang_en'),
            Markup.button.callback('🇩🇪 Deutsch', 'lang_de')
        ],
        [
            Markup.button.callback('🇰🇷 한국어', 'lang_ko'),
            Markup.button.callback('🇯🇵 日本語', 'lang_ja')
        ],
        [Markup.button.callback('← Orqaga', 'back_main')]
    ]);

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...keyboard
    });
});

bot.action('help', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('📚 *Yordam*\n\nBuyruqlar:\n/start - Boshlash\n/help - Yordam', { parse_mode: 'Markdown' });
});

bot.action('back_main', async (ctx) => {
    await ctx.answerCbQuery();
    await bot.telegram.sendMessage(ctx.from.id, '🏠 Bosh menyu', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🤖 AI Chat', callback_data: 'chat' },
                    { text: '📝 Testlar', callback_data: 'tests' }
                ],
                [
                    { text: '🌍 Til o\'rganish', callback_data: 'languages' },
                    { text: '❓ Yordam', callback_data: 'help' }
                ]
            ]
        }
    });
});

// Language actions
const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    ko: { name: '한국어', flag: '🇰🇷' },
    ja: { name: '日本語', flag: '🇯🇵' }
};

Object.keys(languages).forEach(langId => {
    bot.action(`lang_${langId}`, async (ctx) => {
        await ctx.answerCbQuery();
        const lang = languages[langId];

        const message = `${lang.flag} *${lang.name}*\n\nNima qilmoqchisiz?`;
        const keyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback('📚 Lug\'at', `dict_${langId}`),
                Markup.button.callback('✍️ Mashq', `practice_${langId}`)
            ],
            [Markup.button.callback('← Tillar', 'languages')]
        ]);

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    });

    bot.action(`dict_${langId}`, async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply(`📚 *Lug'at*\n\nSo'z kiriting yoki /help yozing.`, { parse_mode: 'Markdown' });
    });

    bot.action(`practice_${langId}`, async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply(`✍️ *Mashq*\n\nMashqlar tez orada!`, { parse_mode: 'Markdown' });
    });
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('❌ Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
});

// Launch
bot.launch()
    .then(() => {
        console.log('✅ UstozAI Bot ishga tushdi!');
        console.log('📱 Bot tayyor: @UstozAI_7bot');
        console.log('🌐 Bot username:', bot.botInfo.username);
    })
    .catch((err) => {
        console.error('❌ Botni ishga tushirishda xatolik:', err);
        process.exit(1);
    });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
