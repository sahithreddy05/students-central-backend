const Notification = require("../models/notification");
const formidable = require("formidable");
const imgbb = require("imgbb-uploader");

exports.postNotification = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem With Image",
      });
    }
    //Destructure: fields
    const { title, description, photo } = fields;

    if (!title || !description) {
      return res.status(400).json({
        error: "Please include all the fields",
      });
    }
    let notification = new Notification(fields);
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
          notification.image_url = res1.display_url;
          console.log(notification);
          notification.save((err, item) => {
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
      notification.save((err, item) => {
        if (err) {
          res.status(400).json({
            error: "Save failed!",
          });
        }
        res.json(item);
      });
    }
  });
};

exports.getAllNotifications = (req, res) => {
  Notification.find()
    .sort({ data: -1 })
    .then((Notifications) => {
      fetchedItem = Notifications;
      return Notification.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Notifications Fetched Successfully",
        Items: fetchedItem,
        maxItems: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No Notifications Found!!",
      });
      console.log(err);
    });
};

exports.getNotificationById = (req, res, next, id) => {
    Notification.findById(id).exec((err, item) => {
      if (err || !item) {
        return res.status(400).json({
          error: "Notification Not Found in DB",
        });
      }
      req.notification = item;
      next();
    });
  };

exports.deleteNotification = (req, res) => {
  console.log(req.notification);
  Notification.deleteOne({ _id: req.notification._id })
    .then((result) => {
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
