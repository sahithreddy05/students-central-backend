const FoodItem = require("../models/fooditem");
const formidable = require("formidable");
const imgbb = require("imgbb-uploader");

exports.postItem = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem With Image",
      });
    }
    //Destructure: fields
    const {
      title,
      description,
      available,
      delivery_time,
      price,
      photo,
    } = fields;

    if (!title || !description || !price) {
      return res.status(400).json({
        error: "Please include all the fields",
      });
    }
    let item = new FoodItem(fields);
    //handle file here
    if (file.photo) {
      console.log("entered");
      if (file.photo.size > 9000000) {
        return res.status(400).json({
          error: "File size too big. Should be below 9 MB",
        });
      }
      console.log(file.photo.path);
      imgbb(process.env.imgbb, file.photo.path)
        .then((res1) => {
          item.image_url = res1.display_url;
          console.log(item);
          item.save((err, item) => {
            if (err) {
              res.status(400).json({
                error: "Save failed!",
              });
            }
            res.json(item);
          });
        })
        .catch((err) => console.log(err));
    } else {
      return res.status(400).json({
        error: "Picture is mandatory",
      });
    }
  });
};

exports.getFoodItemById = (req, res, next, id) => {
  FoodItem.findById(id).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: "Item Not Found in DB",
      });
    }
    req.foodItem = item;
    next();
  });
};

exports.getFoodItems = (req, res) => {
  FoodItem.find()
    .then((FoodItems) => {
      res.status(200).json({
        message: "Items Fetched Successfully",
        FoodItems: FoodItems,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No Items Found!!",
      });
    });
};

exports.changeAvailability = (req, res) => {
  let v = req.foodItem.available;
  FoodItem.findByIdAndUpdate(req.foodItem._id, {
    available: !v,
  }).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: "Item Not Found in DB",
      });
    }
    return res.status(200).json(item);
  });
};

exports.resetDeliveryTime = (req, res) => {
  FoodItem.findByIdAndUpdate(
    req.foodItem._id,
    { delivery_time: 0 },
    (err, item) => {
      if (err || !item) {
        return res.status(400).json({
          error: "Item Not Found in DB",
        });
      } else {
        return res.status(200).json(item);
      }
    }
  );
};

exports.add3todelivery = (req, res, next) => {
  let time = req.foodItem.delivery_time + 3;
  let order = req.foodItem.orders + 1;
  FoodItem.findByIdAndUpdate(req.foodItem._id, {
    delivery_time: time,
    orders: order,
  }).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: "Item Not Found in DB",
      });
    }
    next();
  });
};

exports.remove3fromdelivery = (req, res, next) => {
  let time = req.foodItem.delivery_time - 3;
  let order = req.foodItem.orders - 1;
  FoodItem.findByIdAndUpdate(req.foodItem._id, {
    delivery_time: time,
    orders: order,
  }).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: "Item Not Found in DB",
      });
    }
    next();
  });
};
