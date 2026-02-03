// Simple bot test - minimal version
require('dotenv').config();
const { Telegraf } = require('telegraf');

const TOKEN = process.env.BOT_TOKEN;

console.log('Token mavjud:', TOKEN ? 'Ha' : 'Yo\'q');
console.log('Token uzunligi:', TOKEN?.length || 0);
console.log('');

if (!TOKEN) {
    console.error('❌ BOT_TOKEN yo\'q!');
    process.exit(1);
}

console.log('🔄 Minimal bot yaratilmoqda...');
const bot = new Telegraf(TOKEN);

console.log('✅ Bot obyekti yaratildi');

bot.command('start', (ctx) => {
    console.log('📍 /start qabul qilindi');
    ctx.reply('Salom! Bot ishlayapti ✅');
});

bot.on('text', (ctx) => {
    console.log('📝 Xabar:', ctx.message.text);
    ctx.reply(`Siz yozdingiz: ${ctx.message.text}`);
});

console.log('🚀 Bot ishga tushirilmoqda...\n');

bot.launch()
    .then(() => {
        console.log('✅ BOT ISHGA TUSHDI!');
        console.log('Xabar yuboring va natijani kuring\n');
    })
    .catch((err) => {
        console.error('\n❌ XATOLIK:');
        console.error('Xato turi:', err.name);
        console.error('Xato xabari:', err.message);
        console.error('\nTo\'liq xato:');
        console.error(err);
        process.exit(1);
    });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
