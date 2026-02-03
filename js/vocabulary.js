// Vocabulary.js - Flashcards and Tests Logic

let currentLang = null;
let practiceWords = [];
let currentIndex = 0;
let isFlipped = false;
let testMode = false;
let testScore = 0;
let testStartTime = null;
let timerInterval = null;
let selectedAnswers = [];

// Initialize
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    currentLang = urlParams.get('lang') || localStorage.getItem('selectedLanguage') || 'en';

    const langInfo = await LanguageData.getLanguageById(currentLang);
    if (langInfo) {
        document.getElementById('languageFlag').textContent = langInfo.flag;
        document.getElementById('languageName').textContent = `${langInfo.name} - So'z O'rganish`;
    }
}

// Start Flashcards Mode
async function startFlashcards() {
    const count = parseInt(document.getElementById('wordCount').value);
    const level = document.getElementById('levelSelect').value;

    practiceWords = await LanguageData.getRandomWords(currentLang, count, level === 'all' ? null : level);

    if (practiceWords.length === 0) {
        alert('So\'zlar topilmadi!');
        return;
    }

    currentIndex = 0;
    testMode = false;

    document.getElementById('modeSelection').classList.add('hidden');
    document.getElementById('flashcardSection').classList.remove('hidden');

    document.getElementById('totalCards').textContent = practiceWords.length;
    loadFlashcard();
}

// Load flashcard
function loadFlashcard() {
    const word = practiceWords[currentIndex];
    if (!word) return;

    isFlipped = false;
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');

    document.getElementById('cardEmoji').textContent = word.image || '📝';
    document.getElementById('cardWord').textContent = word.word;
    document.getElementById('cardRoman').textContent = word.romanization || word.transcription || '';
    document.getElementById('cardTranslation').textContent = word.translation;

    // Examples
    if (word.examples && word.examples.length > 0) {
        const exampleHTML = word.examples.slice(0, 2).map(ex => `
            <div class="example-mini">
                <p>${ex.en || ex.de || ex.ko || ex.ja}</p>
                <p><small>${ex.uz}</small></p>
            </div>
        `).join('');
        document.getElementById('cardExamples').innerHTML = exampleHTML;
    } else {
        document.getElementById('cardExamples').innerHTML = '';
    }

    // Update progress
    document.getElementById('currentCard').textContent = currentIndex + 1;
    const progress = ((currentIndex + 1) / practiceWords.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentIndex === 0;
    document.getElementById('nextBtn').textContent =
        currentIndex === practiceWords.length - 1 ? 'Tugatish' : 'Keyingi →';
}

// Flip card
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

// Play card audio
function playCardAudio() {
    const word = practiceWords[currentIndex];
    if (word) {
        LanguageData.Speech.speak(word.word, currentLang);
    }
}

// Next card
function nextCard() {
    if (currentIndex < practiceWords.length - 1) {
        currentIndex++;
        loadFlashcard();
    } else {
        // Finished
        if (confirm('Barcha kartochkalar ko\'rib chiqildi! Qayta boshlashni xohlaysizmi?')) {
            currentIndex = 0;
            loadFlashcard();
        } else {
            exitPractice();
        }
    }
}

// Previous card
function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        loadFlashcard();
    }
}

