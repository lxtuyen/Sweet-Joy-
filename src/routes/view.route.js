const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Orders");

/* ================= TRANG CHỦ ================= */
router.get("/", async (req, res) => {
  try {
    const birthdayCakes = await Product.find({
      category: "Bánh sinh nhật",
    }).limit(4);

    const savoryBreads = await Product.find({
      category: "Bánh mì-bánh mặn",
    }).limit(4);

    const cookiesMini = await Product.find({
      category: "Cookie & minicake",
    }).limit(4);

    res.render("pages/home", {
      title: "Sweet Joy - Trang chủ",
      birthdayCakes,
      savoryBreads,
      cookiesMini,
    });
  } catch (error) {
    res.status(500).send("Lỗi load trang chủ");
  }
});
/* ================== Đăng kí ================== */

router.get("/register", (req, res) => {
  res.render("pages/register", {
    title: "Đăng ký - Sweet Joy",
  });
});

/* ================== LOGIN ================== */
router.get("/login", (req, res) => {
  res.render("pages/login", {
    title: "Đăng nhập - Sweet Joy",
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
    products,
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
  cart.forEach((item) => {
    total += item.product.price * item.quantity;
  });

  res.render("pages/cart", {
    title: "Giỏ hàng",
    cart,
    total,
  });
});
/* ================= TRANG PROMOTION ================= */
// Route hiển thị trang khuyến mãi
router.get("/promotion", (req, res) => {
  res.render("pages/promotion", {
    title: "Chương trình Khuyến mãi",
  });
});

router.get("/checkout/success", (req, res) => {
  res.render("pages/checkout-success", {
    title: "Xác nhận mua thành công",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get("/checkout", async (req, res) => {
  const userId = req.session.userId;
  const cart = req.session.cart || [];

  // chưa login → login trước
  if (!userId) {
    return res.redirect("/login");
  }

  // cart rỗng → quay lại giỏ
  if (cart.length === 0) {
    return res.redirect("/cart");
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = new Order({
    userId,
    items: cart.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    })),
    totalAmount,
    paymentMethod: "COD",
    paymentStatus: "pending",
    orderStatus: "pending",
  });

  await order.save();

  // clear cart sau khi đặt hàng
  req.session.cart = [];

  res.redirect("/checkout/success");
});

/* ================= DANH SÁCH ĐƠN HÀNG ================= */
router.get("/orders", async (req, res) => {
  const userId = req.session.userId;

  // chưa login → login
  if (!userId) {
    return res.redirect("/login");
  }

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // mới nhất lên trước

    res.render("pages/orders", {
      title: "Đơn hàng của tôi",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi load đơn hàng");
  }
});

/* ================= TÌM KIẾM SẢN PHẨM ================= */
router.get("/search", async (req, res) => {
  const keyword = req.query.q?.trim();

  if (!keyword) {
    return res.render("pages/search", {
      title: "Tìm kiếm",
      products: [],
      keyword: "",
    });
  }

  try {
    const products = await Product.find({
      name: { $regex: keyword, $options: "i" }, // không phân biệt hoa thường
    });

    res.render("pages/search", {
      title: `Kết quả tìm kiếm: ${keyword}`,
      products,
      keyword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi tìm kiếm");
  }
});

/* ================= EXPORT (LUÔN Ở CUỐI) ================= */
module.exports = router;
