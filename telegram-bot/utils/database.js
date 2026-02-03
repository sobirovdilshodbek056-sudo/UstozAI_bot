// Mock Database - In-memory storage for Telegram bot
// In production, use real database like MongoDB or PostgreSQL

class Database {
    constructor() {
        this.users = new Map();
        this.testSessions = new Map();
    }

    // User management
    getUser(userId) {
        if (!this.users.has(userId)) {
            this.users.set(userId, {
                id: userId,
                subscription: { type: 'free', startDate: new Date().toISOString() },
                stats: {
                    totalQuestions: 0,
                    questionsToday: 0,
                    totalTests: 0,
                    testsToday: 0,
                    lastQuestionDate: null,
                    lastTestDate: null
                },
                chatHistory: [],
                testResults: []
            });
        }
        return this.users.get(userId);
    }

    getUserSubscription(userId) {
        const user = this.getUser(userId);
        return user.subscription;
    }

    // Check if user can ask questions
    canUserAskQuestion(userId) {
        const user = this.getUser(userId);

        // Premium users have unlimited questions
        if (user.subscription.type !== 'free') {
            return true;
        }

        // Free users: 10 questions per day
        const today = new Date().toDateString();
        const lastDate = user.stats.lastQuestionDate
            ? new Date(user.stats.lastQuestionDate).toDateString()
            : null;

        if (lastDate !== today) {
            user.stats.questionsToday = 0;
        }

        return user.stats.questionsToday < 10;
    }

    // Increment question count
    incrementUserQuestions(userId) {
        const user = this.getUser(userId);
        const today = new Date().toDateString();
        const lastDate = user.stats.lastQuestionDate
            ? new Date(user.stats.lastQuestionDate).toDateString()
            : null;

        if (lastDate !== today) {
            user.stats.questionsToday = 0;
        }

        user.stats.questionsToday++;
        user.stats.totalQuestions++;
        user.stats.lastQuestionDate = new Date().toISOString();
    }

    // Chat history
    addChatMessage(userId, question, answer) {
        const user = this.getUser(userId);
        user.chatHistory.push({
            question,
            answer,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 messages
        if (user.chatHistory.length > 50) {
            user.chatHistory = user.chatHistory.slice(-50);
        }
    }

    // Test sessions
    initTestSession(userId, sessionData) {
        this.testSessions.set(userId, sessionData);
    }

    getTestSession(userId) {
        return this.testSessions.get(userId);
    }

    updateTestSession(userId, sessionData) {
        this.testSessions.set(userId, sessionData);
    }

    clearTestSession(userId) {
        this.testSessions.delete(userId);
    }

    // Test results
    saveTestResult(userId, result) {
        const user = this.getUser(userId);
        user.testResults.push(result);

        // Update test stats
        const today = new Date().toDateString();
        const lastDate = user.stats.lastTestDate
            ? new Date(user.stats.lastTestDate).toDateString()
            : null;

        if (lastDate !== today) {
            user.stats.testsToday = 0;
        }

        user.stats.testsToday++;
        user.stats.totalTests++;
        user.stats.lastTestDate = new Date().toISOString();

        // Keep only last 20 results
        if (user.testResults.length > 20) {
            user.testResults = user.testResults.slice(-20);
        }
    }

    getUserTestResults(userId) {
        const user = this.getUser(userId);
        return user.testResults;
    }

    // Statistics
    getUserStats(userId) {
        const user = this.getUser(userId);
        const results = user.testResults;

        let averageScore = 0;
        if (results.length > 0) {
            const totalScore = results.reduce((sum, r) => sum + r.score, 0);
            averageScore = Math.round(totalScore / results.length);
        }

        // Calculate this month's stats
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        const thisMonthResults = results.filter(r => {
            const date = new Date(r.date);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
        });

        return {
            totalQuestions: user.stats.totalQuestions,
            totalTests: user.stats.totalTests,
            questionsThisMonth: thisMonthResults.length * 5, // Approximate
            testsThisMonth: thisMonthResults.length,
            averageScore: averageScore,
            studyHours: Math.round((user.stats.totalQuestions * 0.1 + user.stats.totalTests * 0.5) * 10) / 10
        };
    }

    // Subscription management
    updateSubscription(userId, subscriptionData) {
        const user = this.getUser(userId);
        user.subscription = subscriptionData;
    }
}

module.exports = new Database();
