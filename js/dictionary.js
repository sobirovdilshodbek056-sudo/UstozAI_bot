// Dictionary.js - Dictionary Page Logic

let currentLang = null;
let allWords = [];
let filteredWords = [];
let currentFilters = {
    level: 'all',
    category: 'all',
    favoritesOnly: false
};

// Initialize
async function init() {
    // Get language from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentLang = urlParams.get('lang') || localStorage.getItem('selectedLanguage') || 'en';

    // Load language info
    const langInfo = await LanguageData.getLanguageById(currentLang);
    if (langInfo) {
        document.getElementById('languageFlag').textContent = langInfo.flag;
        document.getElementById('languageName').textContent = `${langInfo.name} Lug'ati`;
        document.getElementById('pageSubtitle').textContent = langInfo.description;
        document.title = `${langInfo.name} Lug'ati - UstozAI`;
    }

    // Load dictionary
    await loadDictionary();

    // Setup event listeners
    setupEventListeners();

    // Load categories
    loadCategories();

    // Update statistics
    updateStatistics();

    // Initial display
    displayWords(allWords);
}

// Load dictionary data
async function loadDictionary() {
    const dict = await LanguageData.getDictionary(currentLang);
    allWords = dict.words || [];
    filteredWords = [...allWords];
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        clearSearch.style.display = query ? 'block' : 'none';
        performSearch(query);
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        performSearch('');
    });

    // Level filters
    document.querySelectorAll('.filter-btn[data-level]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn[data-level]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilters.level = e.target.dataset.level;
            applyFilters();
        });
    });

    // Favorites checkbox
    document.getElementById('showFavorites').addEventListener('change', (e) => {
        currentFilters.favoritesOnly = e.target.checked;
        applyFilters();
    });
}

// Load categories
async function loadCategories() {
    const dict = await LanguageData.getDictionary(currentLang);
    const categories = dict.categories || [];
    const categoryList = document.getElementById('categoryList');

    categoryList.innerHTML = `
        <button class="category-btn active" data-category="all">
            📚 Barchasi
        </button>
        ${categories.map(cat => `
            <button class="category-btn" data-category="${cat.id}">
                ${cat.icon} ${cat.name}
            </button>
        `).join('')}
    `;

    // Add event listeners
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilters.category = e.target.dataset.category;
            applyFilters();
        });
    });
}

// Perform search
function performSearch(query) {
    if (!query) {
        applyFilters();
        return;
    }

    const lowerQuery = query.toLowerCase();
    filteredWords = allWords.filter(word =>
        word.word.toLowerCase().includes(lowerQuery) ||
        word.translation.toLowerCase().includes(lowerQuery) ||
        (word.romanization && word.romanization.toLowerCase().includes(lowerQuery))
    );

    displayWords(filteredWords);
}

// Apply all filters
function applyFilters() {
    let words = [...allWords];

    // Level filter
    if (currentFilters.level !== 'all') {
        words = words.filter(w => w.level === currentFilters.level);
    }

    // Category filter
    if (currentFilters.category !== 'all') {
        words = words.filter(w => w.category === currentFilters.category);
    }

    // Favorites filter
    if (currentFilters.favoritesOnly) {
        const favorites = LanguageData.Progress.getFavoriteWords(currentLang);
        words = words.filter(w => favorites.includes(w.id));
    }

    filteredWords = words;
    displayWords(filteredWords);
}

