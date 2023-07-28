import { MathQuestion } from './MathQuestion.js';

export class Main extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('main');
    }

    addQuestion(maxA, maxB, operator) {
        const question = new MathQuestion();
        this.prepend(question);

        return question;
    }

    reset() {
        this.innerHTML = '';
    }
}

customElements.define('game-main', Main);