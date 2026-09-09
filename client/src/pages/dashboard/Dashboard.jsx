import { useEffect, useState } from "react";
import api from "../../services/api.js";
import ActivityPanel from "../../components/common/ActivityPanel.jsx";
import "./Dashboard.css";

// ==========================================
// DASHBOARD PAGE
// ==========================================

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/dashboard/stats"
            );

            setDashboard(response.data);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to load dashboard";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (
            <div className="dashboard-message">

                <div className="dashboard-loading-box">

                    <div className="dashboard-spinner">
                        ⟳
                    </div>

                    <h2>
                        Loading Dashboard...
                    </h2>

                    <p>
                        Fetching your organization data.
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {

        return (
            <div className="dashboard-message">

                <div className="dashboard-error-box">

                    <div className="dashboard-error-icon">
                        !
                    </div>

                    <h2>
                        Dashboard Error
                    </h2>

                    <p className="dashboard-error">
                        {error}
                    </p>

                    <button
                        className="dashboard-retry-button"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // NO DATA
    // ==========================================

    if (!dashboard) {

        return (
            <div className="dashboard-message">

                <div className="dashboard-empty-box">

                    <h2>
                        No Dashboard Data
                    </h2>

                    <p>
                        Dashboard data is currently unavailable.
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // EXTRACT DATA
    // ==========================================

    const {
        organization,
        statistics,
        tasksByStatus,
        tasksByPriority,
    } = dashboard;


    // ==========================================
    // CALCULATE TOTALS
    // ==========================================

    const totalTasks = statistics.totalTasks;

    const todoPercentage =
        totalTasks > 0
            ? Math.round(
                (tasksByStatus.todo / totalTasks) * 100
            )
            : 0;

    const inProgressPercentage =
        totalTasks > 0
            ? Math.round(
                (tasksByStatus.inProgress / totalTasks) * 100
            )
            : 0;

    const completedPercentage =
        totalTasks > 0
            ? Math.round(
                (tasksByStatus.completed / totalTasks) * 100
            )
            : 0;

    const lowPriorityPercentage =
        totalTasks > 0
            ? Math.round(
                (tasksByPriority.low / totalTasks) * 100
            )
            : 0;

    const mediumPriorityPercentage =
        totalTasks > 0
            ? Math.round(
                (tasksByPriority.medium / totalTasks) * 100
            )
            : 0;

    const highPriorityPercentage =
        totalTasks > 0
            ? Math.round(
                (tasksByPriority.high / totalTasks) * 100
            )
            : 0;


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="dashboard-page">


            {/* ==================================
                DASHBOARD HEADER
            ================================== */}

            <div className="dashboard-header">

                <div className="dashboard-header-content">

                    <div>

                        <p className="dashboard-eyebrow">
                            Organization Dashboard
                        </p>

                        <h1>
                            {organization.name}
                        </h1>

                        <p className="dashboard-subtitle">
                            Overview of your organization's
                            users, projects and tasks.
                        </p>

                        <div className="organization-slug">

                            <span>
                                Organization Slug
                            </span>

                            <strong>
                                {organization.slug}
                            </strong>

                        </div>

                    </div>


                    <button
                        className="dashboard-refresh-button"
                        onClick={fetchDashboard}
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>


            {/* ==================================
                STATISTICS
            ================================== */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            Overview
                        </p>

                        <h2>
                            Organization Statistics
                        </h2>

                    </div>

                </div>


                <div className="stats-grid">


                    {/* TOTAL USERS */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <span className="stat-label">
                                Total Users
                            </span>

                            <span className="stat-icon">
                                👥
                            </span>

                        </div>

                        <strong className="stat-number">
                            {statistics.totalUsers}
                        </strong>

                        <p className="stat-description">
                            Members in your organization
                        </p>

                    </div>


                    {/* TOTAL PROJECTS */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <span className="stat-label">
                                Total Projects
                            </span>

                            <span className="stat-icon">
                                📁
                            </span>

                        </div>

                        <strong className="stat-number">
                            {statistics.totalProjects}
                        </strong>

                        <p className="stat-description">
                            Projects across your organization
                        </p>

                    </div>


                    {/* TOTAL TASKS */}

                    <div className="stat-card">

                        <div className="stat-card-top">

                            <span className="stat-label">
                                Total Tasks
                            </span>

                            <span className="stat-icon">
                                ✓
                            </span>

                        </div>

                        <strong className="stat-number">
                            {statistics.totalTasks}
                        </strong>

                        <p className="stat-description">
                            Tasks assigned to your team
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================
                TASK STATUS
            ================================== */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            Task Management
                        </p>

                        <h2>
                            Tasks by Status
                        </h2>

                    </div>

                    <span className="section-total">
                        {totalTasks} Total Tasks
                    </span>

                </div>


                <div className="dashboard-grid">


                    {/* TODO */}

                    <div className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>

                                <span className="dashboard-card-label">
                                    To Do
                                </span>

                                <strong>
                                    {tasksByStatus.todo}
                                </strong>

                            </div>

                            <span className="status-dot status-dot-todo">
                                ●
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${todoPercentage}%`,
                                }}
                            />

                        </div>


                        <p>
                            {todoPercentage}% of all tasks
                        </p>

                    </div>


                    {/* IN PROGRESS */}

                    <div className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>

                                <span className="dashboard-card-label">
                                    In Progress
                                </span>

                                <strong>
                                    {tasksByStatus.inProgress}
                                </strong>

                            </div>

                            <span className="status-dot status-dot-progress">
                                ●
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${inProgressPercentage}%`,
                                }}
                            />

                        </div>


                        <p>
                            {inProgressPercentage}% of all tasks
                        </p>

                    </div>


                    {/* COMPLETED */}

                    <div className="dashboard-card">

                        <div className="dashboard-card-header">

                            <div>

                                <span className="dashboard-card-label">
                                    Completed
                                </span>

                                <strong>
                                    {tasksByStatus.completed}
                                </strong>

                            </div>

                            <span className="status-dot status-dot-completed">
                                ●
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${completedPercentage}%`,
                                }}
                            />

                        </div>


                        <p>
                            {completedPercentage}% of all tasks
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================
                TASK PRIORITY
            ================================== */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            Task Management
                        </p>

                        <h2>
                            Tasks by Priority
                        </h2>

                    </div>

                </div>


                <div className="dashboard-grid">


                    {/* LOW */}

                    <div className="dashboard-card priority-card">

                        <div className="dashboard-card-header">

                            <div>

                                <span className="dashboard-card-label">
                                    Low Priority
                                </span>

                                <strong>
                                    {tasksByPriority.low}
                                </strong>

                            </div>

                            <span className="priority-badge priority-low">
                                Low
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${lowPriorityPercentage}%`,
                                }}
                            />

                        </div>


                        <p>
                            {lowPriorityPercentage}% of all tasks
                        </p>

                    </div>


                    {/* MEDIUM */}

                    <div className="dashboard-card priority-card">

                        <div className="dashboard-card-header">

                            <div>

                                <span className="dashboard-card-label">
                                    Medium Priority
                                </span>

                                <strong>
                                    {tasksByPriority.medium}
                                </strong>

                            </div>

                            <span className="priority-badge priority-medium">
                                Medium
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${mediumPriorityPercentage}%`,
                                }}
                            />

                        </div>


                        <p>
                            {mediumPriorityPercentage}% of all tasks
                        </p>

                    </div>


                    {/* HIGH */}

                    <div className="dashboard-card priority-card">

                        <div className="dashboard-card-header">

                            <div>

                                <span className="dashboard-card-label">
                                    High Priority
                                </span>

                                <strong>
                                    {tasksByPriority.high}
                                </strong>

                            </div>

                            <span className="priority-badge priority-high">
                                High
                            </span>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${highPriorityPercentage}%`,
                                }}
                            />

                        </div>


                        <p>
                            {highPriorityPercentage}% of all tasks
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================
                ACTIVITY LOG
            ================================== */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            Organization Activity
                        </p>

                        <h2>
                            Recent Activity
                        </h2>

                    </div>

                </div>

                <ActivityPanel />

            </section>


            {/* ==================================
                DASHBOARD SUMMARY
            ================================== */}

            <section className="dashboard-summary">

                <div>

                    <span>
                        Organization
                    </span>

                    <strong>
                        {organization.name}
                    </strong>

                </div>


                <div>

                    <span>
                        Users
                    </span>

                    <strong>
                        {statistics.totalUsers}
                    </strong>

                </div>


                <div>

                    <span>
                        Projects
                    </span>

                    <strong>
                        {statistics.totalProjects}
                    </strong>

                </div>


                <div>

                    <span>
                        Tasks
                    </span>

                    <strong>
                        {statistics.totalTasks}
                    </strong>

                </div>

            </section>

        </div>
    );
};


export default Dashboard;