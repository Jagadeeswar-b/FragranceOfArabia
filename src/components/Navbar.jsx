import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../store/useStore";

export default function Navbar() {
  const { isAdmin } = useStore();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Admin entry is NOT shown to the public. The /admin route still works if you
  // navigate to it directly; once logged in, a "Dashboard" link appears here.
  const renderLinks = () => (
    <>
      <NavLink to="/" end className="nav-link" onClick={close}>
        Home
      </NavLink>
      <NavLink to="/shop" className="nav-link" onClick={close}>
        Shop
      </NavLink>
      <NavLink to="/contact" className="nav-link" onClick={close}>
        Contact
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className="nav-link" onClick={close}>
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-1">Fragrance</span>
          <span className="brand-2">of Arabia</span>
        </Link>

        <nav className="nav-desktop">{renderLinks()}</nav>

        <button
          className={`nav-toggle${open ? " is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && <nav className="nav-drawer">{renderLinks()}</nav>}
    </header>
  );
}
