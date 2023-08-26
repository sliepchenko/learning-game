import { QuestionsSceneHeader } from './QuestionsSceneHeader.js';
import { QuestionsSceneMain } from './QuestionsSceneMain.js';
import { QuestionsSceneFooter } from './QuestionsSceneFooter.js';

export class QuestionsScene extends HTMLElement {
    #header = new QuestionsSceneHeader();
    #main = new QuestionsSceneMain();
    #footer = new QuestionsSceneFooter();

    constructor() {
        super();

        this.hide();
    }

    connectedCallback() {
        this.append(this.#header);
        this.append(this.#main);
        this.append(this.#footer);

        this.#main.addEventListener('questionChecked', this.#onQuestionChecked);

        this.classList.add('questions-scene');
    }

    hide() {
        this.style.display = 'none';
    }

    show() {
        this.style.display = 'flex';
    }

    reset() {
        this.#main.reset();
    }

    update({ level, score, penalty }) {
        this.#header.update({ level, score });
        this.#footer.update({ penalty });
    }

    addQuestion(question) {
        this.#main.addQuestion(question);
    }

    #onQuestionChecked = ((event) => {
        event = new CustomEvent('questionChecked', {
            detail: event.detail
        });

        this.dispatchEvent(event);
    }).bind(this);
}

customElements.define('game-questions-scene', QuestionsScene);