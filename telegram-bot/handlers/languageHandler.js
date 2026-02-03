const { Markup } = require('telegraf');
const fs = require('fs').promises;
const path = require('path');

// Load languages data
async function getLanguages() {
    try {
        const dataPath = path.join(__dirname, '../../data/languages.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading languages:', error);
        return [];
    }
}

// Show language selection
async function showLanguages(ctx) {
    try {
        const languages = await getLanguages();

        const message = `🌍 *Til tanlang*\n\nQaysi tilni o'rganmoqchisiz? Har bir til uchun quyidagilar mavjud:\n\n📚 Lug'at\n✍️ Mashqlar va testlar\n📖 Grammatika darslari\n🎯 Progress tracking`;

        // Create keyboard buttons (2 per row)
        const buttons = [];
        for (let i = 0; i < languages.length; i += 2) {
            const row = [];
            row.push(Markup.button.callback(
                `${languages[i].flag} ${languages[i].name}`,
                `lang_${languages[i].id}`
            ));
            if (i + 1 < languages.length) {
                row.push(Markup.button.callback(
                    `${languages[i + 1].flag} ${languages[i + 1].name}`,
                    `lang_${languages[i + 1].id}`
                ));
            }
            buttons.push(row);
        }

        // Add back button
        buttons.push([Markup.button.callback('🏠 Bosh menyu', 'main_menu')]);

        await ctx.reply(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing languages:', error);
        await ctx.reply('❌ Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    }
}

// Show language menu
async function showLanguageMenu(ctx, langId) {
    try {
        const languages = await getLanguages();
        const language = languages.find(l => l.id === langId);

        if (!language) {
            await ctx.reply('❌ Til topilmadi.');
            return;
        }

        const message = `${language.flag} *${language.name}* \n_${language.nativeName}_\n\n${language.description}\n\n📊 *Ma'lumotlar:*\n• Daraja: ${language.difficulty}\n• So'zlar: ${language.wordCount}+\n• Grammatika: ${language.grammarLessons} dars\n• Testlar: ${language.vocabularyTests} ta\n\nNima qilmoqchisiz?`;

        const buttons = [
            [
                Markup.button.callback('📚 Lug\'at', `dict_${langId}`),
                Markup.button.callback('✍️ Mashq', `practice_${langId}`)
            ],
            [
                Markup.button.callback('📖 Grammatika', `grammar_${langId}`),
                Markup.button.callback('📊 Progressim', `progress_${langId}`)
            ],
            [Markup.button.callback('← Orqaga', 'languages')]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing language menu:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Handle language selection
function handleLanguageCallback(bot) {
    // Language selection
    bot.action(/^lang_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        await showLanguageMenu(ctx, langId);
    });

    // Back to languages list
    bot.action('languages', async (ctx) => {
        await ctx.deleteMessage();
        await showLanguages(ctx);
    });

    // Dictionary
    bot.action(/^dict_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        // This will be handled by dictionaryHandler
        ctx.session = ctx.session || {};
        ctx.session.selectedLanguage = langId;

        const dictionaryHandler = require('./dictionaryHandler');
        await dictionaryHandler.showDictionary(ctx, langId);
    });

    // Practice
    bot.action(/^practice_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        ctx.session = ctx.session || {};
        ctx.session.selectedLanguage = langId;

        const vocabularyHandler = require('./vocabularyHandler');
        await vocabularyHandler.showPracticeMenu(ctx, langId);
    });

    // Grammar
    bot.action(/^grammar_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        ctx.session = ctx.session || {};
        ctx.session.selectedLanguage = langId;

        const grammarHandler = require('./grammarHandler');
        await grammarHandler.showGrammarLessons(ctx, langId);
    });

    // Progress
    bot.action(/^progress_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        ctx.session = ctx.session || {};
        ctx.session.selectedLanguage = langId;

        const progressHandler = require('./progressHandler');
        await progressHandler.showProgress(ctx, langId);
    });
}

// Command handler
function setupLanguageCommands(bot) {
    bot.command('languages', showLanguages);
    bot.command('tillar', showLanguages);

    handleLanguageCallback(bot);
}

module.exports = {
    showLanguages,
    showLanguageMenu,
    setupLanguageCommands
};
