document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numberElements = document.querySelectorAll('.number');
    const themeSwitch = document.getElementById('checkbox');

    // Theme switcher event listener
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeSwitch.checked = true;
    } else {
        document.body.classList.remove('light-mode');
        themeSwitch.checked = false;
    }

    generateBtn.addEventListener('click', () => {
        generateAndDisplayNumbers();
    });

    function generateAndDisplayNumbers() {
        const lottoNumbers = new Set();
        while (lottoNumbers.size < 6) {
            lottoNumbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(lottoNumbers).sort((a, b) => a - b);

        numberElements.forEach((element, index) => {
            element.textContent = '';
            element.classList.remove('generated');
            setTimeout(() => {
                element.textContent = sortedNumbers[index];
                element.classList.add('generated');
            }, index * 200);
        });
    }
});
