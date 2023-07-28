import { Question } from './Question.js';

export class FlagQuestion extends Question {
    // this array describes how often each question type should be generated
    static RANDOMIZE_OPTIONS = [
        {flag: '🇦🇱', name: 'Albania'},
        {flag: '🇦🇩', name: 'Andorra'},
        {flag: '🇦🇹', name: 'Austria'},
        {flag: '🇧🇪', name: 'Belgium'},
        {flag: '🇧🇦', name: 'Bosnia and Herzegovina'},
        {flag: '🇧🇬', name: 'Bulgaria'},
        {flag: '🇭🇷', name: 'Croatia'},
        {flag: '🇨🇾', name: 'Cyprus'},
        {flag: '🇨🇿', name: 'Czech Republic'},
        {flag: '🇩🇰', name: 'Denmark'},
        {flag: '🇪🇪', name: 'Estonia'},
        {flag: '🇫🇮', name: 'Finland'},
        {flag: '🇫🇷', name: 'France'},
        {flag: '🇩🇪', name: 'Germany'},
        {flag: '🇬🇷', name: 'Greece'},
        {flag: '🇭🇺', name: 'Hungary'},
        {flag: '🇮🇸', name: 'Iceland'},
        {flag: '🇮🇪', name: 'Ireland'},
        {flag: '🇮🇹', name: 'Italy'},
        {flag: '🇱🇻', name: 'Latvia'},
        {flag: '🇱🇮', name: 'Liechtenstein'},
        {flag: '🇱🇹', name: 'Lithuania'},
        {flag: '🇱🇺', name: 'Luxembourg'},
        {flag: '🇲🇹', name: 'Malta'},
        {flag: '🇲🇩', name: 'Moldova'},
        {flag: '🇲🇨', name: 'Monaco'},
        {flag: '🇲🇪', name: 'Montenegro'},
        {flag: '🇳🇱', name: 'Netherlands'},
        {flag: '🇲🇰', name: 'North Macedonia'},
        {flag: '🇳🇴', name: 'Norway'},
        {flag: '🇵🇱', name: 'Poland'},
        {flag: '🇵🇹', name: 'Portugal'},
        {flag: '🇷🇴', name: 'Romania'},
        {flag: '🇸🇲', name: 'San Marino'},
        {flag: '🇷🇸', name: 'Serbia'},
        {flag: '🇸🇰', name: 'Slovakia'},
        {flag: '🇸🇮', name: 'Slovenia'},
        {flag: '🇪🇸', name: 'Spain'},
        {flag: '🇸🇪', name: 'Sweden'},
        {flag: '🇨🇭', name: 'Switzerland'},
        {flag: '🇺🇦', name: 'Ukraine'},
        {flag: '🇬🇧', name: 'United Kingdom'},
        {flag: '🇻🇦', name: 'Vatican City'}
    ];

    #pool = [...FlagQuestion.RANDOMIZE_OPTIONS];
    #template = ``;

    #buttons = [];

    #a = undefined;
    #b = undefined;
    #c = undefined;
    #d = undefined;
    #answer = undefined;

    constructor() {
        super();

        this.#a = Math.floor(Math.random() * this.#pool.length);
        this.#a = this.#pool.splice(this.#a, 1)[0];

        this.#b = Math.floor(Math.random() * this.#pool.length);
        this.#b = this.#pool.splice(this.#b, 1)[0];

        this.#c = Math.floor(Math.random() * this.#pool.length);
        this.#c = this.#pool.splice(this.#c, 1)[0];

        this.#d = Math.floor(Math.random() * this.#pool.length);
        this.#d = this.#pool.splice(this.#d, 1)[0];

        this.#answer = Math.floor(Math.random() * 4);
        this.#answer = [this.#a, this.#b, this.#c, this.#d][this.#answer];
    }

    connectedCallback() {
        // generate template
        this.#template = `
            <div class="question__country">${this.#answer.name}</div>
            <button class="question__check question__flag">${this.#a.flag}</button>
            <button class="question__check question__flag">${this.#b.flag}</button>
            <button class="question__check question__flag">${this.#c.flag}</button>
            <button class="question__check question__flag">${this.#d.flag}</button>
        `;

        this.innerHTML = this.#template;
        this.className = 'question';

        this.#buttons = Array.from(this.querySelectorAll('.question__check'));

        // add basic event listeners for interactive elements
        this.#buttons.forEach((button) => {
            button.addEventListener('click', this.#onCheckClick);
        });
    }

    check(answer) {
        answer = FlagQuestion.RANDOMIZE_OPTIONS.find(({flag}) => flag === answer);

        const isAnswerCorrect = answer.name === this.#answer.name;

        this.classList.add(isAnswerCorrect ? 'question_correct' : 'question_incorrect');

        // disable interactive elements to prevent multiple checks
        // highlight correct answer and user answer
        this.#buttons.forEach((button) => {
            button.disabled = true;

            if (button.innerText === answer.flag && isAnswerCorrect === false) {
                button.classList.add('question__flag_incorrect');
            }

            if (button.innerText === this.#answer.flag) {
                button.classList.add('question__flag_correct');
            }
        });

        // dispatch event to notify parent component about result
        const event = new CustomEvent('questionChecked', {
            detail: {
                correct: isAnswerCorrect,
                question: this.#answer.name,
                result: this.#answer.flag,
                answer: answer.flag
            }
        });
        this.dispatchEvent(event);
    }

    focus() {
        this.querySelector('.question__check').focus();
    }

    #onCheckClick = ((event) => {
        this.check(event.target.innerText);
    }).bind(this);
}

customElements.define('game-flag-question', FlagQuestion);