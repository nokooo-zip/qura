import React from "react";
import { User, LogOut, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Common";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ view = "admin", clientName = "" }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="w-64 h-screen bg-gray-100 flex flex-col justify-between fixed left-0 top-0 border-r border-gray-200 z-20">
      <div>
        <div className="p-8">
          <Link to="/admin">
            <Logo />
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {view === "admin" ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 rounded-lg text-slate-800 font-medium">
              <User size={20} />
              <span>Clients</span>
            </div>
          ) : (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft size={16} /> Back to clients
              </Link>
              <div className="flex items-center gap-3 px-4 py-3 text-slate-800 font-semibold">
                <User size={20} />
                <span className="truncate">{clientName}</span>
              </div>
              <div className="pl-11 space-y-1">
                <div className="px-4 py-2 bg-gray-200 rounded-lg text-slate-800 font-medium">
                  Links
                </div>
              </div>
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-3 px-4 text-slate-600">
          <div className="w-8 h-8 bg-slate-700 text-white rounded-md flex items-center justify-center text-xs font-bold">
            {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <span className="font-medium truncate text-sm">
            {user?.name || user?.email || "Admin"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2 border border-gray-400 rounded-lg flex items-center justify-center gap-2 text-slate-700 hover:bg-gray-200 transition"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
