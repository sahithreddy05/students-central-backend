const Item = require("../models/item");
const formidable = require("formidable");
const imgbb = require("imgbb-uploader");
const env = require('dotenv').config();

exports.postItem = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;


  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Incompatible Image",
      });
    }
    //Destructure: fields
    const {
      item_description,
      user_Posted,
      posted_username,
      posted_userphone,
      place,
      photo,
      lost_found
    } = fields;

    if (!item_description || !place) {
      return res.status(400).json({
        error: "Please include all the fields",
      });
    }

    let item = new Item(fields);
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
    }
    else {
      return res.status(400).json({
        error: "Picture of the item is mandatory",
      });
    }
  });
};

exports.getItemById = (req, res, next, id) => {
  Item.findById(id).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: "Item Not Found in DB",
      });
    }
    req.item = item;
    next();
  });
};

exports.getLostItems = (req, res, next) => {
  Item.find({ lost_found: 1 }).sort({ data: -1 })
    .then((Items) => {
      fetchedItem = Items;
      return Item.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Items Fetched Successfully",
        Items: fetchedItem,
        maxItems: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No Items Found!!",
      });
    });
};

exports.getFoundItems = (req, res, next) => {
  Item.find({ lost_found: 0 }).sort({ data: -1 })
    .then((Items) => {
      fetchedItem = Items;
      return Item.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Items Fetched Successfully",
        Items: fetchedItem,
        maxItems: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No Items Found!!",
      });
    });
};


exports.deleteItem = (req, res) => {
  console.log(req.item);
  Item.deleteOne({ _id: req.item._id })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: "Deletion successful!!",
        });
      } else {
        res.status(401).json({
          message: "Unauthorized Access!!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occurred while deleting Item!",
      });
    });
};

exports.claimItem = (req, res) => {
  const item = req.item;
  item.item_status = 1;
  item.claimed_user = req.profile._id;
  item.claimed_username = req.profile.name;
  item.claimed_userphone = req.profile.phone;
  item.save((err, claimedItem) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to claim item",
      });
    }
    res.json(claimedItem);
  });
};

exports.unClaimItem = (req, res) => {
  const item = req.item;
  Item.update(
    { _id: item._id },
    {
      $unset: {
        claimed_user: "",
        claimed_username: "",
        claimed_userphone: ""
      },
      $set: { item_status: 0 }
    },
  ).exec((err, unclaimedItem) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to unclaim item",
      });
    }
    res.json(unclaimedItem);
  });
}
