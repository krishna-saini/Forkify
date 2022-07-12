import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

import "regenerator-runtime/runtime"; // to polyfill async await
import "core-js/stable"; //to polyfill everthing else
import * as modal from "./modal.js";
//HMR auto updates modules in the browser without loading the whole page
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/**
 * control recipe view functionality
 * @returns {undefined}
 */
async function controlRecipes() {
  try {
    //fetching hash id of recipe
    const hashId = window.location.hash.slice(1);
    //guard clause
    if (!hashId) return;

    // 0)laoding spinner
    recipeView.renderSpinner();
    // update results view to marked selected search results
    resultsView.update(modal.getSearchResultsPage());

    // 1) updating bookmark view
    bookmarksView.update(modal.state.bookmarks);

    //1) laoding recipe
    await modal.loadRecipe(hashId);

    // 2)rendering recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

/**
 * control the search results functionality
 * @returns {undefined}
 */
async function controlSearchResults() {
  try {
    // 0) spinner
    resultsView.renderSpinner();

    // 1) get search query
    const query = searchView.getQuery();
    //guard clause
    if (!query) throw new Error("no recipe found");

    // 2) load search result
    await modal.loadSearchResults(query);

    //  3) render search recipes
    // resultsView.render(modal.state.search.results);

    resultsView.render(modal.getSearchResultsPage());

    // 4) render pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    resultsView.render(err.message);
  }
}

/**
 * control the search results paginationa functionality
 * @param {number}gotoPage - page no. to go to
 * @returns {undefined}
 */
function controlPagination(gotoPage) {
  // 1) render updated results list
  resultsView.render(modal.getSearchResultsPage(gotoPage));

  // 2)updated buttons
  paginationView.render(modal.state.search);
}

/**
 * control the recipe servings functionality
 * @param {number} newServings - no. of people
 * @returns {undefined}
 */
function controlServings(newServings) {
  //update qty in state
  modal.updataServings(newServings);

  //render recipe view again
  // recipeView.render(modal.state.recipe); it will render whole recipe section
  //we want to update only part of the view
  recipeView.update(modal.state.recipe);
}

/**
 * control the Add Bookmarks functionality
 * @returns {undefined}
 */
function controlAddBookmarks() {
  // 1)Add/Delete bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);

  // 2)update  recipe view
  recipeView.update(modal.state.recipe);

  // 3)Render bookmarks
  bookmarksView.render(modal.state.bookmarks);
}

/**
 * control the bookmarks functionality
 * @returns {undefined}
 */
function controlBookmarks() {
  // 3)Render bookmarks at the loading of page
  bookmarksView.render(modal.state.bookmarks);
}

/**
 * control the add new recipe functionality
 * @param {object} newRecipe - recipe to be added by user
 * @returns {undefined}
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await modal.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(modal.state.recipe);

    // Render bookmark view
    bookmarksView.render(modal.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${modal.state.recipe.id}`);

    // reload the page to enable adding more recipes
    location.reload();

    // Success message
    const timer = setTimeout(() => {
      addRecipeView.renderMessage();
    }, (MODAL_CLOSE_SEC - 1.5) * 1000);

    setTimeout(function () {
      clearTimeout(timer);
      // Close form window
      addRecipeView.toggleWindow();
    }, (MODAL_CLOSE_SEC - 1) * 1000);
  } catch (err) {
    console.error("💥", err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * control all the functionality while loading the page
 * @returns {undefined}
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
