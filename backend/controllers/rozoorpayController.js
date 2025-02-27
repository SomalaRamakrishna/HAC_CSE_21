const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder= async (req, res) => {
  try {
    console.log("entered");
    const { amount } = req.body;
    console.log("amount:",amount);
    const options = {
      amount: amount * 100, // Convert INR to Paisa (Razorpay uses smallest currency unit)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    console.log("order:",order);
    res.json(order);
  } catch (error) {
    console.log("error occurred");
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
};

// Verify Payment API
const verifyOrder= async (req, res) => {
  try {
    console.log("entered for verification");
    const { razorpay_order_id, razorpay_payment_id,razorpay_signature } = req.body;

    // Dummy Alumni Verification Logic (Save this to DB)
    console.log(`Alumni ${razorpay_signature} verified with payment ID: ${razorpay_payment_id}`);

    res.json({ message: "Payment Verified. Alumni Status Updated." ,success:true});
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
module.exports = { createOrder,verifyOrder };
