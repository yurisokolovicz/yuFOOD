import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';

//// Polyfilling - for the web app work in old browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import bookmarksView from './views/bookmarksView.js';

if (module.hot) {
    module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe'); // already in recipeView #################

const controlRecipes = async function () {
    try {
        // Slice para nao ler o primeiro caracter (#), comecar a partir do segundo
        const id = window.location.hash.slice(1);
        // console.log(id);

        if (!id) return; // load the page without id
        recipeView.renderSpiner(recipeContainer);

        // 0) Update results view to mark selected search results
        resultsView.update(model.getSearchResultsPage());

        // 1) Updating bookmarks view
        bookmarksView.update(model.state.bookmarks);

        // 2) Loading recipe
        // We will get acess to state.recipe from model.js
        await model.loadRecipe(id);

        // 3) Rendering recipe
        // const recipeView = new recipeView(model.state.recipe)
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
        console.error(err);
    }
};

const controlSearchResults = async function () {
    try {
        resultsView.renderSpiner();

        // 1) Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2) Load search results
        await model.loadSearchResults(query);

        // 3) Render results
        resultsView.render(model.getSearchResultsPage());

        // 4) Render the initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};

const controlPagination = function (goToPage) {
    // 1) Render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render new pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    // Update the recipe servings (in state)
    model.updateServings(newServings);

    // Update the recipe view
    // recipeView.render(model.state.recipe);
    // update will only update text and atributes in the DOM without re-render the entire view
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    // 1) Add/remove bookmark
    if (model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);
    else model.addBookmark(model.state.recipe);

    // 2) Update bookmarks
    recipeView.update(model.state.recipe);

    // 3) Render bookmarks
    BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
};
init();
