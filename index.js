// Начальные данные
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

// Элементы
const tapButton = document.getElementById('tap-button');
const tapCountDisplay = document.getElementById('tap-count');
const energyCountDisplay = document.getElementById('energy-count');
const energyTimerDisplay = document.getElementById('energy-timer');
const restoreEnergyButton = document.getElementById('restore-energy');

// Обновление отображения
function updateDisplay() {
    tapCountDisplay.textContent = `Тапов: ${tapCount}`;
    energyCountDisplay.textContent = energy;
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

    energyTimerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Обработка кликов
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
