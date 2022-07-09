import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

import "regenerator-runtime/runtime"; // to polyfill async await
import "core-js/stable"; //to polyfill everthing else
import * as modal from "./modal.js";
//HMR auto updates modules in the browser without loading the whole page
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    //fetching hash id of recipe
    const hashId = window.location.hash.slice(1);
    //guard clause
    if (!hashId) return;

    // 0)laoding spinner
    recipeView.renderSpinner();
    // update results view to marked selected results
    resultsView.update(modal.getSearchResultsPage());

    //1) laoding recipe

    await modal.loadRecipe(hashId);

    // 2)rendering recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

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

function controlPagination(gotoPage) {
  // 1) render updated results list
  resultsView.render(modal.getSearchResultsPage(gotoPage));

  // 2)updated buttons
  paginationView.render(modal.state.search);
}

function controlServings(newServings) {
  //update qty in state

  modal.updataServings(newServings);

  //render recipe view again
  // recipeView.render(modal.state.recipe); it will render whole recipe section
  //we want to update only part of the view
  recipeView.update(modal.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
