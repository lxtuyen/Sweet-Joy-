const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Orders.controller");
const auth = require("../middlewares/isAdmin");

router.post("/", auth, orderController.createOrder);
router.get("/my-orders", auth, orderController.getOrdersByUser);

module.exports = router;
