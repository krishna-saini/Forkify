import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";
import View from "./view.js";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errorMessage = " No bookmarks yet. Find a nice recipe and bookmark it :)";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data.map(this._generatorMarkupPreview).join("");
    // return this._data
    //   .map((bookmark) => this._generatorMarkupPreview(bookmark))
    //   .join("");
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
                  <div class="preview__user-generated ${
                    result.key ? "" : "hidden"
                  }">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
              </div>
        </a>
    </li>`;
  }
}

export default new BookmarksView();
