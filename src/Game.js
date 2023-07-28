import { Header } from './Header.js';
import { Main } from './Main.js';
import { Footer } from './Footer.js';

import { MathQuestion } from './MathQuestion.js';

export class Game extends HTMLElement {
    // this value should be replaced by version.js script
    static GAME_VERSION = '2023-07-28 14:33:08';

    static ANTI_CHEAT_SYSTEM_MAX_COUNTER = 3;

    static MAX_LEVEL = 100;
    static MAX_SCORE = 100;

    #penalties = 0;

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

        this.#footer.setVersion(Game.GAME_VERSION);

        this.#launchAntiCheatSystem();
        this.#launchProtectionSystem();

        this.#start();
    }

    #generateQuestion = (() => {
        const question = this.#main.addQuestion();
        question.addEventListener('questionChecked', this.#onQuestionChecked);
        question.focus();
    }).bind(this);

    #onQuestionChecked = ((event) => {
        if (event.detail.correct) {
            this.#score += Game.MAX_SCORE / Game.MAX_LEVEL;
        }

        this.#sendEvent('game_level');

        if (this.#level < Game.MAX_LEVEL) {
            this.#generateQuestion();
            this.#level++;

            this.#header.setLevel(this.#level);
            this.#header.setScore(this.#score);
        }
    }).bind(this);

    #launchAntiCheatSystem() {
        window.addEventListener('blur', () => {
            this.#footer.setPenalty(++this.#penalties);

            if (this.#penalties > Game.ANTI_CHEAT_SYSTEM_MAX_COUNTER) {
                this.#sendEvent('game_reset', {
                    reason: 'blur'
                });

                this.#reset();
                this.#start();
            }
        });
    }

    #launchProtectionSystem() {
        window.addEventListener('beforeunload', (event) => {
            if (window.game) {
                this.#sendEvent('game_reset', {
                    reason: 'reload'
                });

                event.preventDefault();
                event.returnValue = 'Are you sure you want to leave?';
            }
        });
    }

    #sendEvent(name, data) {
        window.gSendEvent(name, {
            level: this.#level,
            score: this.#score,
            penalty: this.#penalties,
            ...data
        })
    }

    #reset() {
        this.#level = 1;
        this.#score = 0;
        this.#penalties = 0;
    }

    #start() {
        this.#header.setLevel(this.#level);
        this.#header.setScore(this.#score);

        this.#main.reset();
        this.#generateQuestion();

        this.#footer.setPenalty(this.#penalties);
    }
}

customElements.define('game-container', Game);