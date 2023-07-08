(() => {
    const MAX_LEVEL = 50;

    const containerElement = document.querySelector('.container');

    const levelElement = document.querySelector('.level');
    const scoreElement = document.querySelector('.score');

    let level = 1;
    let score = 0;

    const generate = () => {
        const randomA = Math.ceil(Math.random() * 1000);
        const randomB = Math.ceil(Math.random() * 9) + 1;

        const rowElement = document.createElement('div');
        rowElement.innerHTML = `
        <div class="row">
            <h2 class="a">${randomA} / ${randomB} = </h2>
            <input type="number" class="result" placeholder="Type here a result">
            <button class="check">Check</button>
        </div>`;

        const resultElement = rowElement.querySelector('.result');
        const checkElement = rowElement.querySelector('.check');

        const verify = () => {
            if (resultElement.value === '') {
                resultElement.focus();
                return;
            }

            // disable everything after verifying
            resultElement.setAttribute('disabled', true);
            checkElement.setAttribute('disabled', true);

            level += 1;

            // handle correct and incorrect answers
            if (Math.floor(randomA / randomB) === Number(resultElement.value)) {
                rowElement.style.backgroundColor = '#d9ffd1';
                score += 2;
            } else {
                rowElement.style.backgroundColor = '#ffb5b5';
            }

            // handle different levels
            if (level <= MAX_LEVEL) {
                scoreElement.textContent = score;
                levelElement.textContent = level;

                generate();
            } else {
                window.print();
            }
        }

        checkElement.addEventListener('click', verify);
        resultElement.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                verify();
            }
        });

        containerElement.prepend(rowElement);

        resultElement.focus();
    };

    generate();
})();