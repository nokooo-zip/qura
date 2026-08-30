/**
 * Seed a demo admin + sample clients so the UI has data on first run.
 * Usage:  node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Client = require("./models/client");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  // Wipe previous seed data (safe for local/dev)
  await User.deleteMany({});
  await Client.deleteMany({});

  const password = await bcrypt.hash("admin123", 10);
  const admin = await User.create({
    email: "admin@qura.app",
    password,
    name: "Qura Admin",
  });
  console.log("Admin: admin@qura.app / admin123");

  const samples = [
    {
      name: "Tripsy Nepal",
      contact: "+977 9812345678",
      description:
        "A modern Nepali food & beverage company crafting and bringing bold, refreshing experiences to life.",
      themeColor: "#EAF2D7",
      logoText: "TRIPSY",
      links: [
        { title: "Phone", url: "tel:+9779812345678", icon: "phone", order: 0 },
        { title: "Gmail", url: "mailto:hello@tripsy.np", icon: "mail", order: 1 },
        { title: "Facebook", url: "https://facebook.com/tripsy", icon: "facebook", order: 2 },
        { title: "Instagram", url: "https://instagram.com/tripsy", icon: "instagram", order: 3 },
        { title: "TikTok", url: "https://tiktok.com/@tripsy", icon: "tiktok", order: 4 },
      ],
      products: [
        { name: "Blue Can", imageUrl: "", order: 0 },
        { name: "Red Can", imageUrl: "", order: 1 },
      ],
    },
    {
      name: "Ventura Inc.",
      contact: "+977 9801112233",
      description: "Adventure travel and outdoor experiences across Nepal.",
      themeColor: "#E0F2FE",
      logoText: "VENTURA",
      links: [
        { title: "WhatsApp", url: "https://wa.me/9779801112233", icon: "phone", order: 0 },
        { title: "Website", url: "https://example.com", icon: "link", order: 1 },
      ],
      products: [],
    },
    {
      name: "Rablab",
      contact: "+977 9844556677",
      description: "Creative studio for brands and digital products.",
      themeColor: "#FCE7F3",
      logoText: "RABLAB",
      links: [
        { title: "Instagram", url: "https://instagram.com/rablab", icon: "instagram", order: 0 },
        { title: "Email", url: "mailto:hi@rablab.com", icon: "mail", order: 1 },
      ],
      products: [],
    },
    {
      name: "QuickLearners",
      contact: "+977 9811223344",
      description: "Online tutoring and skill bootcamps for students.",
      themeColor: "#FEF3C7",
      logoText: "QL",
      links: [
        { title: "Enroll", url: "https://example.com/enroll", icon: "link", order: 0 },
        { title: "Facebook", url: "https://facebook.com/quicklearners", icon: "facebook", order: 1 },
      ],
      products: [],
    },
  ];

  for (const s of samples) {
    const slug = Client.slugify(s.name);
    await Client.create({ ...s, slug, creator: admin._id });
    console.log("Client:", s.name, "→ /profile/" + slug);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
