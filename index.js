        let tapCount = 0;

        const tapButton = document.getElementById('tap-button');
        const tapCountDisplay = document.getElementById('tap-count');

        tapButton.addEventListener('click', () => {
            tapCount++;
            tapCountDisplay.textContent = `Taps: ${tapCount}`;
        });

        // Disable zooming on double-tap
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
