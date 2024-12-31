// Инициализация данных из localStorage
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 10000;
let lastEnergyUpdate = localStorage.getItem('lastEnergyUpdate') 
    ? new Date(localStorage.getItem('lastEnergyUpdate')) 
    : new Date();

// Константы
const MAX_ENERGY = 10000;
const ENERGY_RECOVERY_TIME = 3600 * 1000; // 1 час в миллисекундах
const ENERGY_COST = 1;
const ENERGY_SKIP_COST = 20000;

// Элементы
const tapButton = document.getElementById('tap-button');
const tapCountDisplay = document.getElementById('tap-count');
const energyCountDisplay = document.getElementById('energy-count');
const energyTimerDisplay = document.getElementById('energy-timer');
const restoreEnergyButton = document.getElementById('restore-energy');
const errorMessage = document.getElementById('error-message');

// Для кейсов
const basicCaseButton = document.getElementById('basic-case');
const mediumCaseButton = document.getElementById('medium-case');
const premiumCaseButton = document.getElementById('premium-case');

// Обновление отображения
function updateDisplay() {
    if (tapCountDisplay) tapCountDisplay.textContent = `Тапов: ${tapCount}`;
    if (energyCountDisplay) energyCountDisplay.textContent = energy;
    if (coins !== undefined && localStorage.getItem('coins') !== null) {
        localStorage.setItem('coins', coins);
    }
    updateTimerDisplay();
    localStorage.setItem('tapCount', tapCount);
    localStorage.setItem('energy', energy);
    localStorage.setItem('lastEnergyUpdate', lastEnergyUpdate);
}

// Таймер восстановления энергии
function updateTimerDisplay() {
    const now = new Date();
    const timePassed = now - lastEnergyUpdate;
    const timeRemaining = Math.max(ENERGY_RECOVERY_TIME - timePassed, 0);

    if (timeRemaining === 0 && energy < MAX_ENERGY) {
        energy = MAX_ENERGY; // Полное восстановление
        lastEnergyUpdate = now;
        updateDisplay();
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    if (energyTimerDisplay) {
        energyTimerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Обработка кликов
if (tapButton) {
    tapButton.addEventListener('click', () => {
        if (energy > 0) {
            tapCount++;
            energy -= ENERGY_COST;
            updateDisplay();
        } else {
            alert('Недостаточно энергии! Ждите восстановления или пропустите за 20k тапов.');
        }
    });
}

// Пропуск восстановления энергии
if (restoreEnergyButton) {
    restoreEnergyButton.addEventListener('click', () => {
        if (tapCount >= ENERGY_SKIP_COST) {
            tapCount -= ENERGY_SKIP_COST;
            energy = MAX_ENERGY;
            lastEnergyUpdate = new Date();
            updateDisplay();
        } else {
            alert('Недостаточно тапов для пропуска восстановления!');
        }
    });
}

// Обработка открытия кейсов
function openCase(caseType) {
    const caseCosts = {
        basic: 10,
        medium: 100,
        premium: 1000,
    };

    const rewardRanges = {
        basic: [1, 100],
        medium: [10, 1000],
        premium: [100, 10000],
    };

    if (coins >= caseCosts[caseType]) {
        coins -= caseCosts[caseType];
        updateDisplay();

        // Перенаправление на страницу рулетки с параметром кейса
        window.location.href = `roulette.html?type=${caseType}`;
    } else {
        if (errorMessage) errorMessage.style.display = 'block';
    }
}

if (basicCaseButton) basicCaseButton.addEventListener('click', () => openCase('basic'));
if (mediumCaseButton) mediumCaseButton.addEventListener('click', () => openCase('medium'));
if (premiumCaseButton) premiumCaseButton.addEventListener('click', () => openCase('premium'));

// Генерация случайного приза для рулетки
if (window.location.pathname.includes('roulette.html')) {
    const params = new URLSearchParams(window.location.search);
    const caseType = params.get('type');

    const rewardRanges = {
        basic: [1, 100],
        medium: [10, 1000],
        premium: [100, 10000],
    };

    if (caseType && rewardRanges[caseType]) {
        const reward = Math.floor(
            Math.random() * (rewardRanges[caseType][1] - rewardRanges[caseType][0] + 1)
        ) + rewardRanges[caseType][0];

        const prizeContainer = document.getElementById('prize');
        if (prizeContainer) prizeContainer.textContent = `+${reward} тапов`;

        tapCount += reward;
        updateDisplay();
    }

    const goHomeButton = document.getElementById('go-home');
    if (goHomeButton) goHomeButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Интервал для обновления таймера
setInterval(updateTimerDisplay, 1000);

// Инициализация отображения при загрузке
updateDisplay();
