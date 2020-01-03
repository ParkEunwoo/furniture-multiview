const express = require("express");
const app = express();
const multer = require("multer");
// const upload = multer({ dest: "furniture/" });

app.use(express.static("public"));

app.post("/upload", function(req, res) {
  res.send("success");
});

app.listen(3000, () => {
  console.log("listening 3000 port");
});
