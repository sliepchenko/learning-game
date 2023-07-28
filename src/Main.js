import { Game } from './Game.js';
import { MathQuestion } from './MathQuestion.js';
import { FlagQuestion } from './FlagQuestion.js';

export class Main extends HTMLElement {
    #template = `
    <div class="main__choose-game">
        <h1 class="choose-game__title">Choose your game</h1>
        <div class="choose-game__buttons">
            <button class="choose-game__button choose-game__math">Math</button>
            <button class="choose-game__button choose-game__flags">Flags</button>
        </div>
    </div>
    `;

    #mathGameButton;
    #flagsGameButton;
    
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.#template;

        this.#mathGameButton = this.querySelector('.choose-game__math');
        this.#mathGameButton.addEventListener('click', this.#onMathGameButtonClick);

        this.#flagsGameButton = this.querySelector('.choose-game__flags');
        this.#flagsGameButton.addEventListener('click', this.#onFlagsGameButtonClick);

        this.classList.add('main');
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

    #onMathGameButtonClick = (() => {
        const event = new CustomEvent('gameTypeChanged', {
            detail: {
                type: Game.TYPE_MATH
            }
        });

        this.dispatchEvent(event);
    }).bind(this);

    #onFlagsGameButtonClick = (() => {
        const event = new CustomEvent('gameTypeChanged', {
            detail: {
                type: Game.TYPE_FLAGS
            }
        });

        this.dispatchEvent(event);
    }).bind(this);
}

customElements.define('game-main', Main);