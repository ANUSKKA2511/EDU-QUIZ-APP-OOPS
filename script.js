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
            
            button.addEventListener('click', () => {
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
        this.currentSubject = subject;
        
        // Visual feedback - highlight selected card
        document.querySelectorAll('.subject-card').forEach(card => {
            card.classList.remove('active');
            card.style.transform = 'translateY(0)';
        });
        
        const selectedCard = document.querySelector(`[data-subject="${subject}"]`);
        selectedCard.classList.add('active');
        selectedCard.style.transform = 'translateY(-10px)';
        
        // Add loading animation to button
        const button = selectedCard.querySelector('.card-button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;
        
        // Start quiz after a brief delay for visual feedback
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.startQuiz();
        }, 1000);
    }

    showSubjectSelection() {
        this.showScreen('welcome-screen');
        // Reset subject selection
        document.querySelectorAll('.subject-card').forEach(card => {
            card.classList.remove('active');
            card.style.transform = 'translateY(0)';
        });
        this.currentSubject = null;
    }

    startQuiz() {
        if (!this.currentSubject) return;
        
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(this.getCurrentQuestions().length).fill(null);
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
        timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (this.timeLeft <= 60) {
            timerElement.style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
            timerElement.style.animation = 'pulse 1s infinite';
        } else if (this.timeLeft <= 120) {
            timerElement.style.background = 'linear-gradient(135deg, #ffa502, #ffb142)';
        } else {
            timerElement.style.background = 'linear-gradient(135deg, #2ed573, #7bed9f)';
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
        
        prevBtn.disabled = this.currentQuestion === 0;
        
        if (this.currentQuestion === questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
        
        // Enable next button only if an option is selected
        const isOptionSelected = this.userAnswers[this.currentQuestion] !== null;
        nextBtn.disabled = !isOptionSelected;
        submitBtn.disabled = !isOptionSelected;
    }

    nextQuestion() {
        const questions = this.getCurrentQuestions();
        if (this.currentQuestion < questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
            
            // Add slide animation
            this.animateQuestionTransition('next');
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
            
            // Add slide animation
            this.animateQuestionTransition('previous');
        }
    }

    animateQuestionTransition(direction) {
        const questionContainer = document.querySelector('.question-container');
        questionContainer.style.opacity = '0';
        questionContainer.style.transform = direction === 'next' ? 'translateX(50px)' : 'translateX(-50px)';
        
        setTimeout(() => {
            questionContainer.style.opacity = '1';
            questionContainer.style.transform = 'translateX(0)';
            questionContainer.style.transition = 'all 0.3s ease';
        }, 50);
    }

    updateProgress() {
        const questions = this.getCurrentQuestions();
        const progress = ((this.currentQuestion + 1) / questions.length) * 100;
        const progressElement = document.getElementById('progress');
        const progressPercent = document.getElementById('progress-percent');
        
        progressElement.style.width = `${progress}%`;
        progressPercent.textContent = Math.round(progress);
    }

    submitQuiz() {
        clearInterval(this.timer);
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
        
        // Add confetti for excellent scores
        if (percentage >= 80) {
            this.createConfetti();
        }
    }

    animateScoreRing(percentage) {
        const circle = document.getElementById('score-ring');
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

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }

    restartQuiz() {
        // Add loading state
        const restartBtn = document.getElementById('restart-btn');
        const originalText = restartBtn.innerHTML;
        restartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Restarting...';
        restartBtn.disabled = true;
        
        setTimeout(() => {
            restartBtn.innerHTML = originalText;
            restartBtn.disabled = false;
            this.startQuiz();
        }, 800);
    }

    goHome() {
        // Add transition effect
        const resultsScreen = document.getElementById('results-screen');
        resultsScreen.style.opacity = '0';
        resultsScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.showSubjectSelection();
            resultsScreen.style.opacity = '1';
            resultsScreen.style.transform = 'scale(1)';
        }, 300);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        targetScreen.classList.add('active');
        
        // Add fade-in effect
        targetScreen.style.opacity = '0';
        targetScreen.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetScreen.style.opacity = '1';
            targetScreen.style.transform = 'translateY(0)';
            targetScreen.style.transition = 'all 0.5s ease';
        }, 50);
    }

    checkWebsiteVersion() {
        const version = '2.1';
        const features = [
            '🎯 Multi-Subject Quizzes',
            '🎨 Modern Design',
            '📱 Fully Responsive',
            '⚡ Interactive Animations',
            '🏆 Achievement System'
        ];
        
        console.log(`%c🎓 EduQuiz v${version}`, 'color: #667eea; font-size: 16px; font-weight: bold;');
        console.log(`%c✨ Features: ${features.join(' • ')}`, 'color: #764ba2; font-size: 12px;');
        console.log(`%c🕒 Loaded: ${new Date().toLocaleString()}`, 'color: #666; font-size: 11px;');
        
        // Add version badge to page (hidden by default)
        const versionBadge = document.createElement('div');
        versionBadge.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            z-index: 1000;
            opacity: 0.7;
            transition: opacity 0.3s;
        `;
        versionBadge.textContent = `v${version}`;
        versionBadge.title = `EduQuiz ${version}\n${features.join('\n')}`;
        
        versionBadge.addEventListener('mouseenter', () => {
            versionBadge.style.opacity = '1';
        });
        
        versionBadge.addEventListener('mouseleave', () => {
            versionBadge.style.opacity = '0.7';
        });
        
        document.body.appendChild(versionBadge);
    }
}

// Add confetti animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .confetti {
        position: fixed;
        top: -10px;
        border-radius: 2px;
        animation: confettiFall 3s linear forwards;
        z-index: 9999;
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
    
    .option-text {
        flex: 1;
    }
    
    .answer-item {
        padding: 25px;
        border-radius: 15px;
        background: #f8f9fa;
        border-left: 4px solid #e0e0e0;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    }
    
    .answer-item:hover {
        transform: translateX(5px);
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
    
    .answer-question {
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
        line-height: 1.5;
    }
    
    .answer-details {
        margin-bottom: 15px;
    }
    
    .answer-user, .answer-correct {
        margin-bottom: 8px;
        line-height: 1.4;
    }
    
    .answer-explanation {
        background: rgba(255, 255, 255, 0.7);
        padding: 15px;
        border-radius: 10px;
        font-style: italic;
        color: #666;
        border-left: 3px solid #667eea;
    }
    
    .answer-explanation i {
        color: #667eea;
        margin-right: 8px;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EduQuiz();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
