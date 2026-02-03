// Test Data for UstozAI
// Mock test questions database

const TestData = {
    // Test categories by grade and subject
    tests: {
        '5-sinf': {
            matematika: {
                title: '5-sinf Matematika',
                duration: 30,
                questions: [
                    {
                        id: 1,
                        question: '125 + 347 = ?',
                        options: ['472', '462', '482', '452'],
                        correct: 0,
                        explanation: '125 + 347 = 472. Birliklar: 5+7=12 (2 yoz, 1 esda), O\'nliklar: 2+4+1=7, Yuzliklar: 1+3=4'
                    },
                    {
                        id: 2,
                        question: '8 × 7 = ?',
                        options: ['54', '56', '64', '48'],
                        correct: 1,
                        explanation: '8 × 7 = 56. Ko\'paytirish jadvalidan.'
                    },
                    {
                        id: 3,
                        question: 'Uchburchakning nechta tomoni bor?',
                        options: ['2', '3', '4', '5'],
                        correct: 1,
                        explanation: 'Uchburchak - 3 ta tomoni va 3 ta burchagi bor shakl.'
                    },
                    {
                        id: 4,
                        question: '1000 - 456 = ?',
                        options: ['544', '554', '644', '654'],
                        correct: 0,
                        explanation: '1000 - 456 = 544'
                    },
                    {
                        id: 5,
                        question: '15 ÷ 3 = ?',
                        options: ['3', '4', '5', '6'],
                        correct: 2,
                        explanation: '15 ÷ 3 = 5. 15 ni 3 ta teng qismga bo\'lsak, har bir qism 5 ga teng.'
                    }
                ]
            }
        },
        '9-sinf': {
            matematika: {
                title: '9-sinf Matematika - Algebraik Tenglamalar',
                duration: 45,
                questions: [
                    {
                        id: 1,
                        question: '2x + 5 = 15 tenglamadan x ni toping',
                        options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
                        correct: 1,
                        explanation: '2x = 15 - 5\n2x = 10\nx = 10 ÷ 2\nx = 5'
                    },
                    {
                        id: 2,
                        question: '3(x - 2) = 12 tenglamadan x ni toping',
                        options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
                        correct: 1,
                        explanation: 'x - 2 = 12 ÷ 3\nx - 2 = 4\nx = 4 + 2\nx = 6'
                    },
                    {
                        id: 3,
                        question: 'x² = 16 tenglamaning musbat ildizi qaysi?',
                        options: ['x = 2', 'x = 4', 'x = 8', 'x = 16'],
                        correct: 1,
                        explanation: 'x² = 16\nx = ±√16\nx = ±4\nMusbat ildiz: x = 4'
                    },
                    {
                        id: 4,
                        question: '5x - 3 = 2x + 9 tenglamadan x ni toping',
                        options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
                        correct: 2,
                        explanation: '5x - 2x = 9 + 3\n3x = 12\nx = 4'
                    },
                    {
                        id: 5,
                        question: '(x + 3)² = 25 tenglamadan x ni toping (musbat)',
                        options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
                        correct: 1,
                        explanation: 'x + 3 = ±√25\nx + 3 = ±5\nMusbat: x + 3 = 5\nx = 2'
                    }
                ]
            },
            fizika: {
                title: '9-sinf Fizika - Mexanika',
                duration: 40,
                questions: [
                    {
                        id: 1,
                        question: 'Tezlik formulasi qaysi?',
                        options: ['v = s × t', 'v = s / t', 'v = t / s', 'v = s + t'],
                        correct: 1,
                        explanation: 'Tezlik (v) = Masofa (s) / Vaqt (t)'
                    },
                    {
                        id: 2,
                        question: 'Nyutonning 2-qonuni qaysi?',
                        options: ['F = m + a', 'F = m - a', 'F = m × a', 'F = m / a'],
                        correct: 2,
                        explanation: 'F = m × a (Kuch = massa × tezlanish)'
                    },
                    {
                        id: 3,
                        question: 'Erkin tushish tezlanishi nechaga teng?',
                        options: ['8 m/s²', '9.8 m/s²', '10 m/s²', '11 m/s²'],
                        correct: 1,
                        explanation: 'Yer yuzasida g ≈ 9.8 m/s²'
                    },
                    {
                        id: 4,
                        question: 'Avtomobil 100 km ni 2 soatda bosib o\'tdi. Tezligi?',
                        options: ['40 km/soat', '45 km/soat', '50 km/soat', '60 km/soat'],
                        correct: 2,
                        explanation: 'v = s / t = 100 km / 2 soat = 50 km/soat'
                    },
                    {
                        id: 5,
                        question: 'Impuls formulasi qaysi?',
                        options: ['p = m + v', 'p = m - v', 'p = m × v', 'p = m / v'],
                        correct: 2,
                        explanation: 'Impuls (p) = massa (m) × tezlik (v)'
                    }
                ]
            }
        },
        '11-sinf': {
            matematika: {
                title: '11-sinf Matematika - Integral va Hosilalar',
                duration: 60,
                questions: [
                    {
                        id: 1,
                        question: 'f(x) = x² funksiyaning hosilasi qaysi?',
                        options: ['f\'(x) = x', 'f\'(x) = 2x', 'f\'(x) = x²', 'f\'(x) = 2x²'],
                        correct: 1,
                        explanation: '(x²)\' = 2x. Quvvat qoidasi: (xⁿ)\' = n·xⁿ⁻¹'
                    },
                    {
                        id: 2,
                        question: '∫ 2x dx = ?',
                        options: ['x', 'x² + C', '2x²', '2x² + C'],
                        correct: 1,
                        explanation: '∫ 2x dx = x² + C'
                    },
                    {
                        id: 3,
                        question: 'lim(x→∞) 1/x = ?',
                        options: ['0', '1', '∞', 'aniqlanmagan'],
                        correct: 0,
                        explanation: 'x cheksizlikka intilganda 1/x nolga intiladi'
                    },
                    {
                        id: 4,
                        question: 'sin²x + cos²x = ?',
                        options: ['0', '1', '2', 'x'],
                        correct: 1,
                        explanation: 'Trigonometriyaning asosiy ayniyati: sin²x + cos²x = 1'
                    },
                    {
                        id: 5,
                        question: 'log₂8 = ?',
                        options: ['2', '3', '4', '8'],
                        correct: 1,
                        explanation: 'log₂8 = 3, chunki 2³ = 8'
                    }
                ]
            }
        },
        abituriyent: {
            matematika: {
                title: 'Abituriyent - Matematika DTM',
                duration: 90,
                questions: [
                    {
                        id: 1,
                        question: 'Agar x + y = 10 va xy = 21 bo\'lsa, x² + y² = ?',
                        options: ['58', '64', '70', '100'],
                        correct: 0,
                        explanation: 'x² + y² = (x+y)² - 2xy = 10² - 2(21) = 100 - 42 = 58'
                    },
                    {
                        id: 2,
                        question: '√(64) × √(16) = ?',
                        options: ['16', '24', '32', '64'],
                        correct: 2,
                        explanation: '√64 × √16 = 8 × 4 = 32'
                    },
                    {
                        id: 3,
                        question: '2^10 = ?',
                        options: ['512', '1000', '1024', '2048'],
                        correct: 2,
                        explanation: '2¹⁰ = 1024'
                    },
                    {
                        id: 4,
                        question: 'Agar 3x - 2y = 7 va x + 2y = 9 bo\'lsa, x = ?',
                        options: ['2', '3', '4', '5'],
                        correct: 2,
                        explanation: 'Tenglamalarni qo\'shib: 4x = 16, x = 4'
                    },
                    {
                        id: 5,
                        question: 'To\'g\'ri burchakli uchburchakda a=3, b=4. Gipotenuza c=?',
                        options: ['5', '6', '7', '√7'],
                        correct: 0,
                        explanation: 'Pifagor teoremasi: c² = a² + b² = 9 + 16 = 25, c = 5'
                    }
                ]
            }
        }
    },

    // Get available tests for a grade
    getTestsByGrade(grade) {
        return this.tests[grade] || {};
    },

    // Get specific test
    getTest(grade, subject) {
        return this.tests[grade]?.[subject] || null;
    },

    // Get all available grades
    getGrades() {
        return Object.keys(this.tests);
    },

    // Get subjects for a grade
    getSubjects(grade) {
        return Object.keys(this.tests[grade] || {});
    },

    // Evaluate test answers
    evaluateTest(grade, subject, userAnswers) {
        const test = this.getTest(grade, subject);
        if (!test) return null;

        let correctCount = 0;
        const results = test.questions.map((q, index) => {
            const isCorrect = userAnswers[index] === q.correct;
            if (isCorrect) correctCount++;

            return {
                questionId: q.id,
                question: q.question,
                userAnswer: userAnswers[index],
                correctAnswer: q.correct,
                isCorrect: isCorrect,
                explanation: q.explanation
            };
        });

        const score = Math.round((correctCount / test.questions.length) * 100);

        return {
            grade,
            subject,
            testTitle: test.title,
            totalQuestions: test.questions.length,
            correctAnswers: correctCount,
            wrongAnswers: test.questions.length - correctCount,
            score: score,
            passed: score >= 60,
            results: results,
            completedAt: new Date().toISOString()
        };
    },

    // Generate random test
    generateRandomTest(grade, subject, questionCount = 5) {
        const test = this.getTest(grade, subject);
        if (!test) return null;

        // Shuffle and select questions
        const shuffled = [...test.questions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

        return {
            ...test,
            questions: selected
        };
    }
};

// Export for use in other files
window.TestData = TestData;
