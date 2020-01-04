const express = require("express");
const app = express();
const multer = require("multer");

app.use(express.static("public"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/furniture/" + req.params.class);
  },
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().valueOf() + "." + file.originalname.split(".").pop()
    );
  }
});

const upload = multer({ storage }).array("files", 30);

app.post("/upload/:class", upload, function(req, res) {
  const { files } = req;
  console.log(req.params.class);
  console.log(files);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("listening 3000 port");
});
