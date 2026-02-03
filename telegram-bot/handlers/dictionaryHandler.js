const { Markup } = require('telegraf');
const fs = require('fs').promises;
const path = require('path');

// Load dictionary
async function getDictionary(langId) {
    try {
        const dataPath = path.join(__dirname, `../../data/dictionary-${langId}.json`);
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading dictionary:', error);
        return { words: [], categories: [] };
    }
}

// Show dictionary menu
async function showDictionary(ctx, langId) {
    try {
        const dict = await getDictionary(langId);
        const wordCount = dict.words.length;
        const categoryCount = dict.categories.length;

        const message = `📚 *Lug'at*\n\n🔢 Jami so'zlar: ${wordCount}\n📂 Kategoriyalar: ${categoryCount}\n\n*Qidiruv uchun:*\nSo'z kiriting yoki kategoriya tanlang:`;

        const buttons = [
            [
                Markup.button.callback('📂 Kategoriyalar', `dict_cat_${langId}`),
                Markup.button.callback('⭐ Sevimlilar', `dict_fav_${langId}`)
            ],
            [
                Markup.button.callback('🎲 Tasodifiy so\'z', `dict_random_${langId}`),
                Markup.button.callback('📊 Statistika', `dict_stats_${langId}`)
            ],
            [Markup.button.callback('← Orqaga', `lang_${langId}`)]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });

        // Set search mode
        ctx.session = ctx.session || {};
        ctx.session.dictSearchMode = true;
        ctx.session.selectedLanguage = langId;
    } catch (error) {
        console.error('Error showing dictionary:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show categories
async function showCategories(ctx, langId, page = 0) {
    try {
        const dict = await getDictionary(langId);
        const categories = dict.categories;
        const perPage = 6;
        const totalPages = Math.ceil(categories.length / perPage);
        const start = page * perPage;
        const end = start + perPage;
        const pageCategories = categories.slice(start, end);

        let message = `📂 *Kategoriyalar* (${page + 1}/${totalPages})\n\n`;

        const buttons = [];
        for (const cat of pageCategories) {
            const wordsInCat = dict.words.filter(w => w.category === cat.id).length;
            buttons.push([Markup.button.callback(
                `${cat.icon} ${cat.name} (${wordsInCat})`,
                `dict_catwords_${langId}_${cat.id}`
            )]);
        }

        // Pagination
        const navRow = [];
        if (page > 0) {
            navRow.push(Markup.button.callback('◀️ Oldingi', `dict_cat_${langId}_${page - 1}`));
        }
        if (page < totalPages - 1) {
            navRow.push(Markup.button.callback('Keyingi ▶️', `dict_cat_${langId}_${page + 1}`));
        }
        if (navRow.length > 0) buttons.push(navRow);

        buttons.push([Markup.button.callback('← Lug\'atga qaytish', `dict_${langId}`)]);

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing categories:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show words in category
async function showCategoryWords(ctx, langId, categoryId, page = 0) {
    try {
        const dict = await getDictionary(langId);
        const category = dict.categories.find(c => c.id === categoryId);
        const words = dict.words.filter(w => w.category === categoryId);

        const perPage = 5;
        const totalPages = Math.ceil(words.length / perPage);
        const start = page * perPage;
        const end = start + perPage;
        const pageWords = words.slice(start, end);

        let message = `${category.icon} *${category.name}*\n\n📝 Jami: ${words.length} ta so'z\n\n`;

        const buttons = [];
        for (const word of pageWords) {
            buttons.push([Markup.button.callback(
                `${word.image || '📝'} ${word.word}`,
                `dict_word_${langId}_${word.id}`
            )]);
        }

        // Pagination
        const navRow = [];
        if (page > 0) {
            navRow.push(Markup.button.callback('◀️', `dict_catwords_${langId}_${categoryId}_${page - 1}`));
        }
        navRow.push(Markup.button.callback(`${page + 1}/${totalPages}`, 'noop'));
        if (page < totalPages - 1) {
            navRow.push(Markup.button.callback('▶️', `dict_catwords_${langId}_${categoryId}_${page + 1}`));
        }
        buttons.push(navRow);

        buttons.push([Markup.button.callback('← Kategoriyalar', `dict_cat_${langId}`)]);

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing category words:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show word details
async function showWordDetail(ctx, langId, wordId) {
    try {
        const dict = await getDictionary(langId);
        const word = dict.words.find(w => w.id === parseInt(wordId));

        if (!word) {
            await ctx.answerCbQuery('So\'z topilmadi');
            return;
        }

        let message = `${word.image || '📝'} *${word.word}*\n`;

        if (word.romanization) {
            message += `_${word.romanization}_\n`;
        }
        if (word.transcription) {
            message += `🔊 ${word.transcription}\n`;
        }

        message += `\n💬 *Tarjima:* ${word.translation}\n`;
        message += `📊 *Daraja:* ${word.level}\n`;
        message += `📂 *Kategoriya:* ${word.category}\n`;
        message += `🏷 *Turi:* ${word.partOfSpeech}\n`;

        if (word.examples && word.examples.length > 0) {
            message += `\n📖 *Misollar:*\n`;
            word.examples.slice(0, 2).forEach((ex, i) => {
                const exText = ex.en || ex.de || ex.ko || ex.ja;
                message += `${i + 1}. ${exText}\n   _${ex.uz}_\n`;
            });
        }

        if (word.synonyms && word.synonyms.length > 0) {
            message += `\n🔄 *Sinonimlar:* ${word.synonyms.join(', ')}\n`;
        }

        const buttons = [
            [
                Markup.button.callback('⭐ Sevimli', `dict_fav_add_${langId}_${wordId}`),
                Markup.button.callback('✅ O\'rgandim', `dict_learned_${langId}_${wordId}`)
            ],
            [Markup.button.callback('← Orqaga', `dict_${langId}`)]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing word detail:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Search word
async function searchWord(ctx, query, langId) {
    try {
        const dict = await getDictionary(langId);
        const lowerQuery = query.toLowerCase();

        const results = dict.words.filter(w =>
            w.word.toLowerCase().includes(lowerQuery) ||
            w.translation.toLowerCase().includes(lowerQuery) ||
            (w.romanization && w.romanization.toLowerCase().includes(lowerQuery))
        ).slice(0, 10);

        if (results.length === 0) {
            await ctx.reply('❌ Hech narsa topilmadi. Boshqa so\'z bilan qidiring.');
            return;
        }

        let message = `🔍 *Qidiruv natijalari:* "${query}"\n\n📊 Topildi: ${results.length} ta\n\n`;

        const buttons = [];
        for (const word of results) {
            buttons.push([Markup.button.callback(
                `${word.image || '📝'} ${word.word} - ${word.translation}`,
                `dict_word_${langId}_${word.id}`
            )]);
        }

        buttons.push([Markup.button.callback('🏠 Lug\'at menyu', `dict_${langId}`)]);

        await ctx.reply(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error searching word:', error);
        await ctx.reply('❌ Qidiruv xatosi.');
    }
}

// Show random word
async function showRandomWord(ctx, langId) {
    try {
        const dict = await getDictionary(langId);
        const randomWord = dict.words[Math.floor(Math.random() * dict.words.length)];

        await showWordDetail(ctx, langId, randomWord.id);
    } catch (error) {
        console.error('Error showing random word:', error);
        await ctx.answerCbQuery('❌ Xatolik');
    }
}

// Handle dictionary callbacks
function handleDictionaryCallbacks(bot) {
    // Categories
    bot.action(/^dict_cat_(.+?)(?:_(\d+))?$/, async (ctx) => {
        const langId = ctx.match[1];
        const page = parseInt(ctx.match[2] || '0');
        await showCategories(ctx, langId, page);
    });

    // Category words
    bot.action(/^dict_catwords_(.+)_(.+?)(?:_(\d+))?$/, async (ctx) => {
        const langId = ctx.match[1];
        const categoryId = ctx.match[2];
        const page = parseInt(ctx.match[3] || '0');
        await showCategoryWords(ctx, langId, categoryId, page);
    });

    // Word detail
    bot.action(/^dict_word_(.+)_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        const wordId = ctx.match[2];
        await showWordDetail(ctx, langId, wordId);
    });

    // Random word
    bot.action(/^dict_random_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        await showRandomWord(ctx, langId);
    });

    // No-op for pagination display
    bot.action('noop', (ctx) => ctx.answerCbQuery());
}

// Handle text messages for search
function handleDictionaryMessages(bot) {
    bot.on('text', async (ctx) => {
        if (ctx.session && ctx.session.dictSearchMode && ctx.session.selectedLanguage) {
            const query = ctx.message.text;
            const langId = ctx.session.selectedLanguage;
            await searchWord(ctx, query, langId);
        }
    });
}

// Setup dictionary handlers
function setupDictionaryHandlers(bot) {
    handleDictionaryCallbacks(bot);
    handleDictionaryMessages(bot);
}

module.exports = {
    showDictionary,
    setupDictionaryHandlers
};
