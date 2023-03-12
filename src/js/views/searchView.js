class SearchView {
    #parentEl = document.querySelector('.search');

    getQuery() {
        const query = this.#parentEl.querySelector('.search__field').value;
        this.#clearInput();
        return query;
    }

    // Clear field after searching
    // With # the method is private, it will not be acessed by outside of this file
    #clearInput() {
        this.#parentEl.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        this.#parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
