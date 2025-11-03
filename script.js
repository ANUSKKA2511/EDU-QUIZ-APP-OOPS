class EduQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timer = null;
        this.timeLeft = 300;
        this.currentSubject = null;
        
        this.initializeEventListeners();
        this.initializeSubjectCards();
        this.showScreen('welcome-screen');
        this.checkWebsiteVersion();
    }

    initializeEventListeners() {
        // Quiz navigation
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('submit-btn').addEventListener('click', () => this.submitQuiz());
        
        // Results actions
        document.getElementById('restart-btn').addEventListener('click', () => this.restartQuiz());
        document.getElementById('new-subject-btn').addEventListener('click', () => this.showSubjectSelection());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    }

    initializeSubjectCards() {
        document.querySelectorAll('.subject-card').forEach(card => {
            const button = card.querySelector('.card-button');
            const subject = card.dataset.subject;
            
            // Add click event to the entire card AND the button
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on the button itself (to avoid double trigger)
                if (!e.target.closest('.card-button')) {
                    this.selectSubject(subject);
                }
            });
            
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent double trigger
                this.selectSubject(subject);
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                if (this.currentSubject !== subject) {
                    card.style.transform = 'translateY(-10px)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (this.currentSubject !== subject) {
                    card.style.transform = 'translateY(0)';
                }
            });
        });
    }

    selectSubject(subject) {
        console.log('Subject selected:', subject); // Debug log
        
        this.currentSubject = subject;
        
        // Visual feedback - highlight selected card
        document.querySelectorAll('.subject-card').forEach(card => {
            card.classList.remove('active');
            card.style.transform = 'translateY(0)';
            card.style.borderColor = '#e0e0e0';
        });
        
        const selectedCard = document.querySelector(`[data-subject="${subject}"]`);
        selectedCard.classList.add('active');
        selectedCard.style.transform = 'translateY(-10px)';
        selectedCard.style.borderColor = '#667eea';
        
        // Add loading animation to button
        const button = selectedCard.querySelector('.card-button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        
        // Start quiz after a brief delay for visual feedback
        setTimeout(() => {
            this.startQuiz();
        }, 800);
    }

    showSubjectSelection() {
        this.showScreen('welcome-screen');
        // Reset subject selection
        document.querySelectorAll('.subject-card').forEach(card => {
            card.classList.remove('active');
            card.style.transform = 'translateY(0)';
            card.style.borderColor = '#e0e0e0';
        });
        this.currentSubject = null;
    }

    startQuiz() {
        if (!this.currentSubject) {
            console.error('No subject selected!');
            return;
        }
        
        console.log('Starting quiz for subject:', this.currentSubject); // Debug log
        
        this.currentQuestion = 0;
        this.score = 0;
        const questions = this.getCurrentQuestions();
        this.userAnswers = new Array(questions.length).fill(null);
        this.timeLeft = 300;
        
        this.showScreen('quiz-screen');
        this.updateSubjectDisplay();
        this.loadQuestion();
        this.startTimer();
        this.updateProgress();
    }

    getCurrentQuestions() {
        return quizSubjects[this.currentSubject].questions;
    }

    updateSubjectDisplay() {
        const subject = quizSubjects[this.currentSubject];
        document.getElementById('current-subject').textContent = subject.name;
        
        // Update results screen subject
        document.getElementById('results-subject').textContent = subject.name;
        document.getElementById('results-subject-name').textContent = subject.name;
    }

    startTimer() {
        this.updateTimerDisplay();
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when time is running out
            if (this.timeLeft <= 60) {
                timerElement.style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
            } else if (this.timeLeft <= 120) {
                timerElement.style.background = 'linear-gradient(135deg, #ffa502, #ffb142)';
            } else {
                timerElement.style.background = 'linear-gradient(135deg, #2ed573, #7bed9f)';
            }
        }
    }

    loadQuestion() {
        const questions = this.getCurrentQuestions();
        const question = questions[this.currentQuestion];
        
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = questions.length;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (this.userAnswers[this.currentQuestion] === index) {
                optionElement.classList.add('selected');
            }
            optionElement.innerHTML = `
                <span class="option-number">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            `;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        this.updateNavigationButtons();
        this.updateProgress();
    }

    selectOption(optionIndex) {
        this.userAnswers[this.currentQuestion] = optionIndex;
        
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.remove('selected');
            if (index === optionIndex) {
                option.classList.add('selected');
            }
        });
        
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const questions = this.getCurrentQuestions();
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        
        if (this.currentQuestion === questions.length - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'flex';
        } else {
            if (nextBtn) nextBtn.style.display = 'flex';
            if (submitBtn) submitBtn.style.display = 'none';
        }
        
        // Enable next button only if an option is selected
        const isOptionSelected = this.userAnswers[this.currentQuestion] !== null;
        if (nextBtn) nextBtn.disabled = !isOptionSelected;
        if (submitBtn) submitBtn.disabled = !isOptionSelected;
    }

    nextQuestion() {
        const questions = this.getCurrentQuestions();
        if (this.currentQuestion < questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
        }
    }

    updateProgress() {
        const questions = this.getCurrentQuestions();
        const progress = ((this.currentQuestion + 1) / questions.length) * 100;
        const progressElement = document.getElementById('progress');
        const progressPercent = document.getElementById('progress-percent');
        
        if (progressElement) progressElement.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = Math.round(progress);
    }

    submitQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        const questions = this.getCurrentQuestions();
        this.score = 0;
        questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    showResults() {
        const questions = this.getCurrentQuestions();
        const percentage = (this.score / questions.length) * 100;
        
        document.getElementById('score-percentage').textContent = `${Math.round(percentage)}%`;
        document.getElementById('correct-answers').textContent = this.score;
        document.getElementById('total-questions-result').textContent = questions.length;
        
        const scoreMessage = document.getElementById('score-message');
        if (percentage >= 90) {
            scoreMessage.textContent = 'Outstanding! You\'re an expert! 🎉';
            scoreMessage.style.color = '#4CAF50';
        } else if (percentage >= 80) {
            scoreMessage.textContent = 'Excellent! Great job! 👏';
            scoreMessage.style.color = '#4CAF50';
        } else if (percentage >= 70) {
            scoreMessage.textContent = 'Good work! Keep it up! 👍';
            scoreMessage.style.color = '#FF9800';
        } else if (percentage >= 60) {
            scoreMessage.textContent = 'Not bad! Practice makes perfect! 💪';
            scoreMessage.style.color = '#FF9800';
        } else {
            scoreMessage.textContent = 'Keep practicing! You\'ll get better! 📚';
            scoreMessage.style.color = '#f44336';
        }
        
        this.animateScoreRing(percentage);
        this.displayAnswersReview();
        this.showScreen('results-screen');
    }

    animateScoreRing(percentage) {
        const circle = document.getElementById('score-ring');
        if (!circle) return;
        
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
            circle.style.strokeDashoffset = offset;
        }, 300);
    }

    displayAnswersReview() {
        const questions = this.getCurrentQuestions();
        const answersList = document.getElementById('answers-list');
        if (!answersList) return;
        
        answersList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const userAnswerIndex = this.userAnswers[index];
            const isCorrect = userAnswerIndex === question.correctAnswer;
            const userAnswer = userAnswerIndex !== null ? question.options[userAnswerIndex] : 'Not answered';
            const correctAnswer = question.options[question.correctAnswer];
            
            const answerItem = document.createElement('div');
            answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            answerItem.innerHTML = `
                <div class="answer-header">
                    <span class="answer-number">${index + 1}</span>
                    <span class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                </div>
                <div class="answer-question">${question.question}</div>
                <div class="answer-details">
                    <div class="answer-user">
                        <strong>Your answer:</strong> ${userAnswer}
                    </div>
                    ${!isCorrect ? `
                    <div class="answer-correct">
                        <strong>Correct answer:</strong> ${correctAnswer}
                    </div>
                    ` : ''}
                </div>
                <div class="answer-explanation">
                    <i class="fas fa-lightbulb"></i>
                    ${question.explanation}
                </div>
            `;
            
            answersList.appendChild(answerItem);
        });
    }

    restartQuiz() {
        this.startQuiz();
    }

    goHome() {
        this.showSubjectSelection();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    checkWebsiteVersion() {
        const version = '2.2';
        console.log(`%c🎓 EduQuiz v${version} - Fixed Click Issues`, 'color: #667eea; font-size: 16px; font-weight: bold;');
    }
}

