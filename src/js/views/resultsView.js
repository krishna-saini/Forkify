import icons from "url:../../img/icons.svg";
import View from "./view.js";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipe found with this query! try another one";

  _generateMarkup() {
    // return this._data.map(this._generatorMarkupPreview).join("");
    return this._data
      .map((result) => this._generatorMarkupPreview(result))
      .join("");
  }

  _generatorMarkupPreview(result) {
    //highlight selected recipe
    const id = window.location.hash.slice(1);

    return `
     <li class="preview">
        <a class="preview__link ${
          result.id === id ? "preview__link--active" : ""
        }" href="#${result.id}">
            <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}"/>
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
            </div>
        </a>
    </li>`;
  }
}

export default new ResultsView();
