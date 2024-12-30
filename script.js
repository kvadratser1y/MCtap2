// Получаем количество монет и тапов из localStorage
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;

// Обработчики для кнопок кейсов
const basicCaseButton = document.getElementById('basic-case');
const mediumCaseButton = document.getElementById('medium-case');
const premiumCaseButton = document.getElementById('premium-case');
const errorMessage = document.getElementById('error-message');
const tapCountDisplay = document.getElementById('tap-count');

// Отображаем количество тапов
if (tapCountDisplay) {
    tapCountDisplay.textContent = `Тапов: ${tapCount}`;
}

// Обновляем localStorage для монет и тапов
function updateLocalStorage() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('tapCount', tapCount);
}

// Функция открытия кейса
function openCase(type) {
    let cost = 0;
    let rewardRange = [0, 0];

    if (type === 'basic') {
        cost = 10;
        rewardRange = [1, 100]; // от 1 до 100
    } else if (type === 'medium') {
        cost = 100;
        rewardRange = [10, 1000]; // от 10 до 1000
    } else if (type === 'premium') {
        cost = 1000;
        rewardRange = [100, 10000]; // от 100 до 10000
    }

    // Проверка на наличие монет
    if (coins >= cost) {
        coins -= cost;
        updateLocalStorage(); // Обновляем localStorage
        // Генерация случайного приза
        const prize = generatePrize(rewardRange);
        // Переход на страницу с рулеткой
        window.location.href = `roulette.html?prize=${prize}`;
    } else {
        errorMessage.style.display = 'block'; // Показываем сообщение о недостатке монет
    }
}

// Генерация случайного приза в зависимости от диапазона
function generatePrize(rewardRange) {
    return Math.floor(Math.random() * (rewardRange[1] - rewardRange[0] + 1)) + rewardRange[0];
}

// Обработчик для кнопок на главной странице
if (basicCaseButton) {
    basicCaseButton.addEventListener('click', () => openCase('basic'));
}
if (mediumCaseButton) {
    mediumCaseButton.addEventListener('click', () => openCase('medium'));
}
if (premiumCaseButton) {
    premiumCaseButton.addEventListener('click', () => openCase('premium'));
}

// Страница рулетки
if (window.location.pathname.includes('roulette.html')) {
    const params = new URLSearchParams(window.location.search);
    const prize = params.get('prize');
    
    const prizeContainer = document.getElementById('prize');
    prizeContainer.textContent = `+${prize} тапов`;

    // Обновляем количество тапов в localStorage
    tapCount += parseInt(prize);
    updateLocalStorage();

    const goHomeButton = document.getElementById('go-home');
    goHomeButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Переход на главную страницу
    });
}
