import { Question } from './Question.js';

export class Main extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('main');
    }

    addQuestion(maxA, maxB, operator) {
        const question = new Question();
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