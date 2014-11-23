describe("Cart", function() {

  var shoppingCart,
    productModels,
    products = [ //example products
          { id : "23fdw", name : "Cotton T-Shirt", price : 1.99, size : "Medium"},
          { id : "ad44f", name : "Baseball Cap", price : 2.99, size : "One Size"},
          { id : "vbr4", name : "Swim Shorts", price : 3.99, size : "Medium"}
        ];

  beforeEach(function() {
    shoppingCart = new Cart();
    productModels = [];
    for (var i in products) {
      var index = productModels.push(new Product(products[i]));
    }
    shoppingCart.reset();
  });

  it("should add a product", function() {
    var productAdded = shoppingCart.add(productModels[0]);
    expect(productAdded).toEqual(true);
    shoppingCart.remove(productModels[0].id);
  });

  it("should throw exception for erroneous product", function() {
    expect(shoppingCart.add).toThrow();
  });

  it("should remove a product", function() {
    shoppingCart.add(productModels[0]);
    var productRemoved = shoppingCart.remove(productModels[0].id);
    expect(productRemoved).toEqual(true);
  });

  it("should reset the cart", function() {
    shoppingCart.add(productModels[0]);
    shoppingCart.add(productModels[0]);
    shoppingCart.add(productModels[1]);
    var size = shoppingCart.reset();
    expect(size).toEqual(0);
  });

  it("should return total price", function() {
    shoppingCart.add(productModels[0]);
    shoppingCart.add(productModels[1]);
    var total = shoppingCart.getTotal();
    expect(total).toEqual(4.98);
  });

  it("should return the number of items in cart", function () {
    shoppingCart.add(productModels[0]);
    shoppingCart.add(productModels[0]);
    shoppingCart.add(productModels[0]);
    shoppingCart.add(productModels[1]);
    shoppingCart.add(productModels[1]);
    shoppingCart.add(productModels[2]);
    expect(shoppingCart.length()).toEqual(6);
  });

});