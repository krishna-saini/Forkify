import recipeView from "./views/recipeView.js";

import "regenerator-runtime/runtime"; // to polyfill async await
import "core-js/stable"; //to polyfill everthing else
import * as modal from "./modal.js";

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

const init = () => recipeView.addHandlerRender(controlRecipes);

init();
