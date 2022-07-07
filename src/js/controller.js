import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

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
    // 0)laoding spinner
    recipeView.renderSpinner();

    //fetching hash id of recipe
    const hashId = window.location.hash.slice(1);

    //guard clause
    if (!hashId) return;

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
    console.log(query);

    // 2) load search result
    await modal.loadSearchResults(query);

    //  4) render search recipes

    resultsView.render(modal.state.search.results);
  } catch (err) {
    resultsView.render();
  }
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
