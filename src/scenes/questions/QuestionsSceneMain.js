import { Game } from '../../Game.js';
import { MathQuestion } from './MathQuestion.js';
import { FlagQuestion } from './FlagQuestion.js';

export class QuestionsSceneMain extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('questions-scene-main');
    }

    addQuestion(type) {
        let question;

        switch (type) {
            case Game.TYPE_MATH: question = new MathQuestion(); break;
            case Game.TYPE_FLAGS: question = new FlagQuestion(); break;
            default: throw new Error('Unknown game type');
        }

        this.prepend(question);

        question.focus();
        question.addEventListener('questionChecked', this.#onQuestionChecked);
    }

    reset() {
        this.innerHTML = '';
    }

    #onQuestionChecked = ((event) => {
        event = new CustomEvent('questionChecked', {
            detail: event.detail
        });

        this.dispatchEvent(event);
    }).bind(this);
}

customElements.define('game-questions-scene-main', QuestionsSceneMain);