// Display words
function displayWords(words) {
    const grid = document.getElementById('wordsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');

    if (words.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'flex';
        resultsCount.textContent = '';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    resultsCount.textContent = `${words.length} ta so'z topildi`;

    const favorites = LanguageData.Progress.getFavoriteWords(currentLang);
    const learned = LanguageData.Progress.getLearnedWords(currentLang);

    grid.innerHTML = words.map(word => {
        const isFavorite = favorites.includes(word.id);
        const isLearned = learned.includes(word.id);

        return `
            <div class="word-card ${isLearned ? 'learned' : ''}" onclick="showWordDetail(${word.id})">
                <div class="word-card-header">
                    <div class="word-emoji">${word.image || '📝'}</div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${word.id})">
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="word-main">
                    <h3 class="word-text">${word.word}</h3>
                    ${word.romanization ? `<p class="word-roman">${word.romanization}</p>` : ''}
                    ${word.transcription ? `<p class="word-transcription">${word.transcription}</p>` : ''}
                </div>
                <div class="word-translation">${word.translation}</div>
                <div class="word-meta">
                    <span class="word-level">${word.level}</span>
                    <span class="word-type">${word.partOfSpeech}</span>
                </div>
                <button class="word-audio-btn" onclick="event.stopPropagation(); playAudio('${word.word}', '${currentLang}')">
                    🔊 Tinglash
                </button>
            </div>
        `;
    }).join('');
}

// Show word detail modal
async function showWordDetail(wordId) {
    const dict = await LanguageData.getDictionary(currentLang);
    const word = dict.words.find(w => w.id === wordId);

    if (!word) return;

    const favorites = LanguageData.Progress.getFavoriteWords(currentLang);
    const isFavorite = favorites.includes(word.id);

    const detailHTML = `
        <div class="word-detail-header">
            <div class="word-detail-emoji">${word.image || '📝'}</div>
            <button class="favorite-btn-large ${isFavorite ? 'active' : ''}" 
                    onclick="toggleFavorite(${word.id})">
                ${isFavorite ? '❤️ Sevimlilardan olib tashlash' : '🤍 Sevimlilarga qo\'shish'}
            </button >
        </div >

        <div class="word-detail-main">
            <h2 class="word-detail-title">${word.word}</h2>
            ${word.romanization ? `<p class="word-detail-roman">${word.romanization}</p>` : ''}
            ${word.transcription ? `<p class="word-detail-trans">${word.transcription}</p>` : ''}

            <div class="word-detail-translation">
                <strong>Tarjima:</strong> ${word.translation}
            </div>

            <div class="word-detail-info">
                <span class="info-badge">${word.level}</span>
                <span class="info-badge">${word.partOfSpeech}</span>
                <span class="info-badge">${word.category}</span>
            </div>

            <button class="btn btn-primary" onclick="playAudio('${word.word.replace(/'/g, "\\'")}', '${currentLang}')">
                🔊 Talaffuzni tinglash
            </button>
        </div>

        ${word.examples && word.examples.length > 0 ? `
            <div class="word-examples">
                <h3>Misollar:</h3>
                ${word.examples.map((ex, idx) => `
                    <div class="example-item">
                        <div class="example-num">${idx + 1}</div>
                        <div class="example-content">
                            <p class="example-original">${ex.en || ex.de || ex.ko || ex.ja}</p>
                            <p class="example-translation">${ex.uz}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${word.synonyms && word.synonyms.length > 0 ? `
            <div class="word-synonyms">
                <h4>Sinonimlar:</h4>
                <div class="synonyms-list">
                    ${word.synonyms.map(syn => `<span class="synonym-tag">${syn}</span>`).join('')}
                </div>
            </div>
        ` : ''}

    <div class="word-actions">
        <button class="btn btn-success" onclick="markAsLearned(${word.id})">
            ✅ O'rgandim
        </button>
        <button class="btn btn-secondary" onclick="closeWordModal()">
            Yopish
        </button>
    </div>
    `;

    document.getElementById('wordDetail').innerHTML = detailHTML;
    document.getElementById('wordModal').classList.add('active');
}

// Close word modal
function closeWordModal() {
    document.getElementById('wordModal').classList.remove('active');
}

// Toggle favorite
function toggleFavorite(wordId) {
    const isAdded = LanguageData.Progress.toggleFavorite(currentLang, wordId);

    // Show notification
    showNotification(isAdded ? 'Sevimlilarga qo\'shildi! ❤️' : 'Sevimlilardan olib tashlandi');

    // Refresh display
    applyFilters();
    updateStatistics();
}

// Mark word as learned
function markAsLearned(wordId) {
    LanguageData.Progress.addLearnedWord(currentLang, wordId);
    showNotification('O\'rganilgan so\'zlarga qo\'shildi! ✅');
    closeWordModal();
    applyFilters();
    updateStatistics();
}

// Play audio
function playAudio(text, lang) {
    LanguageData.Speech.speak(text, lang);
    showNotification('🔊 Talaffuz ijro etilmoqda...');
}

// Update statistics
async function updateStatistics() {
    const stats = await LanguageData.Progress.getStatistics(currentLang);
    document.getElementById('totalWords').textContent = stats.totalWords;
    document.getElementById('learnedWords').textContent = stats.learnedWords;
    document.getElementById('favoriteCount').textContent = stats.favorites;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
