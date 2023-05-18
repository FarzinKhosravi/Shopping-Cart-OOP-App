import ui, { CartModal } from "./ShoppingCart.js";

document.addEventListener("DOMContentLoaded", () => {
  new CartModal();

  // Sets values of the cart that already exist :
  ui.setupApp();

  ui.showProductsDOM();

  // Buttons that were disabled before, will remain disabled after the program is loaded :
  ui.disabledButtonsDOM();

  ui.selectProductsButtons();

  // Action to increase, decrease and remove products in the cart :
  ui.cartLogic();
});
