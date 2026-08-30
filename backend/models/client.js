const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: "link" }, // phone | mail | facebook | instagram | tiktok | map | link
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    // Short unique handle used in public URL: /profile/:slug
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Theme / design
    themeColor: {
      type: String,
      default: "#EAF2D7",
    },
    logoText: {
      type: String,
      trim: true,
      default: "",
    },
    coverImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    logoImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    mapEmbedUrl: {
      type: String,
      trim: true,
      default: "",
    },
    links: [linkSchema],
    products: [productSchema],
    // Admin who owns this client record
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Helper: turn "Tripsy Nepal" → "tripsy-nepal"
clientSchema.statics.slugify = function (name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
