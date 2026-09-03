import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Spinner } from "../components/Common";
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

function normalizeUrl(raw) {
  if (!raw || typeof raw !== "string") return "#";
  const url = raw.trim();
  if (!url) return "#";
  if (
    /^(https?:|mailto:|tel:|sms:|whatsapp:|data:)/i.test(url) ||
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
      return <Phone className="w-5 h-5 mr-3 shrink-0" />;
    case "mail":
      return <Mail className="w-5 h-5 mr-3 shrink-0" />;
    case "facebook":
      return <Facebook className="w-5 h-5 mr-3 shrink-0" />;
    case "instagram":
      return <Instagram className="w-5 h-5 mr-3 shrink-0" />;
    case "tiktok":
      return (
        <div className="w-5 h-5 mr-3 flex items-center justify-center shrink-0">
          <TikTokIcon />
        </div>
      );
    case "map":
      return <MapPin className="w-5 h-5 mr-3 shrink-0" />;
    default:
      return <LinkIcon className="w-5 h-5 mr-3 shrink-0" />;
  }
}

const ProductCarousel = ({ products, headerColor }) => {
  const trackRef = useRef(null);

  function scroll(dir) {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <div className="w-full mt-8">
      <h2
        className="text-xl font-bold text-center mb-4 px-6"
        style={{ color: headerColor }}
      >
        Our Products
      </h2>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-700 hover:bg-white"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-700 hover:bg-white"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-2 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((p) => (
            <div
              key={p._id || p.name}
              className="snap-center shrink-0 w-[70%] max-w-[220px] bg-white rounded-xl shadow-sm overflow-hidden aspect-square flex flex-col items-center justify-center p-2"
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name || "Product"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-600 text-center px-2">
                  {p.name || "Product"}
                </span>
              )}
              {p.name && p.imageUrl && (
                <p className="text-xs font-medium text-slate-700 mt-1 text-center truncate w-full">
                  {p.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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

  const bg = client.themeColor || "#FFFFFF";
  const headerColor = client.headerTextColor || "#000000";
  const btnBg = client.buttonColor || "#000000";
  const btnText = client.buttonTextColor || "#FFFFFF";

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
        className="w-full max-w-md relative flex flex-col shadow-2xl min-h-screen sm:min-h-fit overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        <div className="w-full h-40 overflow-hidden relative">
          {client.coverImageUrl ? (
            <img
              src={client.coverImageUrl}
              alt={`${client.name} cover`}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-slate-800" />
          )}
        </div>

        <div className="relative px-6 -mt-12 mb-6 min-h-[6rem]">
          <div
            className="absolute left-6 bottom-0 w-24 h-24 rounded-full p-1.5 z-10 shadow-md"
            style={{ backgroundColor: bg }}
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border border-white">
              {client.logoImageUrl ? (
                <img
                  src={client.logoImageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="font-black text-sm tracking-tight px-2 text-center leading-tight"
                  style={{ color: headerColor }}
                >
                  {(client.logoText || client.name || "")
                    .slice(0, 6)
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="pt-14 pb-1">
            <h1
              className="text-2xl font-black text-center leading-tight"
              style={{ color: headerColor }}
            >
              {client.name}
            </h1>
          </div>
        </div>

        {client.description && (
          <div className="px-6 mb-6 text-center">
            <p
              className="text-sm font-medium opacity-90"
              style={{ color: headerColor }}
            >
              {client.description}
            </p>
          </div>
        )}

        {client.contact && (
          <div className="px-6 mb-4 text-center">
            <p className="text-sm opacity-70" style={{ color: headerColor }}>
              {client.contact}
            </p>
          </div>
        )}

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
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-base flex items-center justify-center shadow-sm hover:opacity-90 transition"
                style={{ backgroundColor: btnBg, color: btnText }}
              >
                {iconFor(link.icon)}
                {link.title}
              </button>
            </a>
          ))}

          {client.mapEmbedUrl && (
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <h3
                className="font-bold mb-3 flex justify-center items-center gap-2"
                style={{ color: headerColor }}
              >
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

        <ProductCarousel products={sortedProducts} headerColor={headerColor} />

        <div className="mt-12 mb-6 flex justify-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
            QURA
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;