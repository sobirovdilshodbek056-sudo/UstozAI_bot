// Start Handler - Welcome message and main menu

const { Markup } = require('telegraf');

async function startHandler(ctx) {
    const firstName = ctx.from.first_name || 'Do\'st';

    const welcomeMessage =
        `🎓 *Assalomu alaykum, ${firstName}!*\n\n` +
        `Men *UstozAI* - sizning sun'iy intellekt o'qituvchingizman!\n\n` +
        `✨ *Men nima qila olaman:*\n` +
        `• 💡 Savollaringizga javob beraman\n` +
        `• 🧮 Misollar yechib beraman\n` +
        `• 📝 Test tuzaman va tekshiraman\n` +
        `• 🎯 Xatolaringizni ko'rsataman\n` +
        `• 📊 Progressingizni kuzataman\n\n` +
        `🇺🇿 To'liq o'zbek tilida!\n\n` +
        `👇 Pastdan tanlov qiling yoki shunchaki savol bering!`;

    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback('🤖 AI bilan suhbat', 'chat_start'),
            Markup.button.callback('📝 Testlar', 'test_list')
        ],
        [
            Markup.button.callback('🌍 Til o\'rganish', 'languages'),
            Markup.button.callback('📊 Natijalarim', 'show_results')
        ],
        [
            Markup.button.callback('⭐ Obuna', 'subscription_info'),
            Markup.button.callback('❓ Yordam', 'show_help')
        ],
        [
            Markup.button.url('🌐 Web Platforma', 'https://ustozai.uz')
        ]
    ]);

    try {
        if (ctx.callbackQuery) {
            await ctx.editMessageText(welcomeMessage, {
                parse_mode: 'Markdown',
                ...keyboard
            });
        } else {
            await ctx.replyWithPhoto(
                { url: 'https://via.placeholder.com/800x400/9333ea/ffffff?text=UstozAI' },
                {
                    caption: welcomeMessage,
                    parse_mode: 'Markdown',
                    ...keyboard
                }
            );
        }
    } catch (error) {
        await ctx.reply(welcomeMessage, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    }
}

module.exports = startHandler;
