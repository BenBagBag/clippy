/**
 * A pseudo-Clippy.
 *
 * @element clippy-clone
*/

import styles from './styles.js';

export default class ClippyClone extends HTMLElement {
    static get styles() {
        return `
        <style>
            #clippy-container {
              width: 400px;
              border: 4px solid ${styles.colors.teal};
              background-color: ${styles.colors.yellow};
              border-radius:12px;
              padding: 16px 20px;
              position: relative;
              top: 0px;
              right: 0px;
            }
            #inspiration-button {
              background-color: ${styles.colors.yellow};
              color: ${styles.colors.purple};
              cursor: pointer;
            }
            #help-links {
              margin-bottom: 0;
            }
            #inspiration-button, #help-links > a {
              border: 2px solid ${styles.colors.teal};
              border-radius: 8px;
              text-decoration: none;
              padding: 8px;
              margin-bottom: 16px;
              font-weight: 600;
              font-size: 16px;
            }
            #inspiration-button:hover, #help-links > a:hover {
              border-color: ${styles.colors.orange};
            }
            #inspiration-quote {
              color: ${styles.colors.purple};
              margin-top: 24px;
            }
            .display-none {
              display: none;
            }
            .display-block {
              display: block;
            }
            .author {
              font-style: italic;
            }
            div {
                display: flex;
                flex-direction: column;
                font-family: sans-serif;
                font-weight: 500;
                font-size: 20px;
                text-align: center;
                color: ${styles.colors.purple};
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
            }
            </style>
        `;
    }

    static get markup() {
        return `
            <div id="clippy-container">
              <h1 id="header"><slot></slot></h1>
              <p>Clippy is here to help you. We hope you like Clippy, because Clippy never leaves. You're welcome!</p>
              <div id="help-links"></div>
              <div id="inspiration-section"></div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['top', 'right'];
    }

    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = this.constructor.styles + this.constructor.markup;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.initializeElements();

        this.HELP_LINKS = [
          {
            title: 'Help me with grammar',
            link: 'https://owl.purdue.edu/owl/general_writing/grammar/'
          },
          {
            title: 'Help me with vocabulary',
            link: 'https://www.dictionary.com/'
          }
        ];

        this.QUOTE_API_URL = 'https://api.quotable.io/random';
    }

    renderHelpLink(title, link) {
      const helpLink = document.createElement('a');
      helpLink.setAttribute('href', link);
      helpLink.setAttribute('target', '_blank');
      helpLink.text = title;
      return helpLink;
    }

    renderHelpLinks() {
      for (let helpLink of this.HELP_LINKS) {
        this.helpLinks.appendChild(this.renderHelpLink(helpLink.title, helpLink.link));
      }
    }

    async getQuote() {
      const quoteResponse = await fetch(this.QUOTE_API_URL);
      const data = await quoteResponse.json();
      if (quoteResponse.ok) {
        return { quote: data.content, author: data.author };
      } else {
        return { quote: 'Error: the inspiration factory is closed.', author: 'Sad Clippy' };
      }
    }

    handleInspirationClick() {
      this.renderInspirationQuote();
    }

    renderInspirationButton() {
      const inspirationButton = document.createElement('button');
      inspirationButton.innerHTML = 'Help me with inspiration';
      inspirationButton.id = 'inspiration-button';
      return inspirationButton;
    }

    renderInspirationQuoteDiv() {
      const inspirationQuoteDiv = document.createElement('div');
      inspirationQuoteDiv.setAttribute('id', 'inspiration-quote');
      inspirationQuoteDiv.setAttribute('class', 'display-none');
      return inspirationQuoteDiv;
    }

    renderInspirationQuote() {
      this.getQuote().then((quoteData) => {
        const quoteHtml = `
          <div class="quote">${quoteData.quote}</div>
          <div class="author">&mdash;${quoteData.author}</div>
        `;
        const quoteDiv = this.shadowRoot.querySelector('#inspiration-quote');
        quoteDiv.innerHTML = quoteHtml;
        quoteDiv.removeAttribute('class');
        quoteDiv.setAttribute('class', 'display-block');

        this.shadowRoot.querySelector('#inspiration-button').textContent = 'Give me another quote';
      });
    }

    renderInspirationSection() {
      this.inspirationSectionDiv.appendChild(this.renderInspirationButton());
      this.inspirationSectionDiv.appendChild(this.renderInspirationQuoteDiv());
    }

    connectedCallback() {
        this.renderHelpLinks();
        this.renderInspirationSection();

        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    addEventListeners() {
      this.handleInspirationClickCallback = this.handleInspirationClick.bind(this);
      this.shadowRoot.querySelector('#inspiration-button').addEventListener('click', this.handleInspirationClickCallback);
    }

    removeEventListeners() {
      this.shadowRoot.querySelector('#inspiration-button').removeEventListener('click', this.handleInspirationClickCallback);
    }

    initializeElements() {
        this.clippyContainer = this.shadowRoot.querySelector('#clippy-container');
        this.helpLinks = this.shadowRoot.getElementById('help-links');
        this.inspirationSectionDiv = this.shadowRoot.querySelector('#inspiration-section');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'top'){
            this.clippyContainer.style['top'] = `${newValue}px`;
        }
        if (name === 'right'){
            this.clippyContainer.style['right'] = `${newValue}px`;
        }
    }
}

customElements.define('clippy-clone', ClippyClone);
