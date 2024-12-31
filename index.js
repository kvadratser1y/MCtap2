// Инициализация значений из localStorage
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;
let energy = localStorage.getItem('energy') ? parseInt(localStorage.getItem('energy')) : 10000;
let lastEnergyUpdate = localStorage.getItem('lastEnergyUpdate') 
    ? new Date(localStorage.getItem('lastEnergyUpdate')) 
    : new Date();

// Константы
const MAX_ENERGY = 10000;
const ENERGY_RECOVERY_TIME = 3600 * 1000; // 1 час в миллисекундах
const ENERGY_COST = 1;
const ENERGY_SKIP_COST = 20000;

// Элементы для отображения
const tapButton = document.getElementById('tap-button');
const tapCountDisplay = document.getElementById('tap-count');
const energyCountDisplay = document.getElementById('energy-count');
const energyTimerDisplay = document.getElementById('energy-timer');
const restoreEnergyButton = document.getElementById('restore-energy');
const basicCaseButton = document.getElementById('basic-case');
const mediumCaseButton = document.getElementById('medium-case');
const premiumCaseButton = document.getElementById('premium-case');
const errorMessage = document.getElementById('error-message');
const coinsDisplay = document.getElementById('coins-count');

// Отображаем количество монет и тапов
if (tapCountDisplay) {
    tapCountDisplay.textContent = `Тапов: ${tapCount}`;
}
if (coinsDisplay) {
    coinsDisplay.textContent = `Монеты: ${coins}`;
}
if (energyCountDisplay) {
    energyCountDisplay.textContent = `Энергия: ${energy}`;
}

// Обновляем localStorage
function updateLocalStorage() {
    localStorage.setItem('coins', coins);
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
        energy = MAX_ENERGY; // Полное восстановление энергии
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

// Обновление отображения
function updateDisplay() {
    tapCountDisplay.textContent = `Тапов: ${tapCount}`;
    energyCountDisplay.textContent = `Энергия: ${energy}`;
    updateTimerDisplay();
    coinsDisplay.textContent = `Монеты: ${coins}`;
    updateLocalStorage();
}

// Обработка кликов на кнопку тапов
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

// Обработчики для кнопок кейсов
basicCaseButton.addEventListener('click', () => {
    if (coins >= 10 && tapCount >= 10) {
        coins -= 10;  // Стоимость кейса
        tapCount -= 10;  // Стоимость открытия кейса
        updateLocalStorage();
        openCase('basic');
    } else {
        errorMessage.style.display = 'block'; // Показываем ошибку
        errorMessage.textContent = 'Недостаточно монет или тапов для открытия кейса!';
    }
});

mediumCaseButton.addEventListener('click', () => {
    if (coins >= 100 && tapCount >= 100) {
        coins -= 100;
        tapCount -= 100;
        updateLocalStorage();
        openCase('medium');
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Недостаточно монет или тапов для открытия кейса!';
    }
});

premiumCaseButton.addEventListener('click', () => {
    if (coins >= 1000 && tapCount >= 1000) {
        coins -= 1000;
        tapCount -= 1000;
        updateLocalStorage();
        openCase('premium');
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Недостаточно монет или тапов для открытия кейса!';
    }
});

// Функция для открытия кейса и генерации случайного приза
function openCase(caseType) {
    let rewardRange = [0, 0];

    if (caseType === 'basic') {
        rewardRange = [1, 100]; // от 1 до 100 тапов
    } else if (caseType === 'medium') {
        rewardRange = [10, 1000]; // от 10 до 1000 тапов
    } else if (caseType === 'premium') {
        rewardRange = [100, 10000]; // от 100 до 10000 тапов
    }

    // Генерация случайного приза
    const prize = generatePrize(rewardRange);

    // Обновляем количество тапов в localStorage
    tapCount += prize;
    updateLocalStorage();

    // Показываем приз на экране
    alert(`Поздравляем! Вы выиграли: +${prize} тапов`);
}

// Генерация случайного числа в заданном диапазоне
function generatePrize(rewardRange) {
    return Math.floor(Math.random() * (rewardRange[1] - rewardRange[0] + 1)) + rewardRange[0];
}

// Интервал для обновления таймера
setInterval(updateTimerDisplay, 1000);

// Инициализация отображения при загрузке
updateDisplay();
