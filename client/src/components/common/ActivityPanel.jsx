import { useEffect, useState } from "react";
import {
    getRecentActivities,
} from "../../services/activityService";
import "./ActivityPanel.css";

const ActivityPanel = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadActivities = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getRecentActivities();

            setActivities(data.activities || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load activities"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();
    }, []);

    const getActionIcon = (action) => {
        const icons = {
            created: "➕",
            updated: "✏️",
            deleted: "🗑️",
            assigned: "👤",
            status_changed: "🔄",
            added: "➕",
            removed: "➖",
        };

        return icons[action] || "📌";
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    if (loading) {
        return (
            <div className="activity-panel">
                <div className="activity-header">
                    <div>
                        <h2>Activity Log</h2>
                        <p>Recent activity in your organization</p>
                    </div>
                </div>

                <div className="activity-state">
                    <span>Loading activities...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="activity-panel">
                <div className="activity-header">
                    <div>
                        <h2>Activity Log</h2>
                        <p>Recent activity in your organization</p>
                    </div>
                </div>

                <div className="activity-state error">
                    <span>{error}</span>

                    <button onClick={loadActivities}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-panel">
            <div className="activity-header">
                <div>
                    <h2>Activity Log</h2>
                    <p>Recent activity in your organization</p>
                </div>

                <button
                    className="activity-refresh"
                    onClick={loadActivities}
                    title="Refresh activities"
                >
                    ↻
                </button>
            </div>

            {activities.length === 0 ? (
                <div className="activity-state">
                    <div className="activity-empty-icon">
                        📋
                    </div>

                    <h3>No activity yet</h3>

                    <p>
                        Organization activity will appear here.
                    </p>
                </div>
            ) : (
                <div className="activity-list">
                    {activities.map((activity) => (
                        <div
                            className="activity-item"
                            key={activity._id}
                        >
                            <div className="activity-icon">
                                {getActionIcon(activity.action)}
                            </div>

                            <div className="activity-content">
                                <p className="activity-description">
                                    {activity.description}
                                </p>

                                <div className="activity-meta">
                                    <span>
                                        👤{" "}
                                        {activity.user?.name ||
                                            "Unknown user"}
                                    </span>

                                    <span>
                                        🕒{" "}
                                        {formatDate(
                                            activity.createdAt
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityPanel;