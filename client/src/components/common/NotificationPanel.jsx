import { useEffect, useState } from "react";
import "./NotificationPanel.css";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../../services/notificationService";

const NotificationPanel = ({ onClose, onUnreadChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getNotifications();

            setNotifications(data.notifications || []);

            if (onUnreadChange) {
                const unreadCount = (data.notifications || []).filter(
                    (notification) => !notification.isRead
                ).length;

                onUnreadChange(unreadCount);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            if (onUnreadChange) {
                setNotifications((current) => {
                    const unreadCount = current.filter(
                        (notification) => !notification.isRead
                    ).length;

                    onUnreadChange(unreadCount);

                    return current;
                });
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

            if (onUnreadChange) {
                onUnreadChange(0);
            }
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);

            setNotifications((previous) =>
                previous.filter(
                    (notification) => notification._id !== id
                )
            );

            if (onUnreadChange) {
                setNotifications((current) => {
                    const unreadCount = current.filter(
                        (notification) => !notification.isRead
                    ).length;

                    onUnreadChange(unreadCount);

                    return current;
                });
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "task_assigned":
                return "📋";

            case "task_updated":
                return "🔄";

            case "project_created":
                return "📁";

            case "project_updated":
                return "✏️";

            case "user_added":
                return "👤";

            default:
                return "🔔";
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <div>
                    <h3>Notifications</h3>

                    {unreadCount > 0 && (
                        <span>
                            {unreadCount} unread
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="notification-close"
                >
                    ×
                </button>
            </div>

            {unreadCount > 0 && (
                <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="mark-all-button"
                >
                    Mark all as read
                </button>
            )}

            <div className="notification-list">
                {loading && (
                    <div className="notification-state">
                        Loading notifications...
                    </div>
                )}

                {!loading && error && (
                    <div className="notification-state error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    notifications.length === 0 && (
                        <div className="notification-state">
                            <div className="empty-icon">🔔</div>
                            <p>No notifications</p>
                            <span>
                                You're all caught up!
                            </span>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.isRead
                                ? "unread"
                                : ""
                                }`}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(
                                    notification.type
                                )}
                            </div>

                            <div className="notification-content">
                                <div className="notification-title-row">
                                    <h4>
                                        {notification.title}
                                    </h4>

                                    {!notification.isRead && (
                                        <span className="unread-dot"></span>
                                    )}
                                </div>

                                <p>
                                    {notification.message}
                                </p>

                                <small>
                                    {formatDate(
                                        notification.createdAt
                                    )}
                                </small>

                                <div className="notification-actions">
                                    {!notification.isRead && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification._id
                                                )
                                            }
                                        >
                                            Mark as read
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                notification._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default NotificationPanel;