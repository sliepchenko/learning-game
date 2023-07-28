import { Header } from './Header.js';
import { Main } from './Main.js';
import { Footer } from './Footer.js';

export class Game extends HTMLElement {
    // this value should be replaced by version.js script
    static VERSION = '2023-07-28 20:50:03';

    static TYPE_MATH = 'math';
    static TYPE_FLAGS = 'flags';

    static MAX_LEVEL = 100;
    static MAX_SCORE = 100;

    static ANTI_CHEAT_SYSTEM_MAX_COUNTER = 3;

    #penalties = 0;

    #type;
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

        this.#main.addEventListener('questionChecked', this.#onQuestionChecked);
        this.#main.addEventListener('gameTypeChanged', this.#onGameTypeChanged);
        this.#footer.setVersion(Game.VERSION);

        this.#launchAntiCheatSystem();
        this.#launchProtectionSystem();

        // if queryParams contains type, use it
        // if this type is not in list of allowed, use default behaviour
        const queryParams = new URLSearchParams(window.location.search);
        this.#type = queryParams.get('type');

        if (this.#type && [Game.TYPE_MATH, Game.TYPE_FLAGS].includes(this.#type)) {
            this.#reset();
            this.#start();
        }
    }

    #onQuestionChecked = ((event) => {
        if (event.detail.correct) {
            this.#score += Game.MAX_SCORE / Game.MAX_LEVEL;
        }

        this.#sendEvent('game_level');

        if (this.#level < Game.MAX_LEVEL) {
            this.#main.addQuestion(this.#type);
            this.#level++;

            this.#header.setLevel(this.#level);
            this.#header.setScore(this.#score);
        }
    }).bind(this);

    #onGameTypeChanged = ((event) => {
        this.#type = event.detail.type;

        this.#reset();
        this.#start();
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
        this.#main.addQuestion(this.#type);

        this.#footer.setPenalty(this.#penalties);
    }
}

customElements.define('game-container', Game);