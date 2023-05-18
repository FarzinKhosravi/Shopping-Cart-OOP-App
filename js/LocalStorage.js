class LocalStorage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  static saveCart(cart) {
    localStorage.setItem("cart-products", JSON.stringify(cart));
  }

  static getCart() {
    return JSON.parse(localStorage.getItem("cart-products")) || [];
  }

  static removeCart(id, cartProducts) {
    const removeProduct = cartProducts.find((product) => product.id == id);

    cartProducts = cartProducts.filter(
      (product) => product.id !== removeProduct.id
    );

    LocalStorage.saveCart(cartProducts);
  }
}

export default LocalStorage;
