import { Header } from './Header.js';
import { Main } from './Main.js';
import { Question } from './Question.js';

export class Game extends HTMLElement {
    static MAX_LEVEL = 100;
    static MAX_SCORE = 100;

    // this array describes how often each question type should be generated
    static RANDOMIZE_OPTIONS = [
        [10, 10, Question.MULTIPLY],
        [10, 10, Question.MULTIPLY],
        [10, 10, Question.MULTIPLY],
        [1000, 10, Question.DIVIDE],
        [1000, 10, Question.DIVIDE],
        [1000, 10, Question.DIVIDE],
        [1000, 1000, Question.PLUS],
        [1000, 1000, Question.MINUS]
    ];

    #level = 1;
    #score = 0;

    header = new Header();
    main = new Main();

    constructor() {
        super();
    }

    connectedCallback() {
        this.append(this.header);
        this.append(this.main);

        this.classList.add('container');

        this.#generateQuestion();
        this.#launchAntiCheatSystem();
    }

    #generateQuestion = (() => {
        const randomIndex = Math.floor(Math.random() * Game.RANDOMIZE_OPTIONS.length);
        const randomOptions = Game.RANDOMIZE_OPTIONS[randomIndex];

        const question = this.main.addQuestion(...randomOptions);
        question.addEventListener('questionChecked', this.#onQuestionChecked);
        question.focus();
    }).bind(this);

    #onQuestionChecked = ((event) => {
        if (event.detail.isAnswerCorrect) {
            this.#score += Game.MAX_SCORE / Game.MAX_LEVEL;
        }

        if (this.#level < Game.MAX_LEVEL) {
            this.#generateQuestion();
            this.#level++;

            this.header.setLevel(this.#level);
            this.header.setScore(this.#score);
        }
    }).bind(this);

    #launchAntiCheatSystem() {
        window.document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                location.reload();
            }
        });

        window.addEventListener('blur', () => {
            location.reload();
        });
    }
}

customElements.define('game-container', Game);