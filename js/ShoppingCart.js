import Products from "./Products.js";
import localStorage from "./LocalStorage.js";

// Selectors :

const productsContainer = document.querySelector(".container-products");
const cart = document.querySelector(".nav__icon");
const cartProductsWrapper = document.querySelector(".cart__products-wrapper");
const counter = document.querySelector(".nav__cart-counter");
const totalPriceCart = document.querySelector(".cart__price-numerical-value");
const cartConfirmBtn = document.querySelector(".cart__confirm-btn");
const cartClearBtn = document.querySelector(".cart__clear-btn");

const cartModal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");

let cartProducts = [];

// Classes :

class UI {
  constructor() {
    cartConfirmBtn.addEventListener("click", this.cartConfirm);
    cartClearBtn.addEventListener("click", this.cartClear);
  }

  setupApp() {
    cartProducts = localStorage.getCart();
    this.cartProductsDOM(cartProducts);
    UI.setCartAmount(cartProducts);
  }

  disabledButtonsDOM() {
    const addProductBtns = [
      ...productsContainer.querySelectorAll(".product-card__btn"),
    ];

    cartProducts = localStorage.getCart();

    cartProducts.forEach((product) => {
      const id = product.id;

      const disabledButtons = addProductBtns.filter(
        (btn) => btn.dataset.id == id
      );

      disabledButtons.forEach((btn) => {
        btn.disabled = true;
        btn.lastElementChild.textContent = "In Cart";
      });
    });
  }

  cartProductsDOM(cart) {
    cart.forEach((product) => {
      const cartProduct = document.createElement("div");
      cartProduct.classList.add("cart__product-card");
      cartProduct.setAttribute("data-id", `${product.id}`);

      const cartProductHTML = `
            <div class="cart__product-image-wrapper">
            <img
              class="cart__product-image"
              src=${product.imageURLJpeg}
              alt="product card 01"
            />
          </div>
          <div class="cart__product-specs">
            <span class="cart__title">${product.title}</span>
            <span class="cart__price">${product.price}</span>
          </div>
          <div class="cart__product-quantity">
            <span class="cart__increment-icon" data-id="${product.id}">
              <i class="fas fa-chevron-up"></i>
            </span>
            <span class="cart__quantity">${product.quantity}</span>
            <span class="cart__decrement-icon" data-id="${product.id}">
              <i class="fas fa-chevron-down"></i>
            </span>
          </div>
          <div class="cart__product-delete">
            <span class="cart__remove-icon" data-id="${product.id}">
              <i class="fas fa-trash"></i>
            </span>
          </div>
            `;

      cartProduct.innerHTML = cartProductHTML;

      cartProductsWrapper.appendChild(cartProduct);
    });
  }

  showProductsDOM() {
    localStorage.saveProducts(Products);

    const products = localStorage.getProducts();

    products.forEach((productItem) => {
      const product = document.createElement("div");
      product.classList.add("product-card");

      const productHTML = `
          <div class="product-card__image">
          <picture>
            <source
              type="image/webp"
              srcset=${productItem.imageURLWebp}
            />
            <source
              type="image/jpeg"
              srcset=${productItem.imageURLJpeg}
            />
            <img
              src=${productItem.imageURLJpeg}
              alt="product card 01"
            />
          </picture>
        </div>
        <div class="product-card__specs">
          <span class="product-card__price">${productItem.price}</span>
          <span class="product-card__name">${productItem.title}</span>
        </div>
        <div class="product-card__add">
          <button type="button" class="product-card__btn" data-id="${productItem.id}">
            <span class="product-card__btn-icon">
              <i class="fas fa-cart-plus"></i>
            </span>
            <span class="product-card__btn-text"> add to cart </span>
          </button>
        </div>
          `;

      product.innerHTML = productHTML;

      productsContainer.appendChild(product);
    });
  }

  selectProductsButtons() {
    const addProductBtns = [
      ...productsContainer.querySelectorAll(".product-card__btn"),
    ];

    cartProducts = localStorage.getCart();

    addProductBtns.forEach((btn) => {
      const id = btn.dataset.id;
      btn.addEventListener("click", () => {
        this.disableProductButton(id);
        this.addProductToCart(id);
        UI.setCartAmount(cartProducts);
      });
    });
  }

  cartLogic() {
    cartProductsWrapper.addEventListener("click", (event) => {
      const classList = event.target.classList;
      const id = event.target.dataset.id;

      if (classList.contains("cart__increment-icon")) {
        this.productIncrementQuantity(id);
        cartProducts = localStorage.getCart();
        UI.setCartAmount(cartProducts);
      } else if (classList.contains("cart__decrement-icon")) {
        this.productDecrementQuantity(id);

        cartProducts = localStorage.getCart();
        const cartProduct = cartProducts.find((product) => product.id == id);

        UI.setCartAmount(cartProducts);

        if (cartProduct.quantity < 1) {
          this.enableProductButton(id);
          this.removeCartProduct(id);
          localStorage.removeCart(id, cartProducts);
        }
      } else if (classList.contains("cart__remove-icon")) {
        this.enableProductButton(id);
        this.productZeroQuantity(id);
        cartProducts = localStorage.getCart();
        UI.setCartAmount(cartProducts);
        this.removeCartProduct(id);
        localStorage.removeCart(id, cartProducts);
      }
    });
  }

