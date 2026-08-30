import React, { useEffect, useState } from "react";
import { GripVertical, Trash2, Plus, Save, ExternalLink } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button, Input, Spinner } from "../components/Common";
import { api } from "../api";

const ICON_OPTIONS = [
  "phone",
  "mail",
  "facebook",
  "instagram",
  "tiktok",
  "map",
  "link",
];

/** Store a usable absolute URL when possible. */
function normalizeUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  const url = raw.trim();
  if (!url) return "";
  if (
    /^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(url) ||
    url.startsWith("#") ||
    url.startsWith("/")
  ) {
    return url;
  }
  return `https://${url}`;
}

const ClientEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [themeColor, setThemeColor] = useState("#EAF2D7");
  const [logoText, setLogoText] = useState("");
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
        setThemeColor(data.themeColor || "#EAF2D7");
        setLogoText(data.logoText || "");
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
        icon: "link",
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
        themeColor,
        logoText,
        links: links.map(({ title, url, icon, order }, i) => ({
          title: title || "Link",
          url: normalizeUrl(url) || "#",
          icon: icon || "link",
          order: i,
        })),
        products: products.map(({ name: n, imageUrl, order }, i) => ({
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
      <Sidebar view="client" clientName={client.name} />

      <div className="ml-64 flex-1 p-10 max-w-4xl">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Edit micro-site
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

        <form onSubmit={handleSave} className="space-y-8">
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Profile</h3>
            <Input
              label="Business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Logo text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="Short brand mark"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme color
                </label>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Public URL: /profile/{client.slug}
            </p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
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
                      placeholder="Title (Phone, Instagram…)"
                      value={link.title}
                      onChange={(e) =>
                        updateLink(link.key, "title", e.target.value)
                      }
                      className="w-full text-sm font-semibold outline-none bg-transparent border-b border-transparent focus:border-gray-300 py-1"
                    />
                    <input
                      type="text"
                      placeholder="https://www.google.com  or  tel:+977…  or  mailto:…"
                      value={link.url}
                      onChange={(e) =>
                        updateLink(link.key, "url", e.target.value)
                      }
                      className="w-full text-sm text-gray-600 outline-none bg-transparent border-b border-transparent focus:border-gray-300 py-1"
                    />
                    <select
                      value={link.icon || "link"}
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

          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Products</h3>
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center gap-1 text-sm bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800"
              >
                <Plus size={16} /> Add product
              </button>
            </div>
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.key}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-3"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Product name"
                      value={p.name}
                      onChange={(e) =>
                        updateProduct(p.key, "name", e.target.value)
                      }
                      className="text-sm p-2 border border-gray-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Image URL (optional)"
                      value={p.imageUrl}
                      onChange={(e) =>
                        updateProduct(p.key, "imageUrl", e.target.value)
                      }
                      className="text-sm p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    className="text-slate-800 hover:text-red-600"
                    onClick={() => removeProduct(p.key)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>

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

          <Button type="submit" disabled={saving} className="max-w-xs">
            {saving ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              <Save size={18} />
            )}
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClientEditor;