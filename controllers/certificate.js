const Certificate = require("../models/certificate");
const formidable = require("formidable");
const imgbb = require("imgbb-uploader");

exports.postCertificate = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem With Image",
      });
    }
    //Destructure: fields
    const { event_name } = fields;

    if (!event_name) {
      return res.status(400).json({
        error: "Please include all the fields",
      });
    }
    let certificate = new Certificate(fields);
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
          certificate.image_url = res1.display_url;
          console.log(certificate);
          certificate.save((err, item) => {
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
      certificate.save((err, item) => {
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

exports.getCertsInd = (req, res) => {
  Certificate.find({ user_id: req.profile._id })
    .sort({ date: -1 })
    .then((Certificates) => {
      fetchedCerts = Certificates;
      res.status(200).json({
        message: "Certificates Fetched Successfully",
        Certificates: fetchedCerts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No items found!",
      });
    });
};

exports.getCertsByRoll = (req, res) => {
  Certificate.find({ user_id: req.cert._id })
    .sort({ date: -1 })
    .then((Certificates) => {
      fetchedCerts = Certificates;
      res.status(200).json({
        message: "Certificates Fetched Successfully",
        Certificates: fetchedCerts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No items found!",
      });
    });
};

exports.getAllCerts = (req, res) => {
  Certificate.find()
    .sort({ date: -1 })
    .then((Certificates) => {
      fetchedCerts = Certificates;
      res.status(200).json({
        message: "Certificates Fetched Successfully",
        Certificates: fetchedCerts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No items found!",
      });
    });
};
