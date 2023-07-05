(() => {
    const containerElement = document.querySelector('.container');

    const levelElement = document.querySelector('.level');
    const scoreElement = document.querySelector('.score');

    let level = 1;
    let score = 0;

    const generate = () => {
        const randomA = Math.ceil(Math.random() * 10);
        const randomB = Math.ceil(Math.random() * 10);

        const row = document.createElement('div');
        row.innerHTML = `
        <div class="row">
            <h2 class="a">${randomA} * ${randomB} = </h2>
            <input type="number" class="result" placeholder="Type here a result">
            <button class="check">Check</button>
        </div>`;

        const result = row.querySelector('.result');
        const check = row.querySelector('.check');

        check.addEventListener('click', () => {
            result.setAttribute('disabled', true);
            level += 1;

            if (randomA * randomB === Number(result.value)) {
                row.style.backgroundColor = '#d9ffd1';
                score += 1;
            } else {
                row.style.backgroundColor = '#ffb5b5';
            }

            if (level <= 100) {
                scoreElement.textContent = score;
                levelElement.textContent = level;

                generate();
            } else {
                window.print();
            }
        });

        containerElement.prepend(row);
    };

    generate();
})();