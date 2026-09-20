import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Button from "../ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { label: "Home", path: "/" },
    { label: "Dining", path: "/dining" },
    { label: "Menu", path: "/menu" },
    { label: "Events", path: "/events" },
    { label: "About", path: "/about" },
  ];

  const linkStyles = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-primary-800"
        : "text-stone-600 hover:text-primary-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900 text-lg font-bold text-white">
            A
          </div>

          <div>
            <p className="text-xl font-bold tracking-[0.15em] text-primary-900">
              AUREVIA
            </p>

            <p className="text-[10px] uppercase tracking-[0.18em] text-gold-600">
              Dining & Events
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkStyles}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button size="sm">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-lg p-2 text-primary-900 transition hover:bg-primary-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-cream-50 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={linkStyles}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-stone-200 pt-4">
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}