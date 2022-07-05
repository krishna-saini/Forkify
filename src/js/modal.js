import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";

const parentEL = document.querySelector(".search-results");

export const state = {
  recipe: {},
  search: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;

    state.recipe = {
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      image: recipe.image_url,
    };

    // console.log(state.recipe);
  } catch (err) {
    // console.error(err.message);
    throw err; //rethrowin error
  }
};
