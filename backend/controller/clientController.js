const Client = require("../models/client");
const QRCode = require("qrcode");

/**
 * GET /api/clients  (auth)
 * List all clients for the admin panel.
 */
const listClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .select("name slug contact description logoText themeColor createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

/**
 * GET /api/clients/:id  (auth)
 * Full client document for the editor.
 */
const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

/**
 * GET /api/public/:slug
 * Public micro-website payload (no auth). Used by QR landing page.
 */
const getPublicBySlug = async (req, res) => {
  try {
    const client = await Client.findOne({ slug: req.params.slug.toLowerCase() });
    if (!client) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

/**
 * POST /api/clients  (auth)
 * Create a new client / business micro-site.
 */
const createClient = async (req, res) => {
  try {
    const {
      name,
      contact,
      description,
      themeColor,
      logoText,
      coverImageUrl,
      logoImageUrl,
      mapEmbedUrl,
      links,
      products,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Business name is required" });
    }

    let baseSlug = Client.slugify(name);
    if (!baseSlug) baseSlug = "business";

    // Ensure unique slug
    let slug = baseSlug;
    let n = 1;
    while (await Client.findOne({ slug })) {
      slug = `${baseSlug}-${n++}`;
    }

    const client = await Client.create({
      name: name.trim(),
      slug,
      contact: contact || "",
      description: description || "",
      themeColor: themeColor || "#EAF2D7",
      logoText: logoText || name.trim().slice(0, 8).toUpperCase(),
      coverImageUrl: coverImageUrl || "",
      logoImageUrl: logoImageUrl || "",
      mapEmbedUrl: mapEmbedUrl || "",
      links: Array.isArray(links) ? links : [],
      products: Array.isArray(products) ? products : [],
      creator: req.user?.id,
    });

    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slug already exists, try a different name" });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

/**
 * PUT /api/clients/:id  (auth)
 * Update client profile + links + products.
 */
const updateClient = async (req, res) => {
  try {
    const allowed = [
      "name",
      "contact",
      "description",
      "themeColor",
      "logoText",
      "coverImageUrl",
      "logoImageUrl",
      "mapEmbedUrl",
      "links",
      "products",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // If name changes, optionally refresh slug only when client asks
    if (req.body.regenerateSlug && updates.name) {
      let baseSlug = Client.slugify(updates.name);
      if (!baseSlug) baseSlug = "business";
      let slug = baseSlug;
      let n = 1;
      while (await Client.findOne({ slug, _id: { $ne: req.params.id } })) {
        slug = `${baseSlug}-${n++}`;
      }
      updates.slug = slug;
    }

    const client = await Client.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

/**
 * DELETE /api/clients/:id  (auth)
 */
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

/**
 * GET /api/clients/:id/qr  (auth)
 * Returns a PNG data-URL for a QR that points at the public profile.
 */
const getClientQr = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select("slug name");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    const profileUrl = `${frontend}/profile/${client.slug}`;

    const dataUrl = await QRCode.toDataURL(profileUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    });

    res.status(200).json({
      name: client.name,
      slug: client.slug,
      profileUrl,
      qrDataUrl: dataUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  listClients,
  getClient,
  getPublicBySlug,
  createClient,
  updateClient,
  deleteClient,
  getClientQr,
};
