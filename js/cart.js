/**
* Shopping cart singleton constructor. Creating a singleton shopping cart as we only need one.
* @returns instance of Cart
*/
var Cart = (function () {
    "use strict";
    var instance, // The "private" instance
        items = [], //products added to cart
        discountId = "JHKDF", //of course wouldn't do this for real, would be a server call
        discount = 15, //if discount is applied it will be in %

        /**
        * Dynamic functions we use to calculate total. Calculation is different if a valid discount id is used.
        */
        getTotal = function () {
            var i, //iterator
                total = 0;
            if (items.length > 0) {
                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        if (items[i].price) {
                            total += Math.round((items[i].price * items[i].count) * 100) / 100;
                        }
                    }
                }
            }
            return total;
        },
        discountTotal = function () {
            var i, //iterator
                total = 0;
            if (items.length > 0) {
                for (i in items) {
                    if (items.hasOwnProperty(i)) {
                        total += (items[i].price * items[i].count);
                    }
                }
            }
            return Math.round((total - (this.discount / 100) * total) * 100) / 100;
        };

    // The constructor
    function Cart() {

        //items = [], //array for products (items)
        this.total = 0; //default total
        this.cartObservers = []; //we want to send updates if cart changes

        // If it's being called again, return the singleton instance
        if (instance === undefined) {
            return instance;
        }
        //set instance as this
        instance = this;
    }

    /**
    * Get the total number of items in the cart
    * @returns int number of items in cart
    */
    Cart.prototype.length = function () {
        var total = 0, i;
        for (i in items) {
            if (items.hasOwnProperty(i)) {
                total += items[i].count;
            }
        }
        return total;
    };

    /**
    * Remove all products from the cart
    * @returns int number of items in cart
    */
    Cart.prototype.reset = function () {
        items = [];
        return items.length;
    };

    /**
    * Add an item to the shopping cart by name. If the same item exists, increment the count
    * @param either an object or a string
    * @returns boolean if operation was successful
    */
    Cart.prototype.add = function (item) {

        var i, //iterator
            result = false;
        if (typeof item === "object") {

            //if item already added, increment count
            for (i in items) {
                if (items.hasOwnProperty(i)) {
                    if (items[i].name === item.name) {
                        items[i].count += 1;
                        result = true;
                    }
                }
            }

            if (!result) {
                item.count = 1;
                items.push(item);
                result = true;
            }

        } else {
            throw "Item is not a valid item";
        }

        //if a listener is set up, notify it
        if (typeof this.render === "function") {
            this.render();
        }

        return result;
    };

    /**
    * Remove an item to the shopping cart by name
    * @param string, name of item
    * @returns boolean if operation was successful
    */
    Cart.prototype.remove = function (id) {

        var i, //iterator
            result = false;

        for (i in items) {
            if (items.hasOwnProperty(i)) {
                if (items[i].id === id) {
                    if (items[i].count > 0) { //if there is more than one, just reduce count
                        items[i].count -= 1;
                        result = true;
                    } else {
                        items.splice(i, i);
                        result = true;
                    }
                    break;
                }
            }
        }

        if (typeof this.render === "function") {
            this.render();
        }

        return result;
    };

    /**
    * Calculate total
    * @returns number, the total of shopping basket
    */
    Cart.prototype.getTotal = getTotal;

    /**
    * Apply a discount code
    * @returns boolean
    */
    Cart.prototype.applyDiscount = function (code) {
        if (code === discountId) {
            //set discount
            this.discount = discount;
            //set function to calculate total
            Cart.prototype.getTotal = discountTotal;
            return true;
        }
        return false;
    };

    /**
    * Resets discount code
    * @returns boolean
    */
    Cart.prototype.resetDiscount = function () {
        Cart.prototype.getTotal = getTotal;
    };

    /**
    * Render the state of the cart in html
    * @param dom element to update
    * @returns boolean
    */
    Cart.prototype.addListener = function (el) {

        var self = this;
        if (typeof el !== "object") {
            throw "No dom element specified";
        }

        /**
        * Render the state of the cart in html
        * @param dom element to update
        * @returns boolean
        */
        Cart.prototype.render = (function (el) {
            return function () {
                var html = "", i;
                html += '<h1>Your cart</h1>';
                html += '<h2>Products</h2>';
                html += '<ul id="productList">';
                for (i in self.items) {
                    if (self.items.hasOwnProperty(i)) {
                        html += '<li>' + self.items[i].name;
                        html += '<span class="count">' + self.items[i].count + '</span>';
                        html += '<span class="price">' + self.items[i].price + '</span>';
                        html += '<span class="totalPrice">';
                        html += self.items[i].count + ' x ' + self.items[i].price + '</span>' + '</li>';
                    }
                }
                html += '</ul>';
                html += '<p>Total: <span id="total">' + self.getTotal() + '</span></p>';
                el.innerHTML = html;
            };
        }(el));

        this.render();
    };

    // Return the constructor
    return Cart;

}());

/**
* Product object
* @param data object to clone
*/
function Product() {
    "use strict";
    var i, j;
    if (arguments.length > 0) {
        for (i in arguments) {
            if (arguments.hasOwnProperty(i)) {
                if (typeof arguments[i] === "object") {
                    for (j in arguments[i]) {
                        if (arguments[i].hasOwnProperty(j)) {
                            this[j] = arguments[i][j];
                        }
                    }
                } else {
                    this[i] = arguments[i];
                }
            }
        }
    } else {
        throw "You must initialise the product";
    }
}

/**
* Render data as html
* @param data object to clone
* @returns string of html content
*/
Product.prototype.render = function () {
    "use strict";
    var htmlString = "";
    //for now just assume name is there
    htmlString += '<div data-domid="' + this.id + '">';
    htmlString += "<h1>" + this.name + "</h1>";
    htmlString += "<p>Price: " + this.price + "</p>";
    htmlString += "<ul>";
    htmlString += "<li>Size: " + this.size + "</li>";
    htmlString += "<li>Colour: " + this.colour + "</li>";
    htmlString += "</ul>";
    htmlString += '<div class="cartAdmin">';
    if (this.count) {
        htmlString += "<p>" + this.count + "</p>";
    }
    htmlString += '<button class="addToCart" data-id="' + this.id + '">Add to cart</button>';
    if (this.count) {
        htmlString += '<button class="removeFromCart" data-id="' + this.id + '">Remove from cart</button>';
    }
    htmlString += "</div>";
    htmlString += "</div>";
    return htmlString;
};