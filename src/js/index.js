//---------------------------------------------------------- Global app controller -------------------------------------------------


import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';

// import {
//     stat
// } from 'fs';

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
    if (id) {

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        //Higlight selected recipe
        if (state.search) searchView.higlightSelected(id);

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLIked(id)
            );
        } catch (err) {
            console.log(err);
            alert('Error procesing recipe!');
        }


    }

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
    LIST CONTROLER
*/
const controlList = () => {
    // Create a new list if thera are no one
    if (!state.list) state.list = new List();
    // Add each ingrediant to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        //handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);

        if (val >= 0) {
            state.list.updateCount(id, val)
        } else {
            // val = 0;
            e.target.value = '0';
            return
        }
    }

});

/*
    LIKE CONTROLER
*/

const controleLIke = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has NOT yet liked current recepi
    if (!state.likes.isLIked(currentId)) {
        // Add like to state
        // id, title, author, img
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // Toglee the like button
        likesView.toggleLikeBtn(true)

        // Ad  like to the UI list
        likesView.renderLike(newLike);
        // User HAS liked current recepi
    } else {
        // Remove like to state
        state.likes.deleteLike(currentId)
        // Toglee the like button
        likesView.toggleLikeBtn(false)

        // Remove  like to the UI list
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
};

// Restore liked recepi when is page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Togle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // render the exsisting likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updatServingsIngredient(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase btn is clicked
        state.recipe.updateServings('inc')
        recipeView.updatServingsIngredient(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //ADD INGREDIENTS TO SHOPPING LIST
        controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // LIKE CONTROLLER
        controleLIke();
    }
});