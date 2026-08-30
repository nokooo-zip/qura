import React, { useEffect, useState } from "react";
import { ExternalLink, Edit, Trash2, QrCode, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Button, Input, Spinner } from "../components/Common";
import { api } from "../api";

const AdminPanel = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [creating, setCreating] = useState(false);
  const [qrModal, setQrModal] = useState(null); // { name, profileUrl, qrDataUrl }
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const client = await api.createClient({
        name: newName.trim(),
        contact: newContact.trim(),
      });
      setShowCreate(false);
      setNewName("");
      setNewContact("");
      navigate(`/admin/client/${client._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(client) {
    if (!confirm(`Delete ${client.name}? This cannot be undone.`)) return;
    try {
      await api.deleteClient(client._id);
      setClients((prev) => prev.filter((c) => c._id !== client._id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleQr(client) {
    try {
      const data = await api.getClientQr(client._id);
      setQrModal(data);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar view="admin" />

      <div className="ml-64 flex-1 p-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
              Admin Panel
            </h2>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900">Clients</h3>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition"
              >
                <Plus size={18} /> New Client
              </button>
            </div>

            {error && (
              <p className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                {error}
              </p>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner className="w-8 h-8" />
              </div>
            ) : clients.length === 0 ? (
              <p className="text-center text-gray-500 py-16">
                No clients yet. Create one to generate a micro-website + QR.
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-800">
                    <th className="py-4 font-semibold w-1/3">Name</th>
                    <th className="py-4 font-semibold w-1/3">Contact</th>
                    <th className="py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                            {(client.logoText || client.name)
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 block">
                              {client.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              /profile/{client.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {client.contact || "—"}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3 text-slate-700">
                          <a
                            href={`/profile/${client.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-black"
                            title="Open public page"
                          >
                            <ExternalLink size={20} />
                          </a>
                          <Link
                            to={`/admin/client/${client._id}`}
                            className="hover:text-black"
                            title="Edit"
                          >
                            <Edit size={20} />
                          </Link>
                          <button
                            type="button"
                            className="hover:text-red-600"
                            title="Delete"
                            onClick={() => handleDelete(client)}
                          >
                            <Trash2 size={20} />
                          </button>
                          <button
                            type="button"
                            className="hover:text-black"
                            title="QR code"
                            onClick={() => handleQr(client)}
                          >
                            <QrCode size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">New Client</h3>
              <button type="button" onClick={() => setShowCreate(false)}>
                <X size={20} />
              </button>
            </div>
            <Input
              label="Business name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Tripsy Nepal"
              required
            />
            <Input
              label="Contact"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              placeholder="+977 98..."
            />
            <Button type="submit" disabled={creating}>
              {creating ? <Spinner className="w-5 h-5 text-white" /> : "Create"}
            </Button>
          </form>
        </div>
      )}

      {/* QR modal */}
      {qrModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {qrModal.name}
              </h3>
              <button type="button" onClick={() => setQrModal(null)}>
                <X size={20} />
              </button>
            </div>
            <img
              src={qrModal.qrDataUrl}
              alt="QR code"
              className="mx-auto w-56 h-56"
            />
            <p className="text-sm text-gray-600 break-all">
              {qrModal.profileUrl}
            </p>
            <a
              href={qrModal.qrDataUrl}
              download={`${qrModal.slug}-qr.png`}
              className="inline-block bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700"
            >
              Download PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
