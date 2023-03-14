import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
    _data;

    /**
     * Render the received objects to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @returns
     * @this {Object} View instance
     * @author Yuri Sokolovicz
     * @todo Finish the implementation
     */
    render(data) {
        // If there is no data or if there is data and it is in an array and it is empty show the error
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        // Creating a virtual DOM that is not living on the page but in memory
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*')); // Array.from is to convert node list into an array
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl));

            // Updates changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                // console.log('🙀', newEl.firstChild.nodeValue.trim());
                curEl.textContent = newEl.textContent;
            }
            // Updates changed ATTRIBUTES
            if (!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpiner() {
        const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
  `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>  
    `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>  
    `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}
