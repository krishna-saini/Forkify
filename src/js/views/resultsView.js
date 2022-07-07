import icons from "url:../../img/icons.svg";
import View from "./View.js";

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
    return `
     <li class="preview">
        <a class="preview__link " href="#${result.id}">
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
