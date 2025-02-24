import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

 
mongoose.connect("mongodb+srv://trivedihiren738:91668615@cluster0.bvonp.mongodb.net/ToDolist")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));


// Define Schema & Model
const itemSchema = new mongoose.Schema({
  title: String,
});

const Item = mongoose.model("Item", itemSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home Route (GET)
app.get("/", async (req, res) => {
  try {
    const items = await Item.find({});
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

// Add Item (POST)
app.post("/add", async (req, res) => {
  const newItem = new Item({ title: req.body.newItem });

  try {
    await newItem.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Edit Item (POST)
app.post("/edit", async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;

  try {
    await Item.findByIdAndUpdate(updatedItemId, { title: updatedItemTitle });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Delete Item (POST)
app.post("/delete", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.body.deleteItemId);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
