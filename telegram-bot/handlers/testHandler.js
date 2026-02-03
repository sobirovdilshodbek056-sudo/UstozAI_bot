// Test Handler - Test management and taking

const { Markup } = require('telegraf');
const database = require('../utils/database');

// Mock test data
const tests = {
    '9-sinf': {
        matematika: {
            title: '9-sinf Matematika',
            questions: [
                {
                    q: '2x + 5 = 15 tenglamadan x ni toping',
                    options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
                    correct: 1
                },
                {
                    q: '3(x - 2) = 12 tenglamadan x ni toping',
                    options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
                    correct: 1
                },
                {
                    q: 'x² = 16 tenglamaning musbat ildizi?',
                    options: ['x = 2', 'x = 4', 'x = 8', 'x = 16'],
                    correct: 1
                }
            ]
        }
    }
};

async function showTests(ctx) {
    const message =
        `📝 *Testlar*\n\n` +
        `Sinfingizni tanlang:`;

    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback('5-sinf', 'test_grade_5'),
            Markup.button.callback('6-sinf', 'test_grade_6')
        ],
        [
            Markup.button.callback('9-sinf', 'test_grade_9'),
            Markup.button.callback('11-sinf', 'test_grade_11')
        ],
        [Markup.button.callback('Abituriyent', 'test_grade_abit')],
        [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
    ]);

    if (ctx.callbackQuery) {
        await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    } else {
        await ctx.reply(message, {
            parse_mode: 'Markdown',
            ...keyboard
        });
    }
}

async function showResults(ctx) {
    const userId = ctx.from.id;
    const results = database.getUserTestResults(userId);

    if (!results || results.length === 0) {
        return ctx.reply(
            `📊 *Natijalar*\n\n` +
            `Siz hali test topshirmadingiz.\n\n` +
            `Birinchi testingizni topshiring!`,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.callback('📝 Testlar', 'test_list')],
                    [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
                ])
            }
        );
    }

    let message = `📊 *Sizning Natijalaringiz*\n\n`;

    results.slice(-5).reverse().forEach((result, index) => {
        const emoji = result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : '📚';
        message += `${emoji} *${result.testName}*\n`;
        message += `   Ball: ${result.score}% (${result.correct}/${result.total})\n`;
        message += `   Vaqt: ${result.date}\n\n`;
    });

    await ctx.reply(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('📝 Yana test', 'test_list')],
            [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
        ])
    });
}

async function handleTestAction(ctx) {
    const action = ctx.match[0];

    if (action.startsWith('test_grade_')) {
        const grade = action.replace('test_grade_', '');
        await showSubjects(ctx, grade);
    } else if (action.startsWith('test_start_')) {
        const [_, grade, subject] = action.split('_').slice(1);
        await startTest(ctx, grade, subject);
    } else if (action.startsWith('test_answer_')) {
        await handleAnswer(ctx, action);
    }
}

async function showSubjects(ctx, grade) {
    const message =
        `📚 *Fanlar*\n\n` +
        `Testni tanlang:`;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🧮 Matematika', `test_start_${grade}_matematika`)],
        [Markup.button.callback('🔬 Fizika', `test_start_${grade}_fizika`)],
        [Markup.button.callback('⚗️ Kimyo', `test_start_${grade}_kimyo`)],
        [Markup.button.callback('🌱 Biologiya', `test_start_${grade}_biologiya`)],
        [Markup.button.callback('◀️ Orqaga', 'test_list')]
    ]);

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}

async function startTest(ctx, grade, subject) {
    const userId = ctx.from.id;
    const testKey = `${grade}`;

    if (!tests[testKey] || !tests[testKey][subject]) {
        return ctx.editMessageText(
            `❌ Bu test hali mavjud emas.\n\n` +
            `Boshqa testlarni sinab ko'ring!`,
            Markup.inlineKeyboard([
                [Markup.button.callback('📝 Testlar', 'test_list')],
                [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
            ])
        );
    }

    const test = tests[testKey][subject];

    // Initialize test session
    database.initTestSession(userId, {
        grade,
        subject,
        questions: test.questions,
        currentQuestion: 0,
        answers: [],
        startTime: Date.now()
    });

    await showQuestion(ctx, userId, 0);
}

async function showQuestion(ctx, userId, questionIndex) {
    const session = database.getTestSession(userId);

    if (!session || questionIndex >= session.questions.length) {
        return finishTest(ctx, userId);
    }

    const question = session.questions[questionIndex];
    const progress = `${questionIndex + 1}/${session.questions.length}`;

    const message =
        `📝 *Test* (${progress})\n\n` +
        `*Savol:* ${question.q}\n\n` +
        `Variantlardan birini tanlang:`;

    const buttons = question.options.map((option, index) => [
        Markup.button.callback(
            `${String.fromCharCode(65 + index)}. ${option}`,
            `test_answer_${questionIndex}_${index}`
        )
    ]);

    buttons.push([Markup.button.callback('❌ Testni bekor qilish', 'test_cancel')]);

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
    });
}

async function handleAnswer(ctx, action) {
    const userId = ctx.from.id;
    const [_, __, questionIndex, answerIndex] = action.split('_');

    const session = database.getTestSession(userId);
    if (!session) return;

    // Save answer
    session.answers.push(parseInt(answerIndex));
    database.updateTestSession(userId, session);

    // Show next question or finish
    const nextIndex = parseInt(questionIndex) + 1;
    await showQuestion(ctx, userId, nextIndex);
}

async function finishTest(ctx, userId) {
    const session = database.getTestSession(userId);
    if (!session) return;

    // Calculate score
    let correct = 0;
    session.questions.forEach((q, i) => {
        if (session.answers[i] === q.correct) correct++;
    });

    const total = session.questions.length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 60;

    // Save result
    database.saveTestResult(userId, {
        testName: `${session.grade} ${session.subject}`,
        score,
        correct,
        total,
        date: new Date().toLocaleString('uz-UZ')
    });

    // Clear session
    database.clearTestSession(userId);

    const emoji = score >= 80 ? '🏆' : score >= 60 ? '👍' : '📚';
    const message =
        `${emoji} *Test Yakunlandi!*\n\n` +
        `*Natija:* ${score}%\n` +
        `To'g'ri javoblar: ${correct}/${total}\n` +
        `Status: ${passed ? '✅ O\'tdi' : '❌ O\'tmadi'}\n\n` +
        (score >= 80 ? `Ajoyib! 🎉` : score >= 60 ? `Yaxshi! 👏` : `Qayta urinib ko'ring! 💪`);

    await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('🔄 Yana test', 'test_list')],
            [Markup.button.callback('📊 Natijalar', 'show_results')],
            [Markup.button.callback('🏠 Asosiy menyu', 'main_menu')]
        ])
    });
}

module.exports = {
    showTests,
    showResults,
    handleTestAction
};
