let tapCount = localStorage.getItem('tapCount') ? parseInt(localStorage.getItem('tapCount')) : 0;

const tapButton = document.getElementById('tap-button');
const tapCountDisplay = document.getElementById('tap-count');

tapCountDisplay.textContent = `Taps: ${tapCount}`;

tapButton.addEventListener('click', () => {
    tapCount++;
    tapCountDisplay.textContent = `Taps: ${tapCount}`;
    localStorage.setItem('tapCount', tapCount);
});