// Start Test Mode
async function startTest() {
    const count = parseInt(document.getElementById('wordCount').value);
    const level = document.getElementById('levelSelect').value;

    practiceWords = await LanguageData.getRandomWords(currentLang, count, level === 'all' ? null : level);

    if (practiceWords.length === 0) {
        alert('So\'zlar topilmadi!');
        return;
    }

    currentIndex = 0;
    testScore = 0;
    selectedAnswers = [];
    testMode = true;
    testStartTime = Date.now();

    document.getElementById('modeSelection').classList.add('hidden');
    document.getElementById('testSection').classList.remove('hidden');

    document.getElementById('totalQuestions').textContent = practiceWords.length;
    document.getElementById('currentScore').textContent = '0';

    startTimer();
    loadTestQuestion();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Load test question
async function loadTestQuestion() {
    const word = practiceWords[currentIndex];
    if (!word) return;

    document.getElementById('questionEmoji').textContent = word.image || '🤔';
    document.getElementById('questionWord').textContent = word.word;
    document.getElementById('questionText').textContent =
        word.romanization ? `${word.word} (${word.romanization})` : word.word;

    // Generate wrong answers
    const allWords = (await LanguageData.getDictionary(currentLang)).words;
    const wrongAnswers = allWords
        .filter(w => w.id !== word.id && w.level === word.level)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.translation);

    // Combine and shuffle
    const options = [word.translation, ...wrongAnswers].sort(() => 0.5 - Math.random());

    // Display options
    const optionsHTML = options.map((option, idx) => `
        <button class="answer-option" onclick="selectAnswer('${option}', '${word.translation}')">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="option-text">${option}</span>
        </button>
    `).join('');

    document.getElementById('answerOptions').innerHTML = optionsHTML;

    // Update progress
    document.getElementById('currentQuestion').textContent = currentIndex + 1;
    const progress = ((currentIndex + 1) / practiceWords.length) * 100;
    document.getElementById('testProgressFill').style.width = progress + '%';
}

// Select answer
function selectAnswer(selected, correct) {
    const isCorrect = selected === correct;

    // Disable all buttons
    const buttons = document.querySelectorAll('.answer-option');
    buttons.forEach(btn => {
        btn.disabled = true;
        const text = btn.querySelector('.option-text').textContent;

        if (text === correct) {
            btn.classList.add('correct');
        } else if (text === selected && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Update score
    if (isCorrect) {
        testScore += 10;
        document.getElementById('currentScore').textContent = testScore;
        selectedAnswers.push(true);
        showFeedback('✅ To\'g\'ri!', 'success');
    } else {
        selectedAnswers.push(false);
        showFeedback('❌ Noto\'g\'ri! To\'g\'ri javob: ' + correct, 'error');
    }

    // Auto advance after delay
    setTimeout(() => {
        if (currentIndex < practiceWords.length - 1) {
            currentIndex++;
            loadTestQuestion();
        } else {
            finishTest();
        }
    }, 1500);
}

// Show feedback
function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(() => feedback.classList.add('show'), 100);
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 1200);
}

// Finish test
function finishTest() {
    stopTimer();

    const totalQuestions = practiceWords.length;
    const correctAnswers = selectedAnswers.filter(a => a).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);

    // Save results
    LanguageData.Progress.saveTestResult(currentLang, 'custom-test', testScore, totalQuestions, timeTaken);

    // Display results
    document.getElementById('finalScore').textContent = testScore;
    document.getElementById('finalPercentage').textContent = percentage + '%';

    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    document.getElementById('finalTime').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Message based on score
    let message = '';
    if (percentage >= 90) {
        message = '🌟 Ajoyib! Siz zo\'rsiz!';
    } else if (percentage >= 70) {
        message = '👏 Yaxshi natija! Davom eting!';
    } else if (percentage >= 50) {
        message = '💪 Yomon emas! Yana mashq qiling!';
    } else {
        message = '📚 Ko\'proq o\'rganing va qayta urinib ko\'ring!';
    }
    document.getElementById('resultsMessage').textContent = message;

    document.getElementById('resultsModal').classList.add('active');
}

// Restart test
function restartTest() {
    document.getElementById('resultsModal').classList.remove('active');
    document.getElementById('testSection').classList.add('hidden');
    document.getElementById('modeSelection').classList.remove('hidden');
}

// Exit practice
function exitPractice() {
    stopTimer();
    document.getElementById('flashcardSection').classList.add('hidden');
    document.getElementById('testSection').classList.add('hidden');
    document.getElementById('resultsModal').classList.remove('active');
    document.getElementById('modeSelection').classList.remove('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
