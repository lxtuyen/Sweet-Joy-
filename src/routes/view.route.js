const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/* ================= TRANG CHỦ ================= */
router.get("/", async (req, res) => {
  try {
    const birthdayCakes = await Product.find({
      category: "Bánh sinh nhật"
    }).limit(4);

    const savoryBreads = await Product.find({
      category: "Bánh mì-bánh mặn"
    }).limit(4);

    const cookiesMini = await Product.find({
      category: "Cookie & minicake"
    }).limit(4);

    res.render("pages/home", {
      title: "Sweet Joy - Trang chủ",
      birthdayCakes,
      savoryBreads,
      cookiesMini
    });
  } catch (error) {
    res.status(500).send("Lỗi load trang chủ");
  }
});
/* ================== Đăng kí ================== */

router.get("/register", (req, res) => {
  res.render("pages/register", {
    title: "Đăng ký - Sweet Joy"
  });
});

/* ================== LOGIN ================== */
router.get("/login", (req, res) => {
  res.render("pages/login", {
    title: "Đăng nhập - Sweet Joy"
  });
});

/* ================= TRANG DANH MỤC ================= */
router.get("/category/:slug", async (req, res) => {
  let categoryName = "";

  if (req.params.slug === "banh-sinh-nhat") {
    categoryName = "Bánh sinh nhật";
  } else if (req.params.slug === "banh-mi-banh-man") {
    categoryName = "Bánh mì-bánh mặn";
  } else if (req.params.slug === "cookie-minicake") {
    categoryName = "Cookie & minicake";
  }

  const products = await Product.find({ category: categoryName });

  res.render("pages/category", {
    title: categoryName,
    products
  });
});

/* ================= CHI TIẾT SẢN PHẨM ================= */
router.get("/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("pages/product-detail", { product });
});

/* ================= THÊM VÀO GIỎ HÀNG ================= */
router.get("/cart", (req, res) => {
  const cart = req.session?.cart || [];

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
/* ================= TRANG PROMOTION ================= */
// Route hiển thị trang khuyến mãi
router.get("/promotion", (req, res) => {
    res.render("pages/promotion", {
        title: "Chương trình Khuyến mãi"
    });
});
/* ================= EXPORT (LUÔN Ở CUỐI) ================= */
module.exports = router;
