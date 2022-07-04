export const state = {
  recipe: {},
  search: {},
};

export const loadRecipe = async function (id) {
  const res = await fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message}`);

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
  console.log(state.recipe);
};
