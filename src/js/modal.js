import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";

const parentEL = document.querySelector(".search-results");

//state contain all the data that we need to build our app
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
  },
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data.data.recipes.length);

    const { recipes } = data.data;

    state.search.results = recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
  } catch (err) {
    console.log("error in modal");
    throw err; //rethrowing error
  }
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
