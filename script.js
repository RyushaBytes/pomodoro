class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60;
        this.totalTime = 25 * 60;
        this.isRunning = false;
        this.isBreak = false;
        this.interval = null;
        
        this.elements = {
            time: document.getElementById('time'),
            status: document.getElementById('status'),
            startPause: document.getElementById('start-pause'),
            reset: document.getElementById('reset'),
            modeBtns: document.querySelectorAll('.mode-btn'),
            timerCircle: document.querySelector('.timer-circle'),
            progressBar: document.getElementById('progress-bar')
        };
        
        this.init();
    }
    
    init() {
        this.elements.startPause.addEventListener('click', () => this.toggleTimer());
        this.elements.reset.addEventListener('click', () => this.resetTimer());
        
        // Клик по кругу = старт/пауза
        this.elements.timerCircle.addEventListener('click', () => this.toggleTimer());
        
        this.elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target));
        });
        
        this.updateProgress();
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.isRunning = true;
        this.elements.startPause.textContent = 'PAUSE';
        this.elements.status.textContent = this.isBreak ? 'Break time! ☕' : 'Stay focused! 🚀';
        
        // Добавляем правильную анимацию пульсации
        this.elements.timerCircle.classList.remove('running', 'break-running');
        if (this.isBreak) {
            this.elements.timerCircle.classList.add('break-running');
        } else {
            this.elements.timerCircle.classList.add('running');
        }
        
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft === 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.elements.startPause.textContent = 'START';
        this.elements.status.textContent = 'Paused';
        
        // Убираем ВСЕ анимации пульсации
        this.elements.timerCircle.classList.remove('running', 'break-running');
        
        clearInterval(this.interval);
    }
    
    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.elements.status.textContent = 'Ready to focus';
    }
    
    switchMode(button) {
        const minutes = parseInt(button.dataset.minutes);
        this.totalTime = minutes * 60;
        this.timeLeft = this.totalTime;
        this.isBreak = minutes === 5;
        
        // Обновляем активную кнопку режима
        this.elements.modeBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Меняем режим - убираем ВСЕ анимации и добавляем только класс режима
        this.elements.timerCircle.classList.remove('running', 'break-running', 'break-mode');
        if (this.isBreak) {
            this.elements.timerCircle.classList.add('break-mode');
        }
        
        this.resetTimer();
        this.elements.status.textContent = this.isBreak ? 'Break mode' : 'Focus mode';
    }
    
    completeSession() {
        this.pauseTimer();
        
        // Анимация завершения
        this.elements.timerCircle.classList.add('timer-complete');
        setTimeout(() => {
            this.elements.timerCircle.classList.remove('timer-complete');
        }, 500);
        
        if (this.isBreak) {
            this.elements.status.textContent = 'Break finished! 🎉';
            setTimeout(() => {
                this.switchMode(document.querySelector('.mode-btn[data-minutes="25"]'));
            }, 2000);
        } else {
            this.elements.status.textContent = 'Session complete! 🎉';
            setTimeout(() => {
                this.switchMode(document.querySelector('.mode-btn[data-minutes="5"]'));
            }, 2000);
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.elements.time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.updateProgress();
    }
    
    updateProgress() {
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.elements.progressBar.style.width = progress + '%';
    }
}

// Запускаем таймер
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});