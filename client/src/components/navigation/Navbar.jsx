import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUnreadCount } from "../../services/notificationService.js";
import NotificationPanel from "../common/NotificationPanel.jsx";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        setNotificationOpen(false);
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const getNavLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    // Load unread notification count
    const loadUnreadCount = async () => {
        try {
            const data = await getUnreadCount();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error(
                "Failed to load unread notifications:",
                error
            );
        }
    };

    useEffect(() => {
        if (user) {
            loadUnreadCount();
        }
    }, [user]);

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

                    {/* Notification */}
                    {user && (
                        <div className="notification-wrapper">
                            <button
                                type="button"
                                className="notification-button"
                                onClick={() =>
                                    setNotificationOpen(
                                        !notificationOpen
                                    )
                                }
                                aria-label="Notifications"
                            >
                                🔔

                                {unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <NotificationPanel
                                    onClose={() =>
                                        setNotificationOpen(false)
                                    }
                                    onUnreadChange={
                                        setUnreadCount
                                    }
                                />
                            )}
                        </div>
                    )}

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
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
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

                    {/* Mobile Notification */}
                    {user && (
                        <div className="mobile-notification-section">
                            <button
                                type="button"
                                className="mobile-notification-button"
                                onClick={() =>
                                    setNotificationOpen(
                                        !notificationOpen
                                    )
                                }
                            >
                                <span>
                                    🔔 Notifications
                                </span>

                                {unreadCount > 0 && (
                                    <span className="mobile-notification-badge">
                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <NotificationPanel
                                    onClose={() =>
                                        setNotificationOpen(false)
                                    }
                                    onUnreadChange={
                                        setUnreadCount
                                    }
                                />
                            )}
                        </div>
                    )}

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