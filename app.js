// Quiz Categories and Questions
const quizData = {
    categories: [
        {
            id: 'general',
            name: 'General Knowledge',
            icon: 'fa-globe',
            color: '#4b6cb7'
        },
        {
            id: 'science',
            name: 'Science',
            icon: 'fa-flask',
            color: '#28a745'
        },
        {
            id: 'history',
            name: 'History',
            icon: 'fa-landmark',
            color: '#dc3545'
        },
        {
            id: 'technology',
            name: 'Technology',
            icon: 'fa-microchip',
            color: '#6f42c1'
        }
    ],
    questions: {
        general: [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            }
        ],
        science: [
            {
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "O2", "H2"],
                correct: 0
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Platinum"],
                correct: 2
            }
        ],
        history: [
            {
                question: "In which year did World War II end?",
                options: ["1943", "1944", "1945", "1946"],
                correct: 2
            },
            {
                question: "Who was the first President of the United States?",
                options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
                correct: 2
            }
        ],
        technology: [
            {
                question: "What does CPU stand for?",
                options: ["Central Processing Unit", "Computer Processing Unit", "Central Process Unit", "Computer Process Unit"],
                correct: 0
            },
            {
                question: "Which company created the iPhone?",
                options: ["Microsoft", "Samsung", "Apple", "Google"],
                correct: 2
            }
        ]
    }
};

// Game State
let gameState = {
    currentCategory: null,
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 30,
    timer: null,
    selectedOption: null
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    category: document.getElementById('category-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen'),
    leaderboard: document.getElementById('leaderboard-screen')
};

// Initialize the application
function init() {
    setupEventListeners();
    renderCategories();
    loadLeaderboard();
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('start-quiz').addEventListener('click', () => showScreen('category'));
    document.getElementById('view-leaderboard').addEventListener('click', () => showScreen('leaderboard'));
    document.getElementById('back-to-home').addEventListener('click', () => showScreen('welcome'));
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('share-score').addEventListener('click', shareScore);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
}

// Screen Management
function showScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenId].classList.add('active');
}

// Category Management
function renderCategories() {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = quizData.categories.map(category => `
        <div class="col-md-6 mb-3">
            <div class="category-card card" onclick="selectCategory('${category.id}')" style="background: ${category.color}">
                <div class="card-body text-center text-white">
                    <i class="fas ${category.icon} fa-3x mb-3"></i>
                    <h3>${category.name}</h3>
                </div>
            </div>
        </div>
    `).join('');
}

function selectCategory(categoryId) {
    gameState.currentCategory = categoryId;
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    showScreen('quiz');
    loadQuestion();
}

// Question Management
function loadQuestion() {
    const questions = quizData.questions[gameState.currentCategory];
    const question = questions[gameState.currentQuestionIndex];
    
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <button class="option-btn" onclick="selectOption(${index})">${option}</button>
    `).join('');
    
    // Update progress bar
    const progress = ((gameState.currentQuestionIndex + 1) / questions.length) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    
    // Reset timer
    resetTimer();
}

function selectOption(optionIndex) {
    if (gameState.selectedOption !== null) return;
    
    gameState.selectedOption = optionIndex;
    const questions = quizData.questions[gameState.currentCategory];
    const question = questions[gameState.currentQuestionIndex];
    
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((button, index) => {
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === optionIndex && index !== question.correct) {
            button.classList.add('incorrect');
        }
    });
    
    if (optionIndex === question.correct) {
        gameState.score += 10;
    }
    
    document.getElementById('next-question').disabled = false;
    clearInterval(gameState.timer);
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    gameState.selectedOption = null;
    document.getElementById('next-question').disabled = true;
    
    const questions = quizData.questions[gameState.currentCategory];
    if (gameState.currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Timer Management
function resetTimer() {
    gameState.timeLeft = 30;
    clearInterval(gameState.timer);
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            nextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = `Time: ${gameState.timeLeft}s`;
}

// Results Management
function showResults() {
    showScreen('results');
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('correct-answers').textContent = Math.floor(gameState.score / 10);
    document.getElementById('time-taken').textContent = 30 - gameState.timeLeft;
    
    saveToLeaderboard();
}

function resetGame() {
    gameState = {
        currentCategory: null,
        currentQuestionIndex: 0,
        score: 0,
        timeLeft: 30,
        timer: null,
        selectedOption: null
    };
    showScreen('welcome');
}

// Leaderboard Management
function saveToLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const entry = {
        player: 'Player ' + Math.floor(Math.random() * 1000),
        score: gameState.score,
        category: quizData.categories.find(c => c.id === gameState.currentCategory).name,
        date: new Date().toLocaleDateString()
    };
    
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    loadLeaderboard();
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const tbody = document.getElementById('leaderboard-body');
    
    tbody.innerHTML = leaderboard.map((entry, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${entry.player}</td>
            <td>${entry.score}</td>
            <td>${entry.category}</td>
            <td>${entry.date}</td>
        </tr>
    `).join('');
}

// Share Score
function shareScore() {
    const text = `I scored ${gameState.score} points in the ${quizData.categories.find(c => c.id === gameState.currentCategory).name} category on Quiz Master! Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Master Score',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text);
        alert('Score copied to clipboard!');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 