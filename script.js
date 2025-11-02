class EduQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timer = null;
        this.timeLeft = 300; // 5 minutes in seconds
        
        this.initializeEventListeners();
        this.showScreen('welcome-screen');
    }

    initializeEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('submit-btn').addEventListener('click', () => this.submitQuiz());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartQuiz());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(quizQuestions.length).fill(null);
        this.timeLeft = 300;
        
        this.showScreen('quiz-screen');
        this.loadQuestion();
        this.startTimer();
        this.updateProgress();
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
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (this.timeLeft <= 60) {
            document.getElementById('timer').style.background = '#ff4444';
        }
    }

    loadQuestion() {
        const question = quizQuestions[this.currentQuestion];
        
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = quizQuestions.length;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (this.userAnswers[this.currentQuestion] === index) {
                optionElement.classList.add('selected');
            }
            optionElement.textContent = option;
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
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        prevBtn.disabled = this.currentQuestion === 0;
        
        if (this.currentQuestion === quizQuestions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        // Enable next button only if an option is selected
        nextBtn.disabled = this.userAnswers[this.currentQuestion] === null;
        submitBtn.disabled = this.userAnswers[this.currentQuestion] === null;
    }

    nextQuestion() {
        if (this.currentQuestion < quizQuestions.length - 1) {
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
        const progress = ((this.currentQuestion + 1) / quizQuestions.length) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        document.getElementById('progress-percent').textContent = Math.round(progress);
    }

    submitQuiz() {
        clearInterval(this.timer);
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        quizQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    showResults() {
        const percentage = (this.score / quizQuestions.length) * 100;
        
        document.getElementById('score-percentage').textContent = `${Math.round(percentage)}%`;
        document.getElementById('correct-answers').textContent = this.score;
        document.getElementById('total-questions-result').textContent = quizQuestions.length;
        
        // Update score message
        const scoreMessage = document.getElementById('score-message');
        if (percentage >= 80) {
            scoreMessage.textContent = 'Excellent! You have great Java knowledge!';
            scoreMessage.style.color = '#4CAF50';
        } else if (percentage >= 60) {
            scoreMessage.textContent = 'Good job! Keep learning Java!';
            scoreMessage.style.color = '#FF9800';
        } else {
            scoreMessage.textContent = 'Keep practicing Java fundamentals!';
            scoreMessage.style.color = '#f44336';
        }
        
        // Animate progress ring
        this.animateScoreRing(percentage);
        
        // Show answers review
        this.displayAnswersReview();
        
        this.showScreen('results-screen');
    }

    animateScoreRing(percentage) {
        const circle = document.getElementById('score-ring');
        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 100);
    }

    displayAnswersReview() {
        const answersList = document.getElementById('answers-list');
        answersList.innerHTML = '';
        
        quizQuestions.forEach((question, index) => {
            const userAnswerIndex = this.userAnswers[index];
            const isCorrect = userAnswerIndex === question.correctAnswer;
            
            const answerItem = document.createElement('div');
            answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            answerItem.innerHTML = `
                <div class="answer-question">${index + 1}. ${question.question}</div>
                <div class="answer-user">Your answer: ${userAnswerIndex !== null ? question.options[userAnswerIndex] : 'Not answered'}</div>
                ${!isCorrect ? `<div class="answer-correct">Correct answer: ${question.options[question.correctAnswer]}</div>` : ''}
                <div class="answer-explanation">${question.explanation}</div>
            `;
            
            answersList.appendChild(answerItem);
        });
    }

    restartQuiz() {
        this.startQuiz();
    }

    goHome() {
        this.showScreen('welcome-screen');
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EduQuiz();
});
