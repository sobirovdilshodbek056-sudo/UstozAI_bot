const { Telegraf } = require('telegraf');

const bot = new Telegraf('8449334072:AAFHy3rMweD-NM9JkxnDeKMn8kKhYzZgdmg', {
    telegram: {
        apiRoot: 'https://api.telegram.org',
        agent: null,
        webhookReply: false
    },
    handlerTimeout: 90_000
});

console.log('🔄 Webhook o\'chirilmoqda...');
console.log('🌐 API test qilinmoqda...');

// Delete webhook first
bot.telegram.deleteWebhook()
    .then(() => {
        console.log('✅ Webhook o\'chirildi!');

        bot.start(async (ctx) => {
            try {
                console.log('✅ /start buyrug\'i olindi!');
                console.log('👤 User ID:', ctx.from.id);

                // Use direct API call instead of ctx.reply
                await bot.telegram.sendMessage(
                    ctx.from.id,
                    '✅ SALOM! Bot ISHLAYAPTI! 🎉\n\nMen sizning xabarlaringizni olaman!'
                );

                console.log('📤 JAVOB YUBORILDI!');
            } catch (error) {
                console.error('❌ XATO:', error.message);
            }
        });

        bot.help(async (ctx) => {
            try {
                await bot.telegram.sendMessage(ctx.from.id, 'Yordam: /start ni bosing');
                console.log('📤 Yordam yuborildi!');
            } catch (error) {
                console.error('❌ Help xatosi:', error.message);
            }
        });

        bot.on('text', async (ctx) => {
            try {
                const text = ctx.message.text;
                console.log('📝 Xabar olindi:', text);

                await bot.telegram.sendMessage(
                    ctx.from.id,
                    `📨 Xabaringiz qabul qilindi:\n"${text}"\n\n✅ Bot to'liq ishlayapti!`
                );

                console.log('📤 JAVOB YUBORILDI!');
            } catch (error) {
                console.error('❌ Text xatosi:', error.message);
            }
        });

        return bot.launch();
    })
    .then(() => {
        console.log('');
        console.log('🚀🚀🚀 BOT ISHGA TUSHDI! 🚀🚀🚀');
        console.log('📱 Telegram: /start yuboring');
        console.log('');
    })
    .catch(err => {
        console.error('❌ LAUNCH XATOSI:', err.message);
    });

bot.catch((err, ctx) => {
    console.error('🔴 GLOBAL XATO:', err.message);
});

process.once('SIGINT', () => {
    console.log('\n👋 Bot to\'xtatilmoqda...');
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => bot.stop('SIGTERM'));
