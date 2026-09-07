import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const getNavLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <NavLink
                    to="/dashboard"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    SaaSFlow
                </NavLink>

                {/* Desktop Navigation */}
                <div className="desktop-nav">
                    <NavLink
                        to="/dashboard"
                        className={getNavLinkClass}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/users"
                        className={getNavLinkClass}
                    >
                        Users
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={getNavLinkClass}
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={getNavLinkClass}
                    >
                        Tasks
                    </NavLink>
                </div>

                {/* Desktop User Section */}
                <div className="desktop-user">
                    {user && (
                        <div className="user-info">
                            <strong>{user.name}</strong>
                            <span>({user.role})</span>
                        </div>
                    )}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <div className="mobile-menu">

                    <NavLink
                        to="/dashboard"
                        className={getNavLinkClass}
                        onClick={closeMenu}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/users"
                        className={getNavLinkClass}
                        onClick={closeMenu}
                    >
                        Users
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={getNavLinkClass}
                        onClick={closeMenu}
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={getNavLinkClass}
                        onClick={closeMenu}
                    >
                        Tasks
                    </NavLink>

                    {user && (
                        <div className="mobile-user-info">
                            <strong>{user.name}</strong>
                            <span>({user.role})</span>
                        </div>
                    )}

                    <button
                        className="mobile-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;