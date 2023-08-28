import { MenuScene } from './scenes/menu/MenuScene.js';
import { QuestionsScene } from './scenes/questions/QuestionsScene.js';
import { ScoreScene } from './scenes/score/ScoreScene.js';

export class Game extends HTMLElement {
    // this value should be replaced by version.js script
    static VERSION = '2023-08-28 16:08:17';

    static MENU_SCENE = 'menuScene';
    static QUESTIONS_SCENE = 'questionsScene';
    static SCORE_SCENE = 'scoreScene';

    static TYPE_MATH = 'math';
    static TYPE_FLAGS = 'flags';

    static MAX_LEVEL = 100;
    static MAX_SCORE = 100;

    static ANTI_CHEAT_SYSTEM_MAX_COUNTER = 3;

    #penalty = 0;

    #type;
    #level = 1;
    #score = 0;
    #startDateTime;
    #endDateTime;

    #menuScene = new MenuScene();
    #questionsScene = new QuestionsScene();
    #scoreScene = new ScoreScene();

    constructor() {
        super();
    }

    connectedCallback() {
        // build UI
        this.append(this.#menuScene);
        this.append(this.#questionsScene);
        this.append(this.#scoreScene);
        this.classList.add('container');

        // listen for events
        this.#menuScene.addEventListener('gameTypeChanged', this.#onGameTypeChanged);
        this.#questionsScene.addEventListener('questionChecked', this.#onQuestionChecked);
        this.#scoreScene.addEventListener('gameRestarted', this.#onGameRestarted);

        // launch interactive systems
        this.#launchAntiCheatSystem();
        this.#launchProtectionSystem();

        // if queryParams contains type, use it
        // if this type is not in list of allowed, use default behaviour
        const queryParams = new URLSearchParams(window.location.search);
        this.#type = queryParams.get('type');

        // launch game with preselected type or show menu
        this.#resetState();
        this.#updateScenes();

        if (this.#type && [Game.TYPE_MATH, Game.TYPE_FLAGS].includes(this.#type)) {
            this.#switchScene(Game.QUESTIONS_SCENE);
            this.#nextQuestion();
        } else {
            this.#switchScene(Game.MENU_SCENE);
        }
    }

    #onQuestionChecked = ((event) => {
        if (event.detail.correct) {
            this.#score += Game.MAX_SCORE / Game.MAX_LEVEL;
        }

        this.#sendEvent('game_level');

        if (this.#level < Game.MAX_LEVEL) {
            this.#level++;
            this.#nextQuestion();
        } else {
            this.#endDateTime = new Date().toLocaleString();
            this.#switchScene(Game.SCORE_SCENE);
        }

        this.#updateScenes();
    }).bind(this);

    #onGameTypeChanged = ((event) => {
        this.#type = event.detail.type;

        this.#switchScene(Game.QUESTIONS_SCENE);
        this.#nextQuestion();
    }).bind(this);

    // protect results from cheating
    #launchAntiCheatSystem() {
        window.addEventListener('blur', () => {
            this.#penalty++;

            if (this.#penalty > Game.ANTI_CHEAT_SYSTEM_MAX_COUNTER) {
                this.#sendEvent('game_reset', {
                    reason: 'blur'
                });

                this.#endDateTime = new Date().toLocaleString();
                this.#switchScene(Game.SCORE_SCENE);
            }

            this.#updateScenes();
        });
    }

    // protect results from reloading
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

    // Google Analytics
    #sendEvent(name, data) {
        // window.gSendEvent(name, {
        //     level: this.#level,
        //     score: this.#score,
        //     penalty: this.#penalties,
        //     ...data
        // })
    }

    // reset game state
    #resetState() {
        this.#level = 1;
        this.#score = 0;
        this.#penalty = 0;
        this.#startDateTime = new Date().toLocaleString();
        this.#endDateTime = null;

        this.#questionsScene.reset();
    }

    // update UI according to game state
    #updateScenes() {
        this.#questionsScene.update({
            level: this.#level,
            score: this.#score,
            penalty: this.#penalty
        });

        this.#scoreScene.update({
            level: this.#level,
            score: this.#score,
            startDateTime: this.#startDateTime,
            endDateTime: this.#endDateTime
        });
    }

    // add a new question
    #nextQuestion() {
        this.#questionsScene.addQuestion(this.#type);
    }

    #switchScene(scene) {
        switch (scene) {
            case Game.MENU_SCENE:
                this.#menuScene.show();
                this.#questionsScene.hide();
                this.#scoreScene.hide();
                break;

            case Game.QUESTIONS_SCENE:
                this.#menuScene.hide();
                this.#questionsScene.show();
                this.#scoreScene.hide();
                break;

            case Game.SCORE_SCENE:
                this.#menuScene.hide();
                this.#questionsScene.hide();
                this.#scoreScene.show();
                break;

            default:
                throw new Error('Unknown scene');
        }
    }

    #onGameRestarted = (() => {
        this.#resetState();
        this.#updateScenes();

        this.#switchScene(Game.MENU_SCENE);
    }).bind(this);
}

customElements.define('game-container', Game);