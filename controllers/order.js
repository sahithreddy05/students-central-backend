const Order = require("../models/order");
exports.createOrder = (req, res) => {
  let orderid = req.order.oid;
  let d = req.order.des;
  let l = d.split(",");
  let a = l[l.length - 3];
  let uid = l[l.length - 1];
  l = l.slice(0, l.length - 4);
  const ord = { items: l, total: a, user_id: uid, payment_id: orderid };
  console.log(ord);
  const order = new Order(ord);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save Item in DB check for duplicates.",
      });
    }
    console.log(order);
  });
};

exports.getItemById = (req, res, next, id) => {
  Order.findById(id).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: "Order Not Found in DB",
      });
    }
    req.order = item;
    next();
  });
};

exports.getIndividualOrder = (req, res) => {
  res.status(200).json(req.order);
};

exports.getOrdersOfUser = (req, res) => {
  Order.find({ user_id: req.profile._id })
    .sort({ date: -1 })
    .then((Orders) => {
      fetchedOrders = Orders;
      res.status(200).json({
        message: "Orders Fetched Successfully",
        Orders: fetchedOrders,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No orders found!",
      });
    });
};

exports.updateOrder = (req, res) => {
  const order = req.order;
  order.status = true;
  order.save((err, updatedOrder) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to deliver order",
      });
    }
    res.json(updatedOrder);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .sort({ date: -1 })
    .exec((err, item) => {
      if (err || !item) {
        return res.status(400).json({
          error: "Order Not Found in DB",
        });
      }
      res.status(200).json(item);
    });
};
