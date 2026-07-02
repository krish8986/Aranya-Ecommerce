import Razorpay from 'razorpay';

export const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: Number(req.body.amount) * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(2, 15),
    };

    instance.orders.create(options, (err, order) => {
      if (err) return res.status(500).send({ success: false, err });
      res.status(200).send({
        success: true,
        order,
      });
    });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};
