import { Game } from '../../Game.js';

const { locale } = await import(`./../../../i18n/${navigator.language}.js`);

export class MenuScene extends HTMLElement {

    #template = `
        <img class="menu-scene__logo" src="./assets/logo.png" alt="logo">
        <div class="menu-scene__title">
            <div class="menu-scene__title--primary">${locale.scenes.menu.title.primary}</div>
            <div class="menu-scene__title--secondary">${locale.scenes.menu.title.secondary}</div>
        </div>
        <div class="menu-scene__buttons">
            <button class="menu-scene__button menu-scene__button--math">
                <img src="./assets/mathematics.svg" alt="math">
                <span>${locale.scenes.menu.buttons.math}</span>
            </button>
            <button class="menu-scene__button menu-scene__button--flags">
                <img src="./assets/flags.svg" alt="flags">
                <span>${locale.scenes.menu.buttons.flags}</span>
            </button>
        </div>
        <div class="menu-scene__version">${Game.VERSION}</div>
    `;

    #titleText;
    #subtitleText;

    #mathButton;
    #flagsButton;

    #versionText;

    constructor() {
        super();

        this.hide();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.classList.add('menu-scene');

        this.#titleText = this.querySelector('.menu-scene__title-primary');
        this.#subtitleText = this.querySelector('.menu-scene__title--secondary');

        this.#mathButton = this.querySelector('.menu-scene__button--math');
        this.#mathButton.addEventListener('click', this.#onMathGameButtonClick);

        this.#flagsButton = this.querySelector('.menu-scene__button--flags');
        this.#flagsButton.addEventListener('click', this.#onFlagsGameButtonClick);

        this.#versionText = this.querySelector('.menu-scene__version');
    }

    hide() {
        this.style.display = 'none';
    }

    show() {
        this.style.display = 'flex';
    }

    setVersion = ((date) => {
        this.#versionText.textContent = `${date}`;
    }).bind(this);

    #onMathGameButtonClick = (() => {
        const event = new CustomEvent('gameTypeChanged', {
            detail: {
                type: Game.TYPE_MATH
            }
        });

        this.dispatchEvent(event);
    }).bind(this);

    #onFlagsGameButtonClick = (() => {
        const event = new CustomEvent('gameTypeChanged', {
            detail: {
                type: Game.TYPE_FLAGS
            }
        });

        this.dispatchEvent(event);
    }).bind(this);
}

customElements.define('game-menu-scene', MenuScene);