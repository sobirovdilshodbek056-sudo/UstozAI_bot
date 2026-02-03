// Chat Handler - AI conversation

const { Markup } = require('telegraf');
const aiService = require('../utils/aiService');
const database = require('../utils/database');

async function startChat(ctx) {
    const message =
        `🤖 *AI Chat Rejimi*\n\n` +
        `Menga istalgan savol bering:\n` +
        `• Matematika\n` +
        `• Fizika\n` +
        `• Kimyo\n` +
        `• Biologiya\n\n` +
        `Misol: "2x + 5 = 15 tenglamani yech"`;

    await ctx.reply(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
        ])
    });
}

async function handleMessage(ctx) {
    const userId = ctx.from.id;
    const userMessage = ctx.message.text;

    // Skip if command
    if (userMessage.startsWith('/')) return;

    // Check subscription
    const user = database.getUser(userId);
    if (!user || !database.canUserAskQuestion(userId)) {
        return ctx.reply(
            `⚠️ Sizning bepul limitingiz tugadi.\n\n` +
            `Premium obunaga o'ting va cheksiz savollar bering!\n` +
            `Oyiga atigi 50,000 so'm.`,
            Markup.inlineKeyboard([
                [Markup.button.callback('⭐ Premium ga o\'tish', 'sub_buy')],
                [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
            ])
        );
    }

    // Show typing indicator
    await ctx.sendChatAction('typing');

    try {
        // Get AI response
        const response = await aiService.getResponse(userMessage);

        // Save to history
        database.addChatMessage(userId, userMessage, response);

        // Send response
        await ctx.reply(
            `🤖 *UstozAI:*\n\n${response}`,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback('💡 Yana savol', 'chat_continue'),
                        Markup.button.callback('🏠 Menyu', 'main_menu')
                    ]
                ])
            }
        );

        // Update user stats
        database.incrementUserQuestions(userId);

    } catch (error) {
        console.error('Chat error:', error);
        await ctx.reply(
            `❌ Kechirasiz, javob berishda xatolik yuz berdi.\n` +
            `Iltimos, qaytadan urinib ko'ring.`
        );
    }
}

module.exports = {
    startChat,
    handleMessage
};
