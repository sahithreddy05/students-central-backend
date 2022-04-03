const Complaint = require("../models/complaint");
const formidable = require("formidable");
const imgbb = require("imgbb-uploader");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

exports.postComplaint = (req, res) => {
  const oauth2Client = new OAuth2(
    process.env.clientId,
    process.env.clientSecret,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.refreshToken,
  });

  const accessToken = oauth2Client.getAccessToken();

  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "coding.cmrcet@gmail.com",
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      refreshToken: process.env.refreshToken,
      accessToken: accessToken,
    },
  });

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem With Image",
      });
    }
    const { title, description, photo, authority, posted_user } = fields;
    if (!title || !description || !authority) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }
    let complaint = new Complaint(fields);
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
          complaint.image_url = res1.display_url;
          console.log(complaint);
          complaint.save((err, comp) => {
            if (err) {
              res.status(400).json({
                error: "Save failed!",
              });
            }
            const mailOptions = {
              from: "coding.cmrcet@gmail.com",
              to: "manishreddy2000n@gmail.com",
              subject: `${comp.title}`,
              generateTextFromHTML: true,
              html: `<b>${comp.description}</b><img src=${comp.image_url} alt="Image in website" border="0">`,
            };
            smtpTransport.sendMail(mailOptions, (error, response) => {
              error ? console.log(error) : console.log(response);
              res.json(comp);
              smtpTransport.close();
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return res.status(400).json({
        error: "Picture is mandatory",
      });
    }
  });
};

exports.getComplaintsInd = (req, res) => {
  Complaint.find({ posted_user: req.profile._id })
    .sort({ date: -1 })
    .then((Complaints) => {
      fetchedComplaints = Complaints;
      res.status(200).json({
        message: "Complaints Fetched Successfully",
        Complaints: fetchedComplaints,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No items found!",
      });
    });
};

exports.getAllComplaints = (req, res) => {
  Complaint.find()
    .sort({ date: -1 })
    .then((Complaints) => {
      fetchedComplaints = Complaints;
      res.status(200).json({
        message: "Complaints Fetched Successfully",
        Complaints: fetchedComplaints,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "No items found!",
      });
    });
};
