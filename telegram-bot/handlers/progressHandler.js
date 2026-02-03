// Progress Handler - Placeholder
const { Markup } = require('telegraf');

async function showProgress(ctx, langId) {
    try {
        const message = `📊 *Progressim*\n\nStatistika tez orada qo'shiladi!`;

        const buttons = [[Markup.button.callback('← Orqaga', `lang_${langId}`)]];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Progress error:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

module.exports = {
    showProgress
};
