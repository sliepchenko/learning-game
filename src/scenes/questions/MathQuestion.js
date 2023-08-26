import { Question } from './Question.js';

export class MathQuestion extends Question {
    static MULTIPLY = '*';
    static DIVIDE = '/';
    static PLUS = '+';
    static MINUS = '-';

    // this array describes how often each question type should be generated
    static RANDOMIZE_OPTIONS = [
        [10, 10, MathQuestion.MULTIPLY],
        [10, 10, MathQuestion.MULTIPLY],
        [10, 10, MathQuestion.MULTIPLY],
        [1000, 10, MathQuestion.DIVIDE],
        [1000, 10, MathQuestion.DIVIDE],
        [1000, 10, MathQuestion.DIVIDE],
        [1000, 1000, MathQuestion.PLUS],
        [1000, 1000, MathQuestion.MINUS]
    ];

    #template = ``;
    #options = {};

    #a = 0;
    #b = 0;
    #operator = MathQuestion.MULTIPLY;

    constructor() {
        super();

        const randomIndex = Math.floor(Math.random() * MathQuestion.RANDOMIZE_OPTIONS.length);
        const randomOptions = MathQuestion.RANDOMIZE_OPTIONS[randomIndex];

        // get attributes and convert it to comfortable format
        this.#options = {
            a: { min: 1, max: randomOptions[0] },
            b: { min: 1, max: randomOptions[1] },
            operator: randomOptions[2]
        };

        // generate random numbers
        this.#a = Math.floor(Math.random() * (this.#options.a.max - this.#options.a.min)) + this.#options.a.min;
        this.#b = Math.floor(Math.random() * (this.#options.b.max - this.#options.b.min)) + this.#options.b.min;
        this.#operator = this.#options.operator;

        // be sure that a is always greater than b
        if (this.#b > this.#a) {
            [this.#a, this.#b] = [this.#b, this.#a];
        }

        // generate template
        this.#template = `
            <div class="question__body">
                <div class="question__a">${this.#a}</div>
                <div class="question__operator">${this.#operator}</div>
                <div class="question__b">${this.#b}</div>
                <div class="question__equals">=</div>
            </div>
            <div class="question__answer">
                <input class="question__input" type="number" />
                <div class="question__correct"></div>
            </div>
            <button class="question__check question__check--math">
                <img src="./assets/check.svg" alt="Check" />
            </button>
        `;
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.className = 'question question--math';

        // add basic event listeners for interactive elements
        this.querySelector('.question__check').addEventListener('click', this.#onCheckClick);
        this.querySelector('.question__input').addEventListener('keypress', this.#onInputKeyPress);
    }

    check() {
        const inputElement = this.querySelector('.question__input');
        const correct = this.querySelector('.question__correct');
        const checkElement = this.querySelector('.question__check');

        if (inputElement.value === '') {
            return;
        }

        // check answer according to rules
        let result;
        let isAnswerCorrect;
        switch (this.#operator) {
            case MathQuestion.MULTIPLY:
                result = this.#a * this.#b;
                isAnswerCorrect = result === Number(inputElement.value);
                break;
            case MathQuestion.DIVIDE:
                result = Math.floor(this.#a / this.#b);
                isAnswerCorrect = result === Number(inputElement.value);
                break;
            case MathQuestion.PLUS:
                result = this.#a + this.#b;
                isAnswerCorrect = result === Number(inputElement.value);
                break;
            default:
                result = this.#a - this.#b;
                isAnswerCorrect = result === Number(inputElement.value);
                break;
        }

        if (isAnswerCorrect === false) {
            correct.textContent = result;
        }

        this.classList.add(isAnswerCorrect ? 'question--correct' : 'question--incorrect');

        // disable interactive elements to prevent multiple checks
        inputElement.disabled = true;
        checkElement.disabled = true;

        // dispatch event to notify parent component about result
        const event = new CustomEvent('questionChecked', {
            detail: {
                correct: isAnswerCorrect,
                question: `${this.#a} ${this.#operator} ${this.#b}`,
                result: result,
                answer: inputElement.value
            }
        });
        this.dispatchEvent(event);
    }

    focus() {
        this.querySelector('.question__input').focus();
    }

    #onCheckClick = (() => {
        const inputElement = this.querySelector('.question__input');

        // prevent empty input
        if (inputElement.value === '') {
            return;
        }

        this.check();
    }).bind(this);

    #onInputKeyPress = ((event) => {
        // check answer on Enter key press
        if (event.key === 'Enter') {
            this.#onCheckClick();
        }
    }).bind(this);
}

customElements.define('game-math-question', MathQuestion);