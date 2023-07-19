import { Header } from './Header.js';
import { Main } from './Main.js';
import { Footer } from './Footer.js';
import { Question } from './Question.js';

export class Game extends HTMLElement {
    // this value should be replaced by version.js script
    static GAME_VERSION = '2023-07-19 10:42:13';

    static ANTI_CHEAT_SYSTEM_MAX_COUNTER = 3;

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

    #antiCheatSystemCounter = 0;

    #level = 1;
    #score = 0;

    #header = new Header();
    #main = new Main();
    #footer = new Footer();

    constructor() {
        super();
    }

    connectedCallback() {
        this.append(this.#header);
        this.append(this.#main);
        this.append(this.#footer);

        this.classList.add('container');

        this.#generateQuestion();
        this.#launchAntiCheatSystem();
        // this.#launchProtectionSystem();

        this.#footer.setPenalty(this.#antiCheatSystemCounter);
        this.#footer.setVersion(Game.GAME_VERSION);
    }

    #generateQuestion = (() => {
        const randomIndex = Math.floor(Math.random() * Game.RANDOMIZE_OPTIONS.length);
        const randomOptions = Game.RANDOMIZE_OPTIONS[randomIndex];

        const question = this.#main.addQuestion(...randomOptions);
        question.addEventListener('questionChecked', this.#onQuestionChecked);
        question.focus();
    }).bind(this);

    #onQuestionChecked = ((event) => {
        if (event.detail.correct) {
            this.#score += Game.MAX_SCORE / Game.MAX_LEVEL;
        }

        if (this.#level < Game.MAX_LEVEL) {
            this.#generateQuestion();
            this.#level++;

            this.#header.setLevel(this.#level);
            this.#header.setScore(this.#score);
        } else {
            window.gSendEvent(
                'user',
                'level',
                'finished',
                this.#score
            );
        }
    }).bind(this);

    #launchAntiCheatSystem() {
        window.addEventListener('blur', () => {
            this.#antiCheatSystemCounter++;

            if (this.#antiCheatSystemCounter < Game.ANTI_CHEAT_SYSTEM_MAX_COUNTER) {
                window.location.reload();
            }
        });
    }

    #launchProtectionSystem() {
        window.addEventListener('beforeunload', (event) => {
            if (window.game) {
                event.preventDefault();
                event.returnValue = 'Are you sure you want to leave?';
            }
        });
    }
}

customElements.define('game-container', Game);