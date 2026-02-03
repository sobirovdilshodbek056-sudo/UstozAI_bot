const { Telegraf } = require('telegraf');

const bot = new Telegraf('8449334072:AAFHy3rMweD-NM9JkxnDeKMn8kKhYzZgdmg');

bot.start((ctx) => ctx.reply('✅ Salom! Bot ISHLAYAPTI!'));
bot.help((ctx) => ctx.reply('Yordam: /start'));
bot.on('text', (ctx) => ctx.reply('Men sizning xabaringizni oldim!'));

bot.launch();
console.log('Bot ishga tushdi!');
