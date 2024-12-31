// Загрузка данных из localStorage
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
const basicCaseButton = document.getElementById('basic-case');
const mediumCaseButton = document.getElementById('medium-case');
const premiumCaseButton = document.getElementById('premium-case');
const errorMessage = document.getElementById('error-message');

// Отображение данных
function updateDisplay() {
    tapCountDisplay.textContent = `Тапов: ${tapCount}`;
    energyCountDisplay.textContent = `Энергия: ${energy}`;
    updateTimerDisplay();
    localStorage.setItem('tapCount', tapCount);
    localStorage.setItem('coins', coins);
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

    energyTimerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Генерация случайного приза
function generatePrize(rewardRange) {
    return Math.floor(Math.random() * (rewardRange[1] - rewardRange[0] + 1)) + rewardRange[0];
}

// Обработка нажатия на кнопку кейса
function handleCaseOpening(caseType) {
    let cost = 0;
    let rewardRange = [0, 0];

    if (caseType === 'basic') {
        cost = 10;
        rewardRange = [1, 100]; // от 1 до 100
    } else if (caseType === 'medium') {
        cost = 100;
        rewardRange = [10, 1000]; // от 10 до 1000
    } else if (caseType === 'premium') {
        cost = 1000;
        rewardRange = [100, 10000]; // от 100 до 10000
    }

    if (coins >= cost) {
        coins -= cost;
        updateDisplay(); // Обновляем данные
        const prize = generatePrize(rewardRange);
        tapCount += prize;
        alert(`Поздравляем! Вы выиграли: +${prize} тапов!`);
    } else {
        errorMessage.style.display = 'block'; // Показываем ошибку
    }
}

// Обработчик кликов на кейс
basicCaseButton.addEventListener('click', () => handleCaseOpening('basic'));
mediumCaseButton.addEventListener('click', () => handleCaseOpening('medium'));
premiumCaseButton.addEventListener('click', () => handleCaseOpening('premium'));

// Обработка кликов по тапам
tapButton.addEventListener('click', () => {
    if (energy > 0) {
        tapCount++;
        energy -= ENERGY_COST;
        updateDisplay();
    } else {
        alert('Недостаточно энергии! Ждите восстановления или пропустите за 20k тапов.');
    }
});

// Пропуск восстановления энергии
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

// Интервал для обновления таймера
setInterval(updateTimerDisplay, 1000);

// Инициализация отображения при загрузке
updateDisplay();
