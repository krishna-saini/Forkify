import { API_URL, RESULTS_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helper.js";
import { isGeneratorFunction } from "regenerator-runtime";

const parentEL = document.querySelector(".search-results");

//state contain all the data that we need to build our app
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);
    // check if loaded recipe is alredy  in bookmark array
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    console.log(state.recipe);
  } catch (err) {
    console.error(err);
    throw err; //rethrowin error
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.page = 1; // to reset pagination from 1 on every search
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    const { recipes } = data.data;
    console.log(recipes);
    state.search.results = recipes.map((recipe) => {
      console.log(`"key:" ${recipe.key && recipe.key}`);
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    console.log(state.search.results);
  } catch (err) {
    console.log(err);
    throw err; //rethrowing error
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  console.log(state.search.results.slice(start, end));
  return state.search.results.slice(start, end);
};

export const updataServings = function (newServings = state.recipe.servings) {
  state.recipe.ingredients.forEach(
    (ing) =>
      (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // updating bookmarks in browser
  persistBookmark();
};

export const deleteBookmark = function (id) {
  //remove bookmark
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  console.log(state.bookmarks);
  // updating bookmarks in browser
  persistBookmark();
};

// clear all bookmarks -- for dev purpose only
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
  clearBookmarks();
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        (entry) => entry[0].trim().startsWith("ingredient") && entry[1] !== ""
      )
      .map((ing) => {
        const ingArr = ing[1].replaceAll(" ", "").split(",");
        //check proper formatiing
        if (ingArr.length !== 3)
          throw new Error(
            "wrong ingredient format! please use the correct format"
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // make formatted object ready to send to api
   const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      // ingredients: ingredients,
      ingredients,
    };
    
    console.log(recipe);

    //AJAX CALL TO SEND DATA
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // api will send data back along with id,  convert it to local format
    state.recipe = createRecipeObject(data);
    // bookmarked this recipe
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
  // console.log(Object.entries(newRecipe));
};
