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

// Страница рулетки
if (window.location.pathname.includes('roulette.html')) {
    const params = new URLSearchParams(window.location.search);
    const caseType = params.get('type');
    
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

    // Проверка на наличие монет
    if (coins >= cost) {
        coins -= cost;
        updateLocalStorage(); // Обновляем localStorage
        // Генерация случайного приза
        const prize = generatePrize(rewardRange);
        // Отображаем приз
        const prizeContainer = document.getElementById('prize');
        prizeContainer.textContent = `+${prize} тапов`;

        // Обновляем количество тапов в localStorage
        tapCount += parseInt(prize);
        updateLocalStorage();
    } else {
        errorMessage.style.display = 'block'; // Показываем сообщение о недостатке монет
    }

    const goHomeButton = document.getElementById('go-home');
    goHomeButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Переход на главную страницу
    });
}

// Генерация случайного приза в зависимости от диапазона
function generatePrize(rewardRange) {
    return Math.floor(Math.random() * (rewardRange[1] - rewardRange[0] + 1)) + rewardRange[0];
}
