const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ================== ADD TO CART ==================
router.post("/add", async (req, res) => {
  const { productId } = req.body;

  if (!req.session.cart) req.session.cart = [];

  const product = await Product.findById(productId);

  if (!product) return res.redirect("/");

  const exist = req.session.cart.find(
    item => item.product._id.toString() === productId
  );

  if (exist) {
    exist.quantity += 1;
  } else {
    req.session.cart.push({
      product,
      quantity: 1
    });
  }

  res.redirect("/cart");
});

// ================== XEM GIỎ HÀNG ==================
router.get("/", (req, res) => {
  const cart = req.session.cart || [];

  let total = 0;
  cart.forEach(item => {
    total += item.product.price * item.quantity;
  });

  res.render("pages/cart", {
    title: "Giỏ hàng",
    cart,
    total
  });
});
// ================== UPDATE QUANTITY ==================
router.post("/update", (req, res) => {
  const { productId, action } = req.body;

  if (!req.session.cart) return res.redirect("/cart");

  const item = req.session.cart.find(
    item => item.product._id.toString() === productId
  );

  if (!item) return res.redirect("/cart");

  if (action === "increase") {
    item.quantity++;
  } else if (action === "decrease") {
    item.quantity--;
    if (item.quantity <= 0) {
      req.session.cart = req.session.cart.filter(
        item => item.product._id.toString() !== productId
      );
    }
  }

  res.redirect("/cart");
});

module.exports = router;
