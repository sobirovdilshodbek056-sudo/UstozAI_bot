// UstozAI - Main JavaScript
// Global app state and utilities

// App State
const AppState = {
    user: null,
    subscription: null,
    chatHistory: [],
    testResults: [],
    
    // Load state from localStorage
    load() {
        try {
            const savedUser = localStorage.getItem('ustozai_user');
            const savedChatHistory = localStorage.getItem('ustozai_chat');
            const savedTestResults = localStorage.getItem('ustozai_tests');
            const savedSubscription = localStorage.getItem('ustozai_subscription');
            
            if (savedUser) this.user = JSON.parse(savedUser);
            if (savedChatHistory) this.chatHistory = JSON.parse(savedChatHistory);
            if (savedTestResults) this.testResults = JSON.parse(savedTestResults);
            if (savedSubscription) this.subscription = JSON.parse(savedSubscription);
        } catch (error) {
            console.error('Error loading state:', error);
        }
    },
    
    // Save state to localStorage
    save() {
        try {
            if (this.user) localStorage.setItem('ustozai_user', JSON.stringify(this.user));
            if (this.chatHistory.length) localStorage.setItem('ustozai_chat', JSON.stringify(this.chatHistory));
            if (this.testResults.length) localStorage.setItem('ustozai_tests', JSON.stringify(this.testResults));
            if (this.subscription) localStorage.setItem('ustozai_subscription', JSON.stringify(this.subscription));
        } catch (error) {
            console.error('Error saving state:', error);
        }
    },
    
    // User authentication
    login(email, password) {
        // Mock authentication
        this.user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            grade: '9-sinf',
            joinDate: new Date().toISOString()
        };
        this.save();
        return true;
    },
    
    signup(name, email, password, grade) {
        // Mock signup
        this.user = {
            id: Date.now(),
            name: name,
            email: email,
            grade: grade,
            joinDate: new Date().toISOString()
        };
        this.subscription = {
            type: 'free_trial',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        this.save();
        return true;
    },
    
    logout() {
        this.user = null;
        this.subscription = null;
        this.chatHistory = [];
        this.testResults = [];
        localStorage.clear();
    },
    
    isLoggedIn() {
        return this.user !== null;
    }
};

// Initialize app state
AppState.load();

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Check authentication for protected pages
    checkAuth();
});

// Check authentication
function checkAuth() {
    const protectedPages = ['dashboard.html', 'chat.html', 'tests.html', 'test-taking.html', 'results.html', 'parent-dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !AppState.isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('uz-UZ', options);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Export for use in other files
window.AppState = AppState;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatTime = formatTime;
