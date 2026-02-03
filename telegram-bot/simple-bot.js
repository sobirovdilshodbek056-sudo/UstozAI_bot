// Minimal Bot - Eng oddiy versiya
const { Telegraf } = require('telegraf');

const TOKEN = '8449334072:AAFHy3rMweD-NM9JkxnDeKMn8kKhYzZgdmg';
const bot = new Telegraf(TOKEN);

console.log('🔄 Bot ishga tushmoqda...');

bot.start((ctx) => {
    console.log('✅ /start buyrug\'i olindi!');
    ctx.reply('Salom! Bot ishlayapti! ✅');
});

bot.help((ctx) => {
    ctx.reply('Yordam: /start ni bosing');
});

bot.on('text', (ctx) => {
    console.log('📝 Xabar olindi:', ctx.message.text);
    ctx.reply(`Men sizning xabaringizni oldim: ${ctx.message.text}`);
});

// Delete webhook first, then start polling
bot.telegram.deleteWebhook()
    .then(() => {
        console.log('✅ Webhook o\'chirildi');
        return bot.launch();
    })
    .then(() => {
        console.log('✅✅✅ BOT ISHGA TUSHDI! ✅✅✅');
        console.log('📱 Telegramda /start ni bosing');
        console.log('🤖 Bot: @UstozAI_7bot');
    })
    .catch((err) => {
        console.error('❌ XATO:', err.message);
        console.error('To\'liq xato:', err);
    });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
