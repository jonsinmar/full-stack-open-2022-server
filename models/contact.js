require('dotenv').config()
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
      type: String,
      minlength: 3,
      required: true
  },
  number: {
      type: String,
      minlength: 8,
      validate: {
        validator: function(v) {
          return /\d{1,2}-\d/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
