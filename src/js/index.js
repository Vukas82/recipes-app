//---------------------------------------------------------- Global app controller -------------------------------------------------


import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';

/*
        Global state of the app
    * - search object
    * - current recepies object
    * - Shoping list object
    * - Liked recipes
*/
const state = {};

/*
    SEARCH CONTROLER
*/
const controleSearch = async () => {
    //  1. get a query from view
    const query = searchView.getInput();


    if (query) {
        // 2. make new search object and add it to hte state
        state.search = new Search(query);
        // 3. Prepere UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();
            // 5. Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result)
        } catch (err) {
            alert('Something gone wrong :(');
            clearLoader();
        }
    }

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controleSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)

    }
});

/*
    RECIPE CONTROLER
*/

const controlRecipe = async () => {

    // Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id)

    if (id) {

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)
        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipedata and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parceIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            console.log(err);
            alert('Error procesing recipe!');
        }


    }

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));