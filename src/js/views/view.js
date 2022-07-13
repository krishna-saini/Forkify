import icons from "../../img/icons.svg";

export default class View {
  _data;

  _clear() {
    this._parentEl.innerHTML = "";
  }

  /**
   * render the recieved object
   * @params {object | objec[]} data - the data to be rendered (eg recipe)
   * @returns {undefined }
   * @this {object} View instance
   * @author Krishna Saini
   */
  render(data) {
    //checking for valid data

    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderError();
      return;
    }
    this._data = data;

    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * update part of the page, without rendering whole page
   * @params {object } data - the data to be rendered (eg recipe)
   * @returns {undefined }
   */
  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    //convert this html string to virtual DOM object
    const newDom = document.createRange().createContextualFragment(markup);
    //extracting all elements from virtual dom
    const newDomElements = [...newDom.querySelectorAll("*")];

    //get real DOM
    const currentDomElements = [...this._parentEl.querySelectorAll("*")];

    newDomElements.forEach((newEl, i) => {
      const currentEl = currentDomElements[i];
      // console.log(currentEl, newEl.isEqualNode(currentEl));
      //updates changed text
      if (
        !newEl.isEqualNode(currentEl) && //compare content of virtualDOMEl with RealDOMel
        newEl.firstChild?.nodeValue.trim() !== "" //checking content of first chile(text node) is not empty
      ) {
        // console.log("💥💥💥💥", newEl.firstChild?.nodeValue.trim());
        currentEl.textContent = newEl.textContent;
      }

      //updates changed attributes too
      if (!newEl.isEqualNode(currentEl)) {
        // console.log(newEl, newEl.attributes);
        Array.from(newEl.attributes).forEach((attr) => {
          currentEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  /**
   * render spinner functionality while data is fetching
   * @returns {undefined }
   */
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

  /**
   * render error message if any while fetching data
   * @param {string} msg=this._errorMessage - msg to be displayed if error occurs
   * @returns {undefined }
   */
  renderError(msg = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${msg}</p>
  </div>`;

    this._clear();

    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * render success message  while fetching data
   * @param {string} msg=this._successMessage - msg to be displayed if data fetched successfully
   * @returns {undefined }
   */
  renderMessage(msg = this._successMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${msg}</p>
  </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
