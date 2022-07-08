import icons from "../../img/icons.svg";

export default class View {
  _data;

  _clear() {
    this._parentEl.innerHTML = "";
  }

  render(data) {
    //checking for valid data
    console.log(!data || (Array.isArray(data) && data.length === 0));
    if (!data || (Array.isArray(data) && data.length === 0)) this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(errorMsg = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${errorMsg}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
