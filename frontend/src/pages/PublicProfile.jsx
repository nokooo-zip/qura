import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { Button, Spinner } from "../components/Common";
import { api } from "../api";

const TikTokIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

/** Ensure external links open correctly.
 *  "www.google.com"  → "https://www.google.com"
 */
function normalizeUrl(raw) {
  if (!raw || typeof raw !== "string") return "#";
  const url = raw.trim();
  if (!url) return "#";
  if (
    /^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(url) ||
    url.startsWith("#") ||
    url.startsWith("/")
  ) {
    return url;
  }
  return `https://${url}`;
}

function iconFor(type) {
  switch ((type || "").toLowerCase()) {
    case "phone":
      return <Phone className="w-6 h-6 mr-3" />;
    case "mail":
      return <Mail className="w-6 h-6 mr-3" />;
    case "facebook":
      return <Facebook className="w-6 h-6 mr-3" />;
    case "instagram":
      return <Instagram className="w-6 h-6 mr-3" />;
    case "tiktok":
      return (
        <div className="w-6 h-6 mr-3 flex items-center justify-center">
          <TikTokIcon />
        </div>
      );
    case "map":
      return <MapPin className="w-6 h-6 mr-3" />;
    default:
      return <LinkIcon className="w-6 h-6 mr-3" />;
  }
}

const PublicProfile = () => {
  const { slug } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getPublic(slug);
        setClient(data);
      } catch (err) {
        setError(err.message || "Profile not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-2">
        <p className="text-xl font-bold text-slate-800">Profile not found</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  const bg = client.themeColor || "#EAF2D7";
  const sortedLinks = [...(client.links || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  const sortedProducts = [...(client.products || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <div
      className="min-h-screen pb-10 flex justify-center"
      style={{ backgroundColor: bg }}
    >
      <div
        className="w-full max-w-md relative flex flex-col items-center shadow-2xl min-h-screen sm:min-h-fit overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        <div className="w-full h-48 bg-blue-100 overflow-hidden relative">
          {client.coverImageUrl ? (
            <img
              src={client.coverImageUrl}
              alt={`${client.name} cover`}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
          )}
        </div>

        <div
          className="w-28 h-28 rounded-full p-2 -mt-14 relative z-10"
          style={{ backgroundColor: bg }}
        >
          <div className="w-full h-full bg-white/80 rounded-full flex items-center justify-center overflow-hidden border border-white shadow">
            {client.logoImageUrl ? (
              <img
                src={client.logoImageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-green-900 font-black text-lg tracking-tight px-2 text-center leading-tight">
                {client.logoText || client.name.slice(0, 6).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="text-center px-6 mt-4 mb-8">
          <h1 className="text-2xl font-black text-green-900 mb-2">
            {client.name}
          </h1>
          {client.description && (
            <p className="text-sm font-semibold text-green-800 px-2">
              {client.description}
            </p>
          )}
        </div>

        <div className="w-full px-6 space-y-3">
          {sortedLinks.map((link) => (
            <a
              key={link._id || link.title + link.url}
              href={normalizeUrl(link.url)}
              target={
                /^(https?:)/i.test(normalizeUrl(link.url))
                  ? "_blank"
                  : undefined
              }
              rel="noreferrer"
              className="block"
            >
              <Button variant="public" type="button">
                {iconFor(link.icon)}
                {link.title}
              </Button>
            </a>
          ))}

          {client.mapEmbedUrl && (
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-green-900 mb-3 flex justify-center items-center gap-2">
                <MapPin size={18} /> Location
              </h3>
              <div className="w-full h-40 rounded-lg overflow-hidden">
                <iframe
                  title="map"
                  src={client.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>

        {sortedProducts.length > 0 && (
          <div className="w-full px-6 mt-8">
            <h2 className="text-xl font-bold text-green-900 text-center mb-4">
              Our Products
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {sortedProducts.map((p) => (
                <div
                  key={p._id || p.name}
                  className="bg-white rounded-xl shadow-sm overflow-hidden aspect-square p-2 flex flex-col items-center justify-center"
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-600 text-center">
                      {p.name || "Product"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
            QURA
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;