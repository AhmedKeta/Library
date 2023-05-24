const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, require: true },
  auther: { type: String, require: true },
  pages: { type: Number, require: true },
  copies: { type: Number, require: true },
  shelf: { type: Number, require: true },
  borrowed: [{ type: mongoose.Types.ObjectId, ref: "Member" }],
});
schema.index({ title: "text", auther: "text" });
mongoose.model("Book", schema);
