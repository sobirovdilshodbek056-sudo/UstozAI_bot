// Mock AI Service for UstozAI
// Simulates AI responses for demo purposes

const MockAI = {
    // Subject-specific knowledge base
    knowledgeBase: {
        matematika: {
            topics: ['Algebra', 'Geometriya', 'Trigonometriya', 'Funksiyalar'],
            examples: [
                { question: '2x + 5 = 15 tenglamani yeching', answer: 'x = 5', explanation: '1. 2x = 15 - 5\n2. 2x = 10\n3. x = 10 ÷ 2\n4. x = 5' },
                { question: 'Uchburchakning yuzini toping: a=5, b=12', answer: 'S = 30', explanation: 'To\'g\'ri burchakli uchburchak yuzasi: S = (a × b) / 2 = (5 × 12) / 2 = 30' }
            ]
        },
        fizika: {
            topics: ['Mexanika', 'Elektr', 'Optika', 'Termodinamika'],
            examples: [
                { question: 'Tezlik formulasi nima?', answer: 'v = s / t', explanation: 'Tezlik (v) = Masofa (s) / Vaqt (t)\nMasalan: 100 km ni 2 soatda bosib o\'tsangiz, tezligingiz 50 km/soat bo\'ladi' }
            ]
        },
        kimyo: {
            topics: ['Organik kimyo', 'Anorganik kimyo', 'Reaksiyalar'],
            examples: [
                { question: 'Suvning formulasi?', answer: 'H₂O', explanation: 'Suv molekulasi 2 ta vodorod (H) va 1 ta kislorod (O) atomidan tashkil topgan' }
            ]
        },
        biologiya: {
            topics: ['Hujayra', 'Genetika', 'Ekologiya', 'Anatomiya'],
            examples: [
                { question: 'Fotosintez qanday jarayon?', answer: 'Yorug\'lik energiyasini kimyoviy energiyaga aylantirish', explanation: '6CO₂ + 6H₂O + yorug\'lik → C₆H₁₂O₆ + 6O₂' }
            ]
        }
    },

    // Generate AI response to student question
    async getResponse(question) {
        // Simulate API delay
        await this.delay(1000 + Math.random() * 1000);

        const lowerQuestion = question.toLowerCase();

        // Check for subject keywords
        if (lowerQuestion.includes('matematik') || lowerQuestion.includes('tengla') || /\d+x/.test(lowerQuestion)) {
            return this.getMathResponse(question);
        } else if (lowerQuestion.includes('fizik') || lowerQuestion.includes('tezlik') || lowerQuestion.includes('kuch')) {
            return this.getPhysicsResponse(question);
        } else if (lowerQuestion.includes('kimyo') || lowerQuestion.includes('atom') || lowerQuestion.includes('molekula')) {
            return this.getChemistryResponse(question);
        } else if (lowerQuestion.includes('biolog') || lowerQuestion.includes('hujayra') || lowerQuestion.includes('o\'simlik')) {
            return this.getBiologyResponse(question);
        }

        // General response
        return this.getGeneralResponse(question);
    },

    getMathResponse(question) {
        const responses = [
            `Matematika savoli uchun rahmat! Keling, bosqichma-bosqich yechamiz:\n\n1️⃣ Berilgan ma'lumotlarni aniqlash\n2️⃣ Formulani tanlash\n3️⃣ Hisoblarni amalga oshirish\n4️⃣ Javobni tekshirish\n\nMisol: Agar 2x + 5 = 15 bo'lsa:\n• 2x = 15 - 5\n• 2x = 10  \n• x = 5\n\nJavob: x = 5 ✅`,
            `Bu juda yaxshi savol! Matematikada eng muhimi - ketma-ketlikda ishlash.\n\nQuyidagi qadamlarni bajaring:\n1. Noma'lumni bir tomonga o'tkazing\n2. Sonlarni ikkinchi tomonga\n3. Soddalashtirib hisoblang\n\nYana tushunarsiz joy bo'lsa, so'rang! 😊`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },

    getPhysicsResponse(question) {
        return `Fizika - tabiat qonunlarini o'rganadigan fan! 🔬\n\nSizning savolingiz uchun:\n• Asosiy formula: v = s / t (tezlik = masofa ÷ vaqt)\n• SI sistemasida: m/s\n• Kundalik hayotda: km/soat\n\nMisol masala:\nAgar avtomobil 120 km masofani 2 soatda bosib o'tsa:\nv = 120 km ÷ 2 soat = 60 km/soat\n\nQo'shimcha savol?`;
    },

    getChemistryResponse(question) {
        return `Kimyo - moddalar olamini o'rganamiz! ⚗️\n\nMuhim qoidalar:\n1. Atom - moddaning eng kichik qismi\n2. Molekula - atomlardan tashkil topgan\n3. Reakciya - moddalar o'zgarishi\n\nMasalan, suv (H₂O):\n• 2 ta vodorod atomi (H)\n• 1 ta kislorod atomi (O)\n\nBoshqa savol bo'lsa, bemalol so'rang! 🧪`;
    },

    getBiologyResponse(question) {
        return `Biologiya - tirik organizmlar haqida fan! 🌱\n\nAsosiy tushunchalar:\n1. Hujayra - hayotning birlamchi birligi\n2. DNK - genetik ma'lumot saqlaydi\n3. Fotosintez - o'simliklarning oziqlanishi\n\nMisol:\nFotosintez tenglamasi:\n6CO₂ + 6H₂O + yorug'lik → C₆H₁₂O₆ + 6O₂\n\nYana tushuntirish kerakmi? 🔬`;
    },

    getGeneralResponse(question) {
        const responses = [
            `Ajoyib savol! Keling, buni birga o'rganamiz! 📚\n\nBu mavzuda:\n• Asosiy tushunchalarni tushunish kerak\n• Misollar bilan ishlash foydali\n• Amaliyotda ko'p mashq qilish zarur\n\nQaysi fanidan yordam kerak? (Matematika, Fizika, Kimyo, Biologiya)`,
            `Sizning savolingizni tushundim! 💡\n\nYanada aniqroq javob berish uchun:\n• Qaysi sinf darslaridan?\n• Qaysi mavzu bo'yicha?\n• Konkret misol keltiring\n\nShunda ko'proq yordam bera olaman! `,
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },

    // Generate explanation for a problem
    async explainConcept(concept) {
        await this.delay(800);

        const explanations = {
            default: `"${concept}" mavzusi bo'yicha tushuntirish:\n\n📖 Ta'rif: Bu mavzu o'rganilayotgan fanningizngilar muhim qismidir.\n\n🎯 Maqsad: Asosiy tushunchalarni o'zlashtirish va amaliyotda qo'llash.\n\n💡 Maslahat: Ko'proq misollar bilan ishlang va amaliyot qiling!\n\nQo'shimcha savol?`
        };

        return explanations[concept] || explanations.default;
    },

    // Check answer and provide feedback
    async checkAnswer(question, userAnswer, correctAnswer) {
        await this.delay(500);

        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

        if (isCorrect) {
            const praise = ['Ajoyib! ✅', 'Zo\'r! 🎉', 'To\'g\'ri! 👏', 'Mukammal! ⭐'];
            return {
                correct: true,
                message: `${praise[Math.floor(Math.random() * praise.length)]}\n\nJavobingiz to'g'ri! Davom eting! 🚀`
            };
        } else {
            return {
                correct: false,
                message: `To'g'ri javob: ${correctAnswer}\n\n📝 Xato sababi:\nSiz yozgan: "${userAnswer}"\nTo'g'ri javob: "${correctAnswer}"\n\n💡 Maslahat: Yana bir marta sinab ko'ring va diqqat bilan hisoblang!`
            };
        }
    },

    // Generate practice problems
    async generatePracticeProblems(subject, count = 5) {
        await this.delay(1000);

        const problems = {
            matematika: [
                { question: '3x - 7 = 14', answer: 'x = 7' },
                { question: '15 + 2x = 31', answer: 'x = 8' },
                { question: '4(x + 2) = 20', answer: 'x = 3' },
                { question: '10 - 3x = 1', answer: 'x = 3' },
                { question: '2x/5 = 6', answer: 'x = 15' }
            ],
            fizika: [
                { question: 'Tezlik 20 m/s, vaqt 5 s. Masofa?', answer: 's = 100 m' },
                { question: 'Massa 10 kg, tezlanish 5 m/s². Kuch?', answer: 'F = 50 N' },
                { question: 'Quvvat 100 W, vaqt 10 s. Ish?', answer: 'A = 1000 J' }
            ]
        };

        return problems[subject] || problems.matematika;
    },

    // Utility: Simulate async delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Export for use in other files
window.MockAI = MockAI;
