import View from "./view.js";
import icons from "url:../../img/icons.svg";

class paginationView extends View {
  _parentEl = document.querySelector(".pagination");
  _errorMessage = "No recipe found with this query! try another one";

  addHandlerClick(handler) {
    // using event delegation
    this._parentEl.addEventListener("click", function (e) {
      console.log(e.target);
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      //   const goto = btn.dataset.goto;
      const goto = +btn.getAttribute("data-goto");

      handler(goto);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //page 1, and there are other pages
    if (curPage === 1 && numPages > 1) return this._generateNextButton(curPage);

    //last page
    if (curPage === numPages && numPages > 1)
      return this._generatePrevButton(curPage);

    //any other page
    if (curPage < numPages) {
      return (
        this._generatePrevButton(curPage) + this._generateNextButton(curPage)
      );
    }

    //page 1, and no other pages
    return "";
  }

  _generateNextButton(curPage) {
    return `
        <button class="btn--inline pagination__btn--next" data-goto = "${
          curPage + 1
        }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
  }

  _generatePrevButton(curPage) {
    return `
            <button class="btn--inline pagination__btn--prev" data-goto = "${
              curPage - 1
            }" >
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>`;
  }
}

export default new paginationView();