// Add CSS for the new elements
const style = document.createElement('style');
style.textContent = `
    .subject-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .subject-card.active {
        border: 2px solid #667eea !important;
    }
    
    .card-button {
        cursor: pointer;
    }
    
    .option {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: white;
        font-weight: 500;
    }
    
    .option:hover {
        border-color: #667eea;
        background: #f8f9ff;
        transform: translateX(5px);
    }
    
    .option.selected {
        border-color: #667eea;
        background: #667eea;
        color: white;
        transform: translateX(10px);
    }
    
    .option-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #666;
        transition: all 0.3s ease;
    }
    
    .option.selected .option-number {
        background: white;
        color: #667eea;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .answer-item {
        padding: 25px;
        border-radius: 15px;
        background: #f8f9fa;
        border-left: 4px solid #e0e0e0;
        margin-bottom: 20px;
    }
    
    .answer-item.correct {
        border-left-color: #4CAF50;
        background: linear-gradient(135deg, #f1f8e9, #e8f5e8);
    }
    
    .answer-item.incorrect {
        border-left-color: #f44336;
        background: linear-gradient(135deg, #ffebee, #fce4ec);
    }
    
    .answer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .answer-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #667eea;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .answer-status {
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .answer-status.correct {
        background: #4CAF50;
        color: white;
    }
    
    .answer-status.incorrect {
        background: #f44336;
        color: white;
    }
`;

document.head.appendChild(style);

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EduQuiz();
});

// Add debug helper
console.log('🚀 EduQuiz initialized - Click any subject card to start!');
