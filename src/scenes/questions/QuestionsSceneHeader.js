import { Game } from '../../Game.js';

const { locale } = await import(`./../../../i18n/${navigator.language}.js`);

export class QuestionsSceneHeader extends HTMLElement {
    #template = `
    <div class="questions-scene-header__counter">
        <div class="questions-scene-header__label">${locale.scenes.questions.header.level}</div>
        <div class="questions-scene-header__value questions-scene-header__level">1/${Game.MAX_LEVEL}</div>
    </div>
    <div class="questions-scene-header__counter">
        <div class="questions-scene-header__label">${locale.scenes.questions.header.score}</div>
        <div class="questions-scene-header__value questions-scene-header__score">0/${Game.MAX_SCORE}</div>
    </div>  
    `;

    #levelElement;
    #scoreElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.classList.add('questions-scene-header');

        this.#levelElement = this.querySelector('.questions-scene-header__level');
        this.#scoreElement = this.querySelector('.questions-scene-header__score');
    }

    update({level, score}) {
        this.#levelElement.textContent = `${level}/${Game.MAX_LEVEL}`;
        this.#scoreElement.textContent = `${score}/${Game.MAX_SCORE}`;
    }
}

customElements.define('game-questions-scene-header', QuestionsSceneHeader);