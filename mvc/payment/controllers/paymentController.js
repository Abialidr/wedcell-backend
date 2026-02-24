// Razorpay relates code has been deprecated
const createCodOrder = async (req, res) => {
  const { price } = req.body;
  const { shipping } = req.body;
  const { tax } = req.body;
  console.log("cod", req.body);
  try {
    var options = {
      amount: (Number(price) + Number(shipping) + Number(tax)) * 100,
      currency: "INR",
    };
    if (req.body.itemId) {
      const { data } = await GetProducts({ variants: req.body.itemId });
      // console.log('DATA', data);
      req.body.price = undefined;
      req.body.shipping = Math.ceil(shipping * 100);
      req.body.tax = Math.ceil(tax * 100);
      // console.log('PID', data._id)
      const orderCreated = await CreateOrders({
        ...req.body,
        productId: data[0]._id,
        paymentInfo: "cod",
        status: "Pending",
        orderStatus: "Processing",
        paymentMode: "COD",
        zipcode: req.body.shippingAddress.pincode,
        shopkeeperId: data[0].vendorId,
        amount: Math.ceil((Number(price) + Number(tax)) * 100),
      });
      const sendMsg = await OrderSuccess(
        req.body.shippingAddress.number,
        orderCreated.data._id
      );
      console.log(sendMsg);
      const shipped = await createShipping(orderCreated.data, "COD");
      await UpdateOrders(
        { _id: orderCreated.data._id },
        { waybill: shipped.packages[0].waybill }
      );
      res.send({ data: orderCreated.data });
    } else if (req.body.cart) {
      (async () => {
        const orderPromises = req.body.cart.map(async (e, i) => {
          const { data } = await GetProducts({ variants: e.variantId });
          console.log("EEE", e);
          req.body.price = undefined;

          const abc = await CreateOrders({
            ...req.body,
            size: e.size,
            productId: data[0]._id,
            quantity: e.quantity,
            itemId: e.variantId,
            weight: e.weight,
            paymentInfo: "cod",
            status: "Pending",
            orderStatus: "Processing",
            paymentMode: "COD",
            zipcode: req.body.shippingAddress.pincode,
            shopkeeperId: data[0].vendorId,
            amount: Math.ceil(Number(e.price) * 1.12 * 100),
            tax: Math.ceil(Number(e.price) * 0.12 * 100),
            shipping: Math.ceil(req.body.cartCharges[i] * 100),
          });
          const shipped = await createShipping(abc.data, "COD");
          await UpdateOrders(
            { _id: abc.data._id },
            { waybill: shipped.packages[0].waybill }
          );
          const sendMsg = await OrderSuccess(
            req.body.shippingAddress.number,
            "from your Cart"
          );
          console.log(sendMsg);
          return abc;
        });

        const orderResults = await Promise.all(orderPromises);

        console.log("Order Results", orderResults);

        res.json(orderResults[0]);
      })();
    }
  } catch (error) {
    console.error(error);
  }
};
const creatOrder = async (req, res) => {
  res.status(400).json({ error: "Razorpay integration has been deprecated" });
};
const creatOrderOg = async (req, res) => {
  res.status(400).json({ error: "Razorpay integration has been deprecated" });
};
const webhook = async (req, res) => {
  res.status(400).json({ error: "Razorpay integration has been deprecated" });
};
const verifyOrder = async (req, res) => {
  res.json({
    success: true,
    status: 200,
  });
};

const cancelOrder = async (req, res) => {
  if (req.body.mode === "COD") {
    const order = await UpdateOrders(
      { _id: req.body.id },
      { status: "Refunded", orderStatus: "Cancelled" },
      { new: true }
    );
    const cancelshipping = await cancelShipping(order.data.waybill);
    console.log(cancelShipping);
    const sendMsg = await OrderCancel(
      order.data.shippingAddress.number,
      order.data._id
    );
    console.log(sendMsg);
    res.json({
      success: true,
      status: 200,
    });
  } else {
    const refund = await refundOrder(req.body.paymentId, req.body.amount);
    if (refund) {
      const order = await UpdateOrders(
        { _id: req.body.id },
        { status: "Refunded", orderStatus: "Refunded" },
        { new: true }
      );
      await cancelShipping(order.data.waybill);
      const sendMsg = await OrderCancel(
        order.data.shippingAddress.number,
        order.data._id
      );
      console.log(sendMsg);
      res.json({
        success: true,
        status: 200,
      });
    } else {
      res.json({
        success: false,
        status: 200,
      });
    }
  }
};
const refundOrder = async (paymentId, refundAmount) => {
  console.log("Razorpay integration has been deprecated");
  return false;
};

const getkeyId = async (req, res) => {
  res.status(400).json({ error: "Razorpay integration has been deprecated" });
};

module.exports = {
  getkeyId,
  verifyOrder,
  creatOrder,
  creatOrderOg,
  createCodOrder,
  webhook,
  cancelOrder,
};
