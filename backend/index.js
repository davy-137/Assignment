const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
mongoose.connect("mongodb://localhost/formtable", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB successfully!");
});

const FormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

formModel = mongoose.model("form", FormSchema);

app.get("/", async (req, res) => {
  // try{
  // const arrRes = formModel.find();
  const arrRes = await formModel.find();
  res.send(arrRes);

  // res.status(200).send({message:"hello backend! is here"});
  // }
  // catch(error){
  // console.log("error",error);
  // res.status(500).send({message: 'internal error found!'});
  // }
});

app.post("/createUpdate", async (req, res) => {
  console.log("[][++++]",req.body,"[+++++][]")
  if (Object.keys(req.body).includes("_id")) {
    try {
      const result = await formModel.find({ _id: req.body._id });
      if (result) {
        const toSend = { ...req.body };
        delete toSend._id;
        const updatedRes = await formModel.updateOne(
          { _id: req.body._id },
          { $set: toSend }
        );
        res.status(200).send({ message: "updated successfully!" });
      }
    } catch (err) {
      res.status(500).send({ message: "internal error found!" });
    }
  } else {
    try {
      const newForm = new formModel(req.body);
      const result = await newForm.save();
      res.status(200).send({ message: "saved successfully!" });
    } catch (err) {
      res.status(500).send({ message: "internal error found!" });
    }
  }
});
app.post("/delete", async (req, res) => {
  try{
    // console.log(req.body,"req.body.selection")
    const response=await formModel.deleteMany({ _id: { $in: req.body } });
    console.log("response",response,"response");
    res.status(200).send({message:"deleted successfully!"});
  }
  catch(error){
    console.log("error",error);
    res.status(500).send({message: 'internal error found!'});
  }
});
app.post("/search", async (req, res) => {
  try{
    const searchTerm = req.body.searchTerm;
    const result=await formModel.find({ name: { $regex: `'${searchTerm}'` }});
    console.log("result",result,"result");
    res.status(200).send(result);
  }
  catch(error){
    console.log("error",error);
    res.status(500).send({message: 'internal error found!'});
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
