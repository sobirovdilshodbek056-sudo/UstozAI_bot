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
        return { words: [] };
    }
}

// Show practice menu
async function showPracticeMenu(ctx, langId) {
    try {
        const message = `✍️ *Mashq qilish*\n\nQaysi usulda mashq qilmoqchisiz?\n\n🎯 *Flashcards* - So'zlarni esda saqlash\n📝 *Test* - Bilimingizni tekshirish\n\nMashq turiga va darajasini tanlang:`;

        const buttons = [
            [
                Markup.button.callback('🎯 Flashcards', `practice_flash_${langId}`),
                Markup.button.callback('📝 Test', `practice_test_${langId}`)
            ],
            [Markup.button.callback('← Orqaga', `lang_${langId}`)]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing practice menu:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show flashcard settings
async function showFlashcardSettings(ctx, langId) {
    try {
        const message = `🎯 *Flashcards*\n\nNechta so'z bilan mashq qilasiz?`;

        const buttons = [
            [
                Markup.button.callback('5 ta', `flash_start_${langId}_5`),
                Markup.button.callback('10 ta', `flash_start_${langId}_10`)
            ],
            [
                Markup.button.callback('15 ta', `flash_start_${langId}_15`),
                Markup.button.callback('20 ta', `flash_start_${langId}_20`)
            ],
            [Markup.button.callback('← Orqaga', `practice_${langId}`)]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing flashcard settings:', error);
    }
}

// Start flashcards
async function startFlashcards(ctx, langId, count) {
    try {
        const dict = await getDictionary(langId);
        const words = dict.words.sort(() => 0.5 - Math.random()).slice(0, count);

        ctx.session = ctx.session || {};
        ctx.session.flashcards = {
            langId,
            words,
            currentIndex: 0,
            showingAnswer: false
        };

        await showFlashcard(ctx);
    } catch (error) {
        console.error('Error starting flashcards:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show current flashcard
async function showFlashcard(ctx) {
    try {
        const session = ctx.session.flashcards;
        const word = session.words[session.currentIndex];
        const progress = `${session.currentIndex + 1}/${session.words.length}`;

        let message = `🎯 *Flashcard* ${progress}\n\n`;

        if (!session.showingAnswer) {
            // Show question
            message += `${word.image || '📝'} *${word.word}*\n`;
            if (word.romanization) {
                message += `_${word.romanization}_\n`;
            }
            if (word.transcription) {
                message += `🔊 ${word.transcription}\n`;
            }
            message += `\n💡 Click "Ko'rsatish" to see translation`;

            const buttons = [
                [Markup.button.callback('👁 Ko\'rsatish', 'flash_show')],
                [Markup.button.callback('⏭ O\'tkazib yuborish', 'flash_skip')],
                [Markup.button.callback('❌ Tugatish', `practice_${session.langId}`)]
            ];

            await ctx.editMessageText(message, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard(buttons)
            });
        } else {
            // Show answer
            message += `${word.image || '📝'} *${word.word}*\n`;
            if (word.romanization) {
                message += `_${word.romanization}_\n`;
            }
            message += `\n💬 *Tarjima:* ${word.translation}\n`;
            message += `📊 *Daraja:* ${word.level}\n`;

            if (word.examples && word.examples.length > 0) {
                const ex = word.examples[0];
                const exText = ex.en || ex.de || ex.ko || ex.ja;
                message += `\n📖 *Misol:*\n${exText}\n_${ex.uz}_\n`;
            }

            message += `\n✅ Biladizmi?`;

            const buttons = [
                [
                    Markup.button.callback('✅ Bilaman', 'flash_know'),
                    Markup.button.callback('❌ Bilmayman', 'flash_dont_know')
                ],
                [Markup.button.callback('Tugatish', `practice_${session.langId}`)]
            ];

            await ctx.editMessageText(message, {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard(buttons)
            });
        }
    } catch (error) {
        console.error('Error showing flashcard:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show test settings
async function showTestSettings(ctx, langId) {
    try {
        const message = `📝 *Test*\n\nNechta savol?`;

        const buttons = [
            [
                Markup.button.callback('5 ta', `test_start_${langId}_5`),
                Markup.button.callback('10 ta', `test_start_${langId}_10`)
            ],
            [
                Markup.button.callback('15 ta', `test_start_${langId}_15`),
                Markup.button.callback('20 ta', `test_start_${langId}_20`)
            ],
            [Markup.button.callback('← Orqaga', `practice_${langId}`)]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing test settings:', error);
    }
}

// Start test
async function startTest(ctx, langId, count) {
    try {
        const dict = await getDictionary(langId);
        const words = dict.words.sort(() => 0.5 - Math.random()).slice(0, count);

        ctx.session = ctx.session || {};
        ctx.session.test = {
            langId,
            words,
            currentIndex: 0,
            score: 0,
            startTime: Date.now()
        };

        await showTestQuestion(ctx);
    } catch (error) {
        console.error('Error starting test:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show test question
async function showTestQuestion(ctx) {
    try {
        const session = ctx.session.test;
        const word = session.words[session.currentIndex];
        const dict = await getDictionary(session.langId);
        const progress = `${session.currentIndex + 1}/${session.words.length}`;

        // Generate wrong answers
        const wrongAnswers = dict.words
            .filter(w => w.id !== word.id && w.level === word.level)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => w.translation);

        // Combine and shuffle
        const options = [word.translation, ...wrongAnswers].sort(() => 0.5 - Math.random());

        let message = `📝 *Test* ${progress}\n⭐ Ball: ${session.score}\n\n`;
        message += `${word.image || '🤔'} *${word.word}*\n`;
        if (word.romanization) {
            message += `_${word.romanization}_\n`;
        }
        message += `\nTo'g'ri tarjimasini tanlang:`;

        const buttons = [];
        const letters = ['A', 'B', 'C', 'D'];
        options.forEach((option, i) => {
            buttons.push([Markup.button.callback(
                `${letters[i]}. ${option}`,
                `test_answer_${i}_${option === word.translation ? 'correct' : 'wrong'}`
            )]);
        });

        buttons.push([Markup.button.callback('❌ Tugatish', 'test_finish')]);

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });
    } catch (error) {
        console.error('Error showing test question:', error);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

// Show test results
async function showTestResults(ctx) {
    try {
        const session = ctx.session.test;
        const totalQuestions = session.words.length;
        const percentage = Math.round((session.score / (totalQuestions * 10)) * 100);
        const timeTaken = Math.floor((Date.now() - session.startTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;

        let message = `🎉 *Test yakunlandi!*\n\n`;
        message += `⭐ *Ball:* ${session.score}/${totalQuestions * 10}\n`;
        message += `📊 *To'g'ri:* ${percentage}%\n`;
        message += `⏱ *Vaqt:* ${minutes}:${seconds.toString().padStart(2, '0')}\n\n`;

        if (percentage >= 90) {
            message += `🌟 Ajoyib! Siz zo'rsiz!`;
        } else if (percentage >= 70) {
            message += `👏 Yaxshi natija! Davom eting!`;
        } else if (percentage >= 50) {
            message += `💪 Yomon emas! Yana mashq qiling!`;
        } else {
            message += `📚 Ko'proq o'rganing va qayta urinib ko'ring!`;
        }

        const buttons = [
            [Markup.button.callback('🔄 Qayta boshlash', `test_start_${session.langId}_${totalQuestions}`)],
            [Markup.button.callback('🏠 Bosh menyu', `lang_${session.langId}`)]
        ];

        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard(buttons)
        });

        // Clear session
        delete ctx.session.test;
    } catch (error) {
        console.error('Error showing test results:', error);
    }
}

// Handle vocabulary callbacks
function handleVocabularyCallbacks(bot) {
    // Flashcard mode
    bot.action(/^practice_flash_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        await showFlashcardSettings(ctx, langId);
    });

    // Start flashcards
    bot.action(/^flash_start_(.+)_(\d+)$/, async (ctx) => {
        const langId = ctx.match[1];
        const count = parseInt(ctx.match[2]);
        await startFlashcards(ctx, langId, count);
    });

    // Show flashcard answer
    bot.action('flash_show', async (ctx) => {
        ctx.session.flashcards.showingAnswer = true;
        await showFlashcard(ctx);
    });

    // Flashcard - know it
    bot.action('flash_know', async (ctx) => {
        const session = ctx.session.flashcards;
        session.currentIndex++;
        session.showingAnswer = false;

        if (session.currentIndex < session.words.length) {
            await showFlashcard(ctx);
        } else {
            await ctx.editMessageText('✅ Barcha kartochkalar ko\'rib chiqildi!', {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([[
                    Markup.button.callback('🔄 Qayta', `flash_start_${session.langId}_${session.words.length}`),
                    Markup.button.callback('🏠 Menyu', `lang_${session.langId}`)
                ]])
            });
        }
    });

    // Flashcard - don't know it
    bot.action('flash_dont_know', async (ctx) => {
        // Same as know for now
        await ctx.answerCbQuery('Yana mashq qiling!');
        const session = ctx.session.flashcards;
        session.currentIndex++;
        session.showingAnswer = false;

        if (session.currentIndex < session.words.length) {
            await showFlashcard(ctx);
        } else {
            await ctx.editMessageText('✅ Barcha kartochkalar ko\'rib chiqildi!', {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([[
                    Markup.button.callback('🔄 Qayta', `flash_start_${session.langId}_${session.words.length}`),
                    Markup.button.callback('🏠 Menyu', `lang_${session.langId}`)
                ]])
            });
        }
    });

    // Skip flashcard
    bot.action('flash_skip', async (ctx) => {
        const session = ctx.session.flashcards;
        session.currentIndex++;
        session.showingAnswer = false;

        if (session.currentIndex < session.words.length) {
            await showFlashcard(ctx);
        } else {
            await ctx.editMessageText('✅ Tugadi!', {
                ...Markup.inlineKeyboard([[Markup.button.callback('🏠 Menyu', `lang_${session.langId}`)]])
            });
        }
    });

    // Test mode
    bot.action(/^practice_test_(.+)$/, async (ctx) => {
        const langId = ctx.match[1];
        await showTestSettings(ctx, langId);
    });

    // Start test
    bot.action(/^test_start_(.+)_(\d+)$/, async (ctx) => {
        const langId = ctx.match[1];
        const count = parseInt(ctx.match[2]);
        await startTest(ctx, langId, count);
    });

    // Test answer
    bot.action(/^test_answer_\d+_(correct|wrong)$/, async (ctx) => {
        const isCorrect = ctx.match[1] === 'correct';
        const session = ctx.session.test;

        if (isCorrect) {
            session.score += 10;
            await ctx.answerCbQuery('✅ To\'g\'ri!');
        } else {
            await ctx.answerCbQuery('❌ Noto\'g\'ri!');
        }

        session.currentIndex++;

        if (session.currentIndex < session.words.length) {
            await showTestQuestion(ctx);
        } else {
            await showTestResults(ctx);
        }
    });

    // Finish test early
    bot.action('test_finish', async (ctx) => {
        await showTestResults(ctx);
    });
}

// Setup vocabulary handlers
function setupVocabularyHandlers(bot) {
    handleVocabularyCallbacks(bot);
}

module.exports = {
    showPracticeMenu,
    setupVocabularyHandlers
};
