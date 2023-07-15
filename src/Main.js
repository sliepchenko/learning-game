import { Question } from './Question.js';

export class Main extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

    }

    addQuestion(maxA, maxB, operator) {
        const question = document.createElement('game-question');
        question.setAttribute('a-min', 1);
        question.setAttribute('a-max', maxA);
        question.setAttribute('b-min', 1);
        question.setAttribute('b-max', maxB);
        question.setAttribute('operator', operator);
        this.prepend(question);

        return question;
    }
}

customElements.define('game-main', Main);