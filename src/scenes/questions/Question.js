export class Question extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        throw new Error('Not implemented');
    }

    check() {
        throw new Error('Not implemented');
    }

    focus() {
        throw new Error('Not implemented');
    }
}

customElements.define('game-question', Question);