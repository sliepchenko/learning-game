import { Game } from '../../Game.js';

const { locale } = await import(`./../../../i18n/${navigator.language}.js`);

export class QuestionsSceneFooter extends HTMLElement {
    #template = `
    <div class="questions-scene-footer__counter">
        <div class="questions-scene-footer__label">${locale.scenes.questions.footer.penalty}:</div>
        <div class="questions-scene-footer__value questions-scene-footer__level">0/3</div>
    </div>
    <div class="questions-scene-footer__version">${Game.VERSION}</div>
    `;

    #penaltyElement;
    #versionElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.classList.add('questions-scene-footer');

        this.#penaltyElement = this.querySelector('.questions-scene-footer__level');
        this.#versionElement = this.querySelector('.questions-scene-footer__version');
    }

    update({ penalty }) {
        this.#penaltyElement.textContent = `${penalty}/${Game.ANTI_CHEAT_SYSTEM_MAX_COUNTER}`;
    }
}

customElements.define('game-questions-scene-footer', QuestionsSceneFooter);