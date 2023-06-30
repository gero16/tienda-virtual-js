const { Schema, model } = require("mongoose");

const ProductosSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  price: {
    type: Number,
    required: [true, ""],
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
});

ProductosSchema.methods.toJSON = function () {
  const { producto } = this.toObject();
  return producto;
};

module.exports = model("producto", ProductosSchema);
