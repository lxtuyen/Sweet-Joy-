const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Product = require("../models/Product");
const upload = require("../middlewares/uploadImage");

/* ===== DASHBOARD ===== */
router.get("/", async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.render("pages/admin/dashboard", {
    layout: "layouts/admin",
    title: "Admin Dashboard",
    totalOrders,
    totalProducts,
  });
});

/* ===== QUẢN LÝ ĐƠN HÀNG ===== */
router.get("/orders", async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .sort({ createdAt: -1 });

  res.render("pages/admin/orders", {
    layout: "layouts/admin",
    title: "Quản lý đơn hàng",
    orders,
  });
});

/* ===== CẬP NHẬT TRẠNG THÁI ĐƠN ===== */
router.post("/orders/:id/status", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    orderStatus: req.body.status,
  });

  res.redirect("/admin/orders");
});

/* ===== QUẢN LÝ SẢN PHẨM ===== */
router.get("/products", async (req, res) => {
  const products = await Product.find();

  res.render("pages/admin/products", {
    layout: "layouts/admin",
    title: "Quản lý sản phẩm",
    products,
  });
});

/* ===== THÊM SẢN PHẨM ===== */
router.get("/products/new", (req, res) => {
  res.render("pages/admin/product-form", {
    layout: "layouts/admin",
    title: "Thêm sản phẩm",
    product: null,
  });
});

router.post(
  "/products/new",
  upload.single("image"),
  async (req, res) => {
    const productData = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      image: req.file ? `/images/${req.file.filename}` : "",
    };

    await Product.create(productData);
    res.redirect("/admin/products");
  }
);

/* ===== SỬA SẢN PHẨM ===== */
router.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.render("pages/admin/product-form", {
    layout: "layouts/admin",
    title: "Cập nhật sản phẩm",
    product,
  });
});

router.post(
  "/products/:id/edit",
  upload.single("image"),
  async (req, res) => {
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
    };

    if (req.file) {
      updateData.image = `/images/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/products");
  }
);


/* ===== XÓA SẢN PHẨM ===== */
router.post("/products/:id/delete", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products");
});

module.exports = router;
