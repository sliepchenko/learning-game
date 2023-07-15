export class Footer extends HTMLElement {
    #template = ``;

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
    }
}

customElements.define('game-footer', Footer);