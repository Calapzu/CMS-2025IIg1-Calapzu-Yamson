// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";
import Button from "./ui/Button";

export default function Navbar() {
  const { user, profile, role } = useAuthContext();
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
  };

  // 🔹 Define enlaces y roles
  const navLinks = [
    { to: "/", label: "INICIO" },
    { to: "/dashboard", label: "DASHBOARD", roles: ["reportero", "editor"] },
    { to: "/dashboard/noticias/nueva", label: "ESCRIBIR", roles: ["reportero", "editor"] },
    { to: "/dashboard/secciones", label: "GESTIONAR SECCIONES", roles: ["editor"] }
  ];

  // 🔹 Filtra enlaces según rol
  const filteredLinks = navLinks.filter(link => {
    if (!link.roles) return true; // público
    if (!user) return false;      // requiere login
    return link.roles.includes(role);
  });

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b-4 border-red-600 shadow-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="text-2xl sm:text-3xl font-black text-red-600 group-hover:text-red-700 transition-colors">
                CALAPZÚTIMO
              </span>
              <span className="hidden sm:block text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">
                NOTICIERO
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {filteredLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-bold text-sm uppercase tracking-wider transition-all ${
                    isActive
                      ? "text-red-600"
                      : "text-gray-700 dark:text-gray-300 hover:text-red-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <div className="flex items-center gap-4 border-l-2 border-red-600 pl-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">{role || "Usuario"}</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {profile?.nombre || "Calapzu"}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleSignOut}
                  className="font-bold"
                >
                  SALIR
                </Button>
              </div>
            ) : (
              <NavLink to="/login">
                <Button variant="primary" size="md">
                  ENTRAR
                </Button>
              </NavLink>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t-2 border-red-600">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {filteredLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 px-4 text-lg font-bold rounded-lg transition-all ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <div className="pt-6 border-t-2 border-red-600">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Usuario activo</p>
                      <p className="font-bold text-lg">{profile?.nombre || "Calapzu"}</p>
                    </div>
                    <Button variant="danger" size="sm" onClick={handleSignOut}>
                      SALIR
                    </Button>
                  </div>
                </div>
              ) : (
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    ENTRAR AL SISTEMA
                  </Button>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

