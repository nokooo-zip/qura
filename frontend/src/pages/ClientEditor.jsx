import React, { useEffect, useState, useRef } from "react";
import {
  GripVertical,
  Trash2,
  Plus,
  Save,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button, Input, Spinner } from "../components/Common";
import { api } from "../api";

const ICON_OPTIONS = [
  "Phone",
  "Mail",
  "Facebook",
  "Instagram",
  "TikTok",
  "Map",
  "Link",
];

function normalizeUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  const url = raw.trim();
  if (!url) return "";
  if (
    /^(https?:|mailto:|tel:|sms:|whatsapp:|data:)/i.test(url) ||
    url.startsWith("#") ||
    url.startsWith("/")
  ) {
    return url;
  }
  return `https://${url}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

const ColorField = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer bg-transparent p-0.5 shrink-0"
      />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 text-sm font-mono bg-transparent outline-none text-gray-700"
      />
    </div>
  </div>
);

const ImageUpload = ({ label, value, onChange, aspect = "square" }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || "");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch {
      alert("Could not read image");
    }
  }

  function clear() {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const boxClass =
    aspect === "cover"
      ? "w-full h-36 rounded-xl"
      : "w-28 h-28 rounded-full";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className={`${boxClass} bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative shrink-0`}
        >
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 text-sm bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-800"
          >
            <Upload size={16} /> Upload
          </button>
          {preview && (
            <button
              type="button"
              onClick={clear}
              className="text-sm text-red-600 hover:underline text-left"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
};

const ProductRow = ({ product, onUpdate, onRemove, onImage }) => {
  const fileRef = useRef(null);

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-xl bg-white border-2 border-dashed border-gray-300 overflow-hidden shrink-0 flex flex-col items-center justify-center hover:border-slate-500 hover:bg-gray-50 transition relative group"
          title="Upload product image"
        >
          {product.imageUrl ? (
            <>
              <img
                src={product.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Upload size={18} className="text-white" />
              </span>
            </>
          ) : (
            <>
              <Upload size={20} className="text-gray-400 mb-1" />
              <span className="text-[10px] text-gray-400 font-medium">
                Image
              </span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onImage(product.key, e)}
        />

        <div className="flex-1 space-y-2 min-w-0">
          <input
            type="text"
            placeholder="Product name"
            value={product.name}
            onChange={(e) => onUpdate(product.key, "name", e.target.value)}
            className="w-full text-sm p-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <Upload size={14} />
              {product.imageUrl ? "Change image" : "Upload from device"}
            </button>
            {product.imageUrl && (
              <button
                type="button"
                onClick={() => onUpdate(product.key, "imageUrl", "")}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
              >
                <X size={14} /> Remove image
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          className="text-slate-500 hover:text-red-600 p-1"
          onClick={() => onRemove(product.key)}
          title="Remove product"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const ClientEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("header");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [themeColor, setThemeColor] = useState("#FFFFFF");
  const [headerTextColor, setHeaderTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#FFFFFF");
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getClient(id);
        setClient(data);
        setName(data.name || "");
        setContact(data.contact || "");
        setDescription(data.description || "");
        setLogoImageUrl(data.logoImageUrl || "");
        setCoverImageUrl(data.coverImageUrl || "");
        setThemeColor(data.themeColor || "#FFFFFF");
        setHeaderTextColor(data.headerTextColor || "#000000");
        setButtonColor(data.buttonColor || "#000000");
        setButtonTextColor(data.buttonTextColor || "#FFFFFF");
        setLinks(
          (data.links || []).map((l, i) => ({
            ...l,
            key: l._id || `l-${i}`,
          }))
        );
        setProducts(
          (data.products || []).map((p, i) => ({
            ...p,
            key: p._id || `p-${i}`,
          }))
        );
      } catch (err) {
        setError(err.message);
        if (err.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function addLink() {
    setLinks((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}`,
        title: "",
        url: "",
        icon: "Link",
        order: prev.length,
      },
    ]);
  }

  function updateLink(key, field, value) {
    setLinks((prev) =>
      prev.map((l) => (l.key === key ? { ...l, [field]: value } : l))
    );
  }

  function removeLink(key) {
    setLinks((prev) => prev.filter((l) => l.key !== key));
  }

  function addProduct() {
    setProducts((prev) => [
      ...prev,
      { key: `new-${Date.now()}`, name: "", imageUrl: "", order: prev.length },
    ]);
  }

  function updateProduct(key, field, value) {
    setProducts((prev) =>
      prev.map((p) => (p.key === key ? { ...p, [field]: value } : p))
    );
  }

  function removeProduct(key) {
    setProducts((prev) => prev.filter((p) => p.key !== key));
  }

  async function handleProductImage(key, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    e.target.value = "";
    try {
      const dataUrl = await fileToDataUrl(file);
      updateProduct(key, "imageUrl", dataUrl);
    } catch {
      alert("Could not read image");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        name,
        contact,
        description,
        logoImageUrl,
        coverImageUrl,
        themeColor,
        headerTextColor,
        buttonColor,
        buttonTextColor,
        links: links.map(({ title, url, icon }, i) => ({
          title: title || "Link",
          url: normalizeUrl(url) || "#",
          icon: icon || "Link",
          order: i,
        })),
        products: products.map(({ name: n, imageUrl }, i) => ({
          name: n || "",
          imageUrl: imageUrl || "",
          order: i,
        })),
      };
      const updated = await api.updateClient(id, payload);
      setClient(updated);
      setMessage("Saved successfully");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || "Client not found"}</p>
        <Link to="/admin" className="text-slate-800 underline">
          Back to admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        view="client"
        clientName={client.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="ml-64 flex-1 flex justify-center p-10">
        <div className="w-full max-w-xl">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Edit {client.name}
            </h2>
            <a
              href={`/profile/${client.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ExternalLink size={16} /> View public page
            </a>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === "header" && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
                <ImageUpload
                  label="Cover image"
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  aspect="cover"
                />
                <div className="flex justify-center">
                  <ImageUpload
                    label="Logo"
                    value={logoImageUrl}
                    onChange={setLogoImageUrl}
                    aspect="square"
                  />
                </div>
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Business name"
                />
                <Input
                  label="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone or email"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Short description"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Public URL: /profile/{client.slug}
                </p>
              </section>
            )}

            {activeTab === "links" && (
              <>
                <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Links</h3>
                    <button
                      type="button"
                      onClick={addLink}
                      className="flex items-center gap-1 text-sm bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800"
                    >
                      <Plus size={16} /> Add link
                    </button>
                  </div>
                  <div className="space-y-3">
                    {links.map((link) => (
                      <div
                        key={link.key}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3"
                      >
                        <GripVertical className="text-gray-400 mt-2 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Title"
                            value={link.title}
                            onChange={(e) =>
                              updateLink(link.key, "title", e.target.value)
                            }
                            className="w-full text-sm font-semibold outline-none bg-transparent border-b border-transparent focus:border-gray-300 py-1"
                          />
                          <input
                            type="text"
                            placeholder="URL (https://…)"
                            value={link.url}
                            onChange={(e) =>
                              updateLink(link.key, "url", e.target.value)
                            }
                            className="w-full text-sm text-gray-600 outline-none bg-transparent border-b border-transparent focus:border-gray-300 py-1"
                          />
                          <select
                            value={link.icon || "Link"}
                            onChange={(e) =>
                              updateLink(link.key, "icon", e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white"
                          >
                            {ICON_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          className="text-slate-800 hover:text-red-600 mt-2"
                          onClick={() => removeLink(link.key)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    {links.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No links yet. Add phone, social, or website buttons.
                      </p>
                    )}
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">
                      Products
                    </h3>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="flex items-center gap-1 text-sm bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800"
                    >
                      <Plus size={16} /> Add product
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload product images from your device (not URLs).
                  </p>
                  <div className="space-y-3">
                    {products.map((p) => (
                      <ProductRow
                        key={p.key}
                        product={p}
                        onUpdate={updateProduct}
                        onRemove={removeProduct}
                        onImage={handleProductImage}
                      />
                    ))}
                    {products.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
                        No products yet. Click &quot;Add product&quot; then
                        upload an image from your device.
                      </p>
                    )}
                  </div>
                </section>
              </>
            )}

            {activeTab === "design" && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Customize</h3>
                <ColorField
                  label="Background:"
                  value={themeColor}
                  onChange={setThemeColor}
                />
                <ColorField
                  label="Header Text:"
                  value={headerTextColor}
                  onChange={setHeaderTextColor}
                />
                <ColorField
                  label="Button:"
                  value={buttonColor}
                  onChange={setButtonColor}
                />
                <ColorField
                  label="Button Text:"
                  value={buttonTextColor}
                  onChange={setButtonTextColor}
                />
              </section>
            )}

            {error && (
              <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                {error}
              </p>
            )}
            {message && (
              <p className="text-green-700 bg-green-50 p-3 rounded-lg text-sm">
                {message}
              </p>
            )}

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <Spinner className="w-5 h-5 text-white" />
              ) : (
                <Save size={18} />
              )}
              Save
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientEditor;