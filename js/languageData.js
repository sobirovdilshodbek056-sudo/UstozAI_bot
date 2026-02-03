// Language Data Module
// Manages all language learning data (languages, dictionary, grammar, tests)

const LanguageData = (() => {
    const DATA_PATH = 'data/';

    // Cache for loaded data
    const cache = {
        languages: null,
        dictionaries: {},
        grammar: null,
        tests: null
    };

    // Load JSON file
    async function loadJSON(filename) {
        try {
            const response = await fetch(DATA_PATH + filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }

    // Get all available languages
    async function getLanguages() {
        if (cache.languages) {
            return cache.languages;
        }
        const data = await loadJSON('languages.json');
        cache.languages = data ? data.languages : [];
        return cache.languages;
    }

    // Get language by ID
    async function getLanguageById(langId) {
        const languages = await getLanguages();
        return languages.find(lang => lang.id === langId);
    }

    // Get dictionary for specific language
    async function getDictionary(langId) {
        if (cache.dictionaries[langId]) {
            return cache.dictionaries[langId];
        }
        const data = await loadJSON(`dictionary-${langId}.json`);
        cache.dictionaries[langId] = data || { words: [], categories: [] };
        return cache.dictionaries[langId];
    }

    // Search words in dictionary
    async function searchWords(langId, query) {
        const dict = await getDictionary(langId);
        if (!dict.words) return [];

        const lowerQuery = query.toLowerCase();
        return dict.words.filter(word =>
            word.word.toLowerCase().includes(lowerQuery) ||
            word.translation.toLowerCase().includes(lowerQuery) ||
            (word.romanization && word.romanization.toLowerCase().includes(lowerQuery))
        );
    }

    // Filter words by level
    async function filterWordsByLevel(langId, level) {
        const dict = await getDictionary(langId);
        if (!dict.words) return [];
        return dict.words.filter(word => word.level === level);
    }

    // Filter words by category
    async function filterWordsByCategory(langId, category) {
        const dict = await getDictionary(langId);
        if (!dict.words) return [];
        return dict.words.filter(word => word.category === category);
    }

    // Get grammar lessons
    async function getGrammarLessons(langId = null) {
        if (!cache.grammar) {
            const data = await loadJSON('grammar-lessons.json');
            cache.grammar = data ? data.lessons : [];
        }

        if (langId) {
            return cache.grammar.filter(lesson => lesson.language === langId);
        }
        return cache.grammar;
    }

    // Get grammar lesson by ID
    async function getGrammarLessonById(lessonId) {
        const lessons = await getGrammarLessons();
        return lessons.find(lesson => lesson.id === lessonId);
    }

    // Get vocabulary tests
    async function getVocabularyTests(langId = null) {
        if (!cache.tests) {
            const data = await loadJSON('vocabulary-tests.json');
            cache.tests = data ? data.tests : [];
        }

        if (langId) {
            return cache.tests.filter(test => test.language === langId);
        }
        return cache.tests;
    }

    // Get test by ID
    async function getTestById(testId) {
        const tests = await getVocabularyTests();
        return tests.find(test => test.id === testId);
    }

    // Get random words for flashcards
    async function getRandomWords(langId, count = 10, level = null) {
        const dict = await getDictionary(langId);
        let words = dict.words || [];

        if (level) {
            words = words.filter(word => word.level === level);
        }

        // Shuffle and return count items
        const shuffled = words.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // LocalStorage helpers for progress tracking
    const Progress = {
        // Get user's learned words
        getLearnedWords(langId) {
            const key = `learned_words_${langId}`;
            return JSON.parse(localStorage.getItem(key) || '[]');
        },

        // Add word to learned words
        addLearnedWord(langId, wordId) {
            const learned = this.getLearnedWords(langId);
            if (!learned.includes(wordId)) {
                learned.push(wordId);
                localStorage.setItem(`learned_words_${langId}`, JSON.stringify(learned));
            }
        },

        // Get favorite words
        getFavoriteWords(langId) {
            const key = `favorite_words_${langId}`;
            return JSON.parse(localStorage.getItem(key) || '[]');
        },

        // Toggle favorite word
        toggleFavorite(langId, wordId) {
            const favorites = this.getFavoriteWords(langId);
            const index = favorites.indexOf(wordId);

            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(wordId);
            }

            localStorage.setItem(`favorite_words_${langId}`, JSON.stringify(favorites));
            return index === -1; // Return true if added, false if removed
        },

        // Get test results
        getTestResults(langId) {
            const key = `test_results_${langId}`;
            return JSON.parse(localStorage.getItem(key) || '[]');
        },

        // Save test result
        saveTestResult(langId, testId, score, totalQuestions, timeTaken) {
            const results = this.getTestResults(langId);
            results.push({
                testId,
                score,
                totalQuestions,
                percentage: Math.round((score / totalQuestions) * 100),
                timeTaken,
                date: new Date().toISOString()
            });
            localStorage.setItem(`test_results_${langId}`, JSON.stringify(results));
        },

        // Get completed grammar lessons
        getCompletedLessons(langId) {
            const key = `completed_lessons_${langId}`;
            return JSON.parse(localStorage.getItem(key) || '[]');
        },

        // Mark lesson as completed
        completeLesson(langId, lessonId) {
            const completed = this.getCompletedLessons(langId);
            if (!completed.includes(lessonId)) {
                completed.push(lessonId);
                localStorage.setItem(`completed_lessons_${langId}`, JSON.stringify(completed));
            }
        },

        // Get overall statistics
        async getStatistics(langId) {
            const dict = await getDictionary(langId);
            const totalWords = dict.words ? dict.words.length : 0;
            const learnedWords = this.getLearnedWords(langId).length;
            const favorites = this.getFavoriteWords(langId).length;
            const testResults = this.getTestResults(langId);
            const completedLessons = this.getCompletedLessons(langId).length;

            const totalTests = testResults.length;
            const averageScore = totalTests > 0
                ? testResults.reduce((sum, r) => sum + r.percentage, 0) / totalTests
                : 0;

            return {
                totalWords,
                learnedWords,
                learnedPercentage: totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0,
                favorites,
                totalTests,
                averageScore: Math.round(averageScore),
                completedLessons
            };
        }
    };

    // Text-to-Speech using Web Speech API
    const Speech = {
        speak(text, lang = 'en-US') {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);

                // Map language codes to speech synthesis codes
                const langMap = {
                    'en': 'en-US',
                    'de': 'de-DE',
                    'ko': 'ko-KR',
                    'ja': 'ja-JP'
                };

                utterance.lang = langMap[lang] || lang;
                utterance.rate = 0.9; // Slightly slower for learning
                utterance.pitch = 1.0;

                window.speechSynthesis.speak(utterance);
            } else {
                console.warn('Text-to-speech not supported');
            }
        },

        stop() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
    };

    // Public API
    return {
        getLanguages,
        getLanguageById,
        getDictionary,
        searchWords,
        filterWordsByLevel,
        filterWordsByCategory,
        getGrammarLessons,
        getGrammarLessonById,
        getVocabularyTests,
        getTestById,
        getRandomWords,
        Progress,
        Speech
    };
})();
