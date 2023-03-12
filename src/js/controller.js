import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

//// Polyfilling - for the web app work in old browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe'); // already in recipeView #################

const controlRecipes = async function () {
    try {
        // Slice para nao ler o primeiro caracter (#), comecar a partir do segundo
        const id = window.location.hash.slice(1);
        // console.log(id);

        if (!id) return; // load the page without id
        recipeView.renderSpiner(recipeContainer);

        // 1) Loading recipe
        // We will get acess to state.recipe from model.js
        await model.loadRecipe(id);

        // 2) Rendering recipe
        // const recipeView = new recipeView(model.state.recipe)
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
    try {
        // 1) Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2) Load search results
        await model.loadSearchResults(query);

        // 3) Render results
        console.log(model.state.search.results);
    } catch (err) {
        console.log(err);
    }
};

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
};
init();
