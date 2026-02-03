// Grammar Handler - Placeholder
const { Markup } = require('telegraf');

async function showGrammarLessons(ctx, langId) {
    try {
        const message = `📖 *Grammatika Darslari*\n\nGrammatika tez orada qo'shiladi!`;

        const buttons = [[Markup.button.callback('← Orqaga', `lang_${langId}`)]];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Grammar error:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

module.exports = {
    showGrammarLessons
};
