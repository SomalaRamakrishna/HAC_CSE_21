const express = require("express");
const { createOrder, verifyOrder } = require("../controllers/rozoorpayController");
const { protect } = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/",protect,createOrder);
router.post("/verify-payment",protect,verifyOrder);

module.exports = router;
