import { Game } from '../../Game.js';

const { locale } = await import(`./../../../i18n/${navigator.language}.js`);

export class ScoreScene extends HTMLElement {
    #template = `
    <img class="score-scene__logo" src="./assets/logo.png" alt="logo">
    <div class="score-scene__title">
        <div class="score-scene__title--primary">${locale.scenes.score.title.primary}</div>
        <div class="score-scene__title--secondary">${locale.scenes.score.title.secondary}</div>
    </div>
    <div class="score-scene__counters">
        <div class="score-scene__counter">
            <div class="score-scene__label">${locale.scenes.score.main.level}</div>
            <div class="score-scene__value score-scene__level">1/${Game.MAX_LEVEL}</div>
        </div>
        <div class="score-scene__counter">
            <div class="score-scene__label">${locale.scenes.score.main.score}</div>
            <div class="score-scene__value score-scene__score">0/${Game.MAX_SCORE}</div>
        </div>  
    </div>
    <div class="score-scene__timestamps">
        <div class="score-scene__start-date-time"></div> ➡ <div class="score-scene__end-date-time"></div>  
    </div>
    <div class="score-scene__buttons">
        <button class="score-scene__button score-scene__button--restart">
            <img src="./assets/retry.svg" alt="retry">
            <span>${locale.scenes.score.buttons.again}</span>
        </button>
    </div>
    <div class="score-scene__version">${Game.VERSION}</div>
    `;

    #levelText;
    #scoreText;
    #startDateTimeText;
    #endDateTimeText;

    #againButton;

    constructor() {
        super();

        this.hide();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.classList.add('score-scene');

        this.#levelText = this.querySelector('.score-scene__level');
        this.#scoreText = this.querySelector('.score-scene__score');
        this.#startDateTimeText = this.querySelector('.score-scene__start-date-time');
        this.#endDateTimeText = this.querySelector('.score-scene__end-date-time');

        this.#againButton = this.querySelector('.score-scene__button--restart');
        this.#againButton.addEventListener('click', this.#onAgainButtonClick);
    }

    hide() {
        this.style.display = 'none';
    }

    show() {
        this.style.display = 'flex';
    }

    update({ level, score, startDateTime, endDateTime }) {
        this.#levelText.textContent = `${level}/${Game.MAX_LEVEL}`;
        this.#scoreText.textContent = `${score}/${Game.MAX_SCORE}`;
        this.#startDateTimeText.textContent = startDateTime;
        this.#endDateTimeText.textContent = endDateTime;
    }

    #onAgainButtonClick = (() => {
        const event = new CustomEvent('gameRestarted');
        this.dispatchEvent(event);
    }).bind(this);
}

customElements.define('game-score-scene', ScoreScene);