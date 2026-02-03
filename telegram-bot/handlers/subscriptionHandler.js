// Subscription Handler - Subscription and payment

const { Markup } = require('telegraf');
const database = require('../utils/database');

async function showSubscription(ctx) {
    const userId = ctx.from.id;
    const subscription = database.getUserSubscription(userId);

    let message = `⭐ *Obuna*\n\n`;

    if (subscription && subscription.type !== 'free') {
        message += `✅ *Sizning obunangiz*\n\n`;
        message += `Turi: ${getSubscriptionName(subscription.type)}\n`;
        message += `Tugash sanasi: ${subscription.endDate}\n\n`;
        message += `Sizda to'liq kirish huquqi bor! 🎉`;
    } else {
        message += `🆓 *Bepul versiya*\n\n`;
        message += `Kunlik limit: 10 ta savol\n`;
        message += `Testlar: 3 ta/kun\n\n`;
        message += `Premium obunaga o'tib, cheksiz imkoniyatlardan foydalaning!`;
    }

    const keyboard = subscription && subscription.type !== 'free'
        ? [
            [Markup.button.callback('📊 Statistika', 'sub_stats')],
            [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
        ]
        : [
            [Markup.button.callback('💳 Premium ga o\'tish', 'sub_plans')],
            [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
        ];

    if (ctx.callbackQuery) {
        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(keyboard)
        });
    } else {
        await ctx.reply(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(keyboard)
        });
    }
}

async function handleSubscriptionAction(ctx) {
    const action = ctx.match[0];

    if (action === 'sub_plans') {
        await showPlans(ctx);
    } else if (action.startsWith('sub_buy_')) {
        const plan = action.replace('sub_buy_', '');
        await initPayment(ctx, plan);
    } else if (action === 'sub_stats') {
        await showStats(ctx);
    }
}

async function showPlans(ctx) {
    const message =
        `💎 *Premium Obuna*\n\n` +
        `Quyidagi paketlardan birini tanlang:`

        ;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📅 Oylik - 50,000 so\'m', 'sub_buy_monthly')],
        [Markup.button.callback('📆 Yillik - 500,000 so\'m (2 oy bepul!)', 'sub_buy_yearly')],
        [Markup.button.callback('♾️ Umrbod - 1,000,000 so\'m', 'sub_buy_lifetime')],
        [Markup.button.callback('◀️ Orqaga', 'subscription_info')]
    ]);

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}

async function initPayment(ctx, plan) {
    const prices = {
        monthly: { amount: 50000, duration: '1 oy' },
        yearly: { amount: 500000, duration: '1 yil' },
        lifetime: { amount: 1000000, duration: 'Umrbod' }
    };

    const planInfo = prices[plan];

    const message =
        `💳 *To'lov*\n\n` +
        `Paket: ${planInfo.duration}\n` +
        `Summa: ${planInfo.amount.toLocaleString('uz-UZ')} so'm\n\n` +
        `To'lov usulini tanlang:`;

    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.url('💳 Payme', `https://payme.uz/`),
            Markup.button.url('📱 Click', `https://click.uz/`)
        ],
        [Markup.button.callback('◀️ Orqaga', 'sub_plans')]
    ]);

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...keyboard
    });

    // In real app, generate payment link and save pending payment
    setTimeout(() => {
        ctx.telegram.sendMessage(
            ctx.from.id,
            `ℹ️ *To'lov haqida*\n\n` +
            `To'lovni amalga oshirganingizdan so'ng, administrator bilan bog'laning:\n` +
            `@UstozAI_Support\n\n` +
            `Yoki web platformada to'lang:\n` +
            `https://ustozai.uz/subscription`,
            { parse_mode: 'Markdown' }
        );
    }, 2000);
}

async function showStats(ctx) {
    const userId = ctx.from.id;
    const stats = database.getUserStats(userId);

    const message =
        `📊 *Statistika*\n\n` +
        `Shu oyda:\n` +
        `• Savollar: ${stats.questionsThisMonth || 0}\n` +
        `• Testlar: ${stats.testsThisMonth || 0}\n` +
        `• O'rtacha ball: ${stats.averageScore || 0}%\n\n` +
        `Jami:\n` +
        `• Savollar: ${stats.totalQuestions || 0}\n` +
        `• Testlar: ${stats.totalTests || 0}\n` +
        `• O'quv soatlari: ${stats.studyHours || 0} soat`;

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('◀️ Orqaga', 'subscription_info')]
        ])
    });
}

function getSubscriptionName(type) {
    const names = {
        monthly: 'Oylik Premium',
        yearly: 'Yillik Premium',
        lifetime: 'Umrbod Premium',
        free: 'Bepul'
    };
    return names[type] || 'Bepul';
}

module.exports = {
    showSubscription,
    handleSubscriptionAction
};
