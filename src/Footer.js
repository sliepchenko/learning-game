import { Game } from './Game.js';

export class Footer extends HTMLElement {
    #template = `
    <div class="footer__penalty"></div>
    <div class="footer__version"></div>
    `;

    #penaltyElement;
    #versionElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.classList.add('footer');

        this.#penaltyElement = this.querySelector('.footer__penalty');
        this.#versionElement = this.querySelector('.footer__version');
    }

    setPenalty = ((level) => {
        this.#penaltyElement.textContent = `Penalty ${level}/${Game.ANTI_CHEAT_SYSTEM_MAX_COUNTER}`;
    }).bind(this);

    setVersion = ((date) => {
        this.#versionElement.textContent = date;
    }).bind(this);
}

customElements.define('game-footer', Footer);