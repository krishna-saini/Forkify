class SearchView {
  #parentEl = document.querySelector(".search");

  getQuery() {
    const query = this.#parentEl.querySelector(".search__field").value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentEl.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerHover(handler) {
    this.#parentEl.addEventListener("Mouseenter", function (e) {
      const btn = e.target.closest(". nav__btn--bookmarks");
      if (!btn) return;
      if (btn) handler();

      //   const goto = btn.dataset.goto;
      const goto = +btn.getAttribute("data-goto");

      handler(goto);
    });
  }
}

export default new SearchView();