  static setCartAmount(cart) {
    let cartCounter = 0;

    const totalPrice = cart.reduce((acc, curr) => {
      cartCounter += curr.quantity;
      return curr.quantity * curr.price + acc;
    }, 0);

    totalPriceCart.textContent = totalPrice.toFixed(2);

    counter.innerHTML = cartCounter;
  }

  disableProductButton(id) {
    const addProductBtns = [
      ...productsContainer.querySelectorAll(".product-card__btn"),
    ];

    const selectedButton = addProductBtns.find((btn) => btn.dataset.id == id);

    selectedButton.lastElementChild.textContent = "In Cart";

    selectedButton.disabled = true;
  }

  addProductToCart(id) {
    const products = localStorage.getProducts();

    const product = products.find((product) => product.id == id);

    cartProducts = localStorage.getCart();

    cartProducts = cartProducts.filter((product) => product.quantity !== 0);

    // Added Product To Cart :
    const addedProduct = { ...product, quantity: 1 };

    // Products in Cart :
    cartProducts = [...cartProducts, addedProduct];

    const cartProduct = document.createElement("div");
    cartProduct.classList.add("cart__product-card");
    cartProduct.setAttribute("data-id", `${product.id}`);

    const cartProductHTML = `
          <div class="cart__product-image-wrapper">
          <img
            class="cart__product-image"
            src=${addedProduct.imageURLJpeg}
            alt="product card 01"
          />
        </div>
        <div class="cart__product-specs">
          <span class="cart__title">${addedProduct.title}</span>
          <span class="cart__price">${addedProduct.price}</span>
        </div>
        <div class="cart__product-quantity">
          <span class="cart__increment-icon" data-id="${addedProduct.id}">
            <i class="fas fa-chevron-up"></i>
          </span>
          <span class="cart__quantity">${addedProduct.quantity}</span>
          <span class="cart__decrement-icon" data-id="${addedProduct.id}">
            <i class="fas fa-chevron-down"></i>
          </span>
        </div>
        <div class="cart__product-delete">
          <span class="cart__remove-icon" data-id="${addedProduct.id}">
            <i class="fas fa-trash"></i>
          </span>
        </div>
          `;

    cartProduct.innerHTML = cartProductHTML;

    cartProductsWrapper.appendChild(cartProduct);

    localStorage.saveCart(cartProducts);
  }

  cartConfirm() {
    alert("Thank you for your purchase :)");
    CartModal.hideCartModal();
  }

  cartClear() {
    cartProducts = localStorage.getCart();
    cartProducts = [];

    UI.enableProductsButtons();
    UI.setCartAmount(cartProducts);
    UI.clearCartProducts();
    localStorage.saveCart(cartProducts);
  }

  static enableProductsButtons() {
    const textProductBtns = [
      ...document.querySelectorAll(".product-card__btn-text"),
    ];

    const addProductBtns = [...document.querySelectorAll(".product-card__btn")];

    textProductBtns.forEach((btn) => {
      btn.textContent = "add to cart";
    });

    addProductBtns.forEach((btn) => {
      btn.disabled = false;
    });
  }

  static clearCartProducts() {
    cartProductsWrapper.innerHTML = "";
  }

  productIncrementQuantity(id) {
    const productsCart = [
      ...cartProductsWrapper.querySelectorAll(".cart__product-card"),
    ];

    const cartProduct = productsCart.find(
      (product) => product.dataset.id == id
    );

    const cartProductCounter = cartProduct.querySelector(".cart__quantity");

    cartProducts = localStorage.getCart();
    const product = cartProducts.find((product) => product.id == id);

    product.quantity++;

    localStorage.saveCart(cartProducts);

    cartProductCounter.textContent = product.quantity;
  }

  productDecrementQuantity(id) {
    const productsCart = [
      ...cartProductsWrapper.querySelectorAll(".cart__product-card"),
    ];

    const product = productsCart.find((product) => product.dataset.id == id);

    const cartProductCounter = product.querySelector(".cart__quantity");

    cartProducts = localStorage.getCart();
    const cartProduct = cartProducts.find((product) => product.id == id);

    cartProduct.quantity--;

    localStorage.saveCart(cartProducts);

    cartProductCounter.textContent = cartProduct.quantity;
  }

  removeCartProduct(id) {
    const cartProducts = [...cartProductsWrapper.children];

    const cartProduct = cartProducts.find(
      (product) => product.dataset.id == id
    );

    cartProduct.remove();
  }

  enableProductButton(id) {
    const productBtns = [
      ...productsContainer.querySelectorAll(".product-card__btn"),
    ];

    const productBtn = productBtns.find((btn) => btn.dataset.id == id);

    productBtn.disabled = false;

    productBtn.lastElementChild.textContent = "add to cart";
  }

  productZeroQuantity(id) {
    cartProducts = localStorage.getCart();

    const cartProduct = cartProducts.find((product) => product.id == id);

    cartProduct.quantity = 0;

    localStorage.saveCart(cartProducts);
  }
}

class CartModal {
  constructor() {
    cart.addEventListener("click", this.showCartModal);
    backdrop.addEventListener("click", CartModal.hideCartModal);
  }

  showCartModal() {
    cartModal.style.opacity = "1";
    cartModal.style.top = "20%";

    backdrop.style.display = "block";
  }

  static hideCartModal() {
    cartModal.style.opacity = "0";
    cartModal.style.top = "-140%";

    backdrop.style.display = "none";
  }
}

export default new UI();

export { CartModal };
