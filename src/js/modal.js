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
    console.log(data);
    const { recipes } = data.data;
    console.log(recipes);

    state.search.results = recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    console.log(state.search.results);
  } catch (err) {
    throw err;
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
