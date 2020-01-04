const express = require("express");
const app = express();
const multer = require("multer");

app.use(express.static("public"));
app.use(express.json());

app.locals.furniture = { chair: 0, sofa: 0, bed: 0, table: 0 };

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/furniture/" + req.params.class);
  },
  filename: (req, file, callback) => {
    const [name, ext] = file.originalname.split(".");
    const id = app.locals.furniture[req.params.class];
    if (Number(name) < 12) {
      callback(null, `${id}-${name}.${ext}`);
    } else {
      if (ext === "obj" || ext === "mtl") {
        callback(null, `${id}.${ext}`);
      } else {
        callback(null, `${id}-${req.files.length + 11}.${ext}`);
      }
    }
  }
});

const upload = multer({ storage }).array("files", 30);

app.post("/upload/:class", upload, function(req, res) {
  const { files } = req;
  app.locals.furniture[req.params.class]++;
  console.log(req.params.class);
  console.log(files);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("listening 3000 port");
});
