import icons from "url:../img/icons.svg";
import "regenerator-runtime/runtime"; // to polyfill async await
import "core-js/stable"; //to polyfill everthing else

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderSpinner = function (parentEl) {
  // console.log("spinning");
  const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", markup);
};

async function fetchingRecipe() {
  try {
    // 0)laoding spinner
    renderSpinner(recipeContainer);

    //fetching hash id of recipe
    const hashId = window.location.hash.slice(1);
    console.log(hashId);
    //guard clause
    if (!hashId) return;
    //1) laoding recipe
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${hashId}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}`);

    const { recipe } = data.data;

    const modifiedRecipe = {
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      image: recipe.image_url,
    };

    // 2)rendering recipe
    const markup = `
      <figure class="recipe__fig">
        <img src=${modifiedRecipe.image} alt=${
      modifiedRecipe.title
    } class="recipe__img" />
        <h1 class="recipe__title">
          <span>${modifiedRecipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            modifiedRecipe.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">4</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${modifiedRecipe.ingredients
          .map((ing) => {
            return `<li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>`;
          })
          .join("")}
          

          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">0.5</div>
            <div class="recipe__description">
              <span class="recipe__unit">cup</span>
              ricotta cheese
            </div>
          </li>
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            modifiedRecipe.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href=${modifiedRecipe.sourceUrl}
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;

    recipeContainer.innerHTML = " ";

    recipeContainer.insertAdjacentHTML("afterbegin", markup);
  } catch (err) {
    alert(err);
  }
}

["hashchange", "load"].map((event) =>
  window.addEventListener(event, fetchingRecipe)
);

// window.addEventListener("hashchange", fetchingRecipe);
// window.addEventListener("load", fetchingRecipe);
// fetchingRecipe();
