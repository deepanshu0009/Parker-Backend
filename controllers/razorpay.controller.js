const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay instance
const instance = new Razorpay({
  key_id: "rzp_test_ZDKLvpt3QrKHB9", // Replace with your Razorpay Key ID
  key_secret: "MbzIoj79LfAjsdW30oDiaO3L", // Replace with your Razorpay Secret
});

// Create Order
async function Order(req, resp) {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        key1: "value1",
        key2: "value2",
      },
    };

    const order = await instance.orders.create(options);
    resp.json({ status: true, order, message: "Order created successfully" });
  } catch (err) {
    console.error("Error creating order:", err);
    resp.json({ status: false, err, message: "Order creation failed" });
  }
}

// Verify Payment
async function Paymentverify(req, resp) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "MbzIoj79LfAjsdW30oDiaO3L") // Replace with your Razorpay Secret
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      resp.json({ status: true, message: "Payment verified successfully" });
    } else {
      resp.status(400).json({ status: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    resp.status(500).json({ status: false, message: "Payment verification failed" });
  }
}

module.exports = { Order, Paymentverify };