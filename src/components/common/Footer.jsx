import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 font-bold text-primary-950">
                A
              </div>

              <div>
                <p className="text-xl font-bold tracking-[0.15em]">
                  AUREVIA
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-gold-400">
                  Dining & Events
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-stone-300">
              Bringing exceptional dining experiences and memorable
              events together in one place.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-gold-400">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-stone-300">
              <Link className="transition hover:text-white" to="/">
                Home
              </Link>

              <Link
                className="transition hover:text-white"
                to="/dining"
              >
                Dining
              </Link>

              <Link
                className="transition hover:text-white"
                to="/menu"
              >
                Menu
              </Link>

              <Link
                className="transition hover:text-white"
                to="/events"
              >
                Events
              </Link>

              <Link
                className="transition hover:text-white"
                to="/about"
              >
                About
              </Link>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="font-semibold text-gold-400">
              Customer
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-stone-300">
              <Link
                className="transition hover:text-white"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="transition hover:text-white"
                to="/register"
              >
                Create Account
              </Link>

              <Link
                className="transition hover:text-white"
                to="/reservations"
              >
                Reservations
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gold-400">
              Contact
            </h3>

            <div className="mt-5 space-y-4 text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />

                <span>Restaurant location</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-400" />

                <span>Contact number</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" />

                <span>Contact email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} AUREVIA. All rights reserved.
          </p>

          <p>
            Restaurant & Event Management System
          </p>
        </div>
      </div>
    </footer>
  );
}