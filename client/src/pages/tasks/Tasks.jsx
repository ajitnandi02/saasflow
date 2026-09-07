import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Tasks.css";

const Tasks = () => {
    const { user } = useAuth();

    // ==========================================
    // ROLE PERMISSIONS
    // ==========================================

    const isOwner = user?.role === "owner";

    const canManageTasks =
        user?.role === "owner" ||
        user?.role === "admin";

    // ==========================================
    // TASKS STATE
    // ==========================================

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // CREATE TASK STATE
    // ==========================================

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
    });

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [creating, setCreating] = useState(false);

    // ==========================================
    // EDIT TASK STATE
    // ==========================================

    const [editingTask, setEditingTask] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
    });

    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [updating, setUpdating] = useState(false);

    // ==========================================
    // DELETE TASK STATE
    // ==========================================

    const [deletingTask, setDeletingTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [deleting, setDeleting] = useState(false);

    // ==========================================
    // FETCH TASKS
    // ==========================================

    const fetchTasks = async () => {
        const response = await api.get("/tasks");

        setTasks(response.data.tasks || []);
    };

    // ==========================================
    // FETCH PROJECTS
    // ==========================================

    const fetchProjects = async () => {
        const response = await api.get("/projects");

        setProjects(response.data.projects || []);
    };

    // ==========================================
    // FETCH USERS
    // ==========================================

    const fetchUsers = async () => {
        const response = await api.get("/users");

        setUsers(response.data.users || []);
    };

    // ==========================================
    // INITIAL DATA LOAD
    // ==========================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                await Promise.all([
                    fetchTasks(),
                    fetchProjects(),
                    fetchUsers(),
                ]);
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Failed to load task data";

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // ==========================================
    // CREATE FORM CHANGE
    // ==========================================

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
        setFormSuccess("");
    };

    // ==========================================
    // OPEN CREATE FORM
    // ==========================================

    const openCreateForm = () => {
        if (!canManageTasks) {
            return;
        }

        setFormData({
            title: "",
            description: "",
            projectId: projects[0]?._id || "",
            assignedTo: "",
            status: "todo",
            priority: "medium",
        });

        setFormError("");
        setFormSuccess("");

        setShowForm(true);
    };

    // ==========================================
    // CLOSE CREATE FORM
    // ==========================================

    const closeCreateForm = () => {
        if (creating) return;

        setShowForm(false);

        setFormData({
            title: "",
            description: "",
            projectId: "",
            assignedTo: "",
            status: "todo",
            priority: "medium",
        });

        setFormError("");
        setFormSuccess("");
    };

    // ==========================================
    // CREATE TASK
    // ==========================================

    const handleCreateTask = async (event) => {
        event.preventDefault();

        if (!canManageTasks) {
            return;
        }

        setFormError("");
        setFormSuccess("");

        const title = formData.title.trim();
        const description = formData.description.trim();

        if (!title) {
            setFormError("Task title is required");
            return;
        }

        if (!formData.projectId) {
            setFormError("Please select a project");
            return;
        }

        try {
            setCreating(true);

            await api.post("/tasks", {
                title,
                description,
                projectId: formData.projectId,
                assignedTo: formData.assignedTo || undefined,
                status: formData.status,
                priority: formData.priority,
            });

            setFormSuccess(
                "Task created successfully!"
            );

            await fetchTasks();

            setTimeout(() => {
                setShowForm(false);

                setFormData({
                    title: "",
                    description: "",
                    projectId: "",
                    assignedTo: "",
                    status: "todo",
                    priority: "medium",
                });

                setFormSuccess("");
            }, 800);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to create task";

            setFormError(message);
        } finally {
            setCreating(false);
        }
    };

    // ==========================================
    // OPEN EDIT FORM
    // ==========================================

    const openEditForm = (task) => {
        if (!canManageTasks) {
            return;
        }

        setEditingTask(task);

        setEditFormData({
            title: task.title || "",
            description: task.description || "",
            projectId:
                task.projectId?._id ||
                task.projectId ||
                "",
            assignedTo:
                task.assignedTo?._id ||
                task.assignedTo ||
                "",
            status: task.status || "todo",
            priority: task.priority || "medium",
        });

        setEditError("");
        setEditSuccess("");

        setShowEditForm(true);
    };

    // ==========================================
    // CLOSE EDIT FORM
    // ==========================================

    const closeEditForm = () => {
        if (updating) return;

        setShowEditForm(false);
        setEditingTask(null);

        setEditFormData({
            title: "",
            description: "",
            projectId: "",
            assignedTo: "",
            status: "todo",
            priority: "medium",
        });

        setEditError("");
        setEditSuccess("");
    };

    // ==========================================
    // EDIT FORM CHANGE
    // ==========================================

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;

        setEditFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setEditError("");
        setEditSuccess("");
    };

    // ==========================================
    // UPDATE TASK
    // ==========================================

    const handleUpdateTask = async (event) => {
        event.preventDefault();

        if (!canManageTasks) {
            return;
        }

        setEditError("");
        setEditSuccess("");

        if (!editingTask) return;

        const title = editFormData.title.trim();
        const description =
            editFormData.description.trim();

        if (!title) {
            setEditError("Task title is required");
            return;
        }

        if (!editFormData.projectId) {
            setEditError("Please select a project");
            return;
        }

        try {
            setUpdating(true);

            await api.put(
                `/tasks/${editingTask._id}`,
                {
                    title,
                    description,
                    projectId: editFormData.projectId,
                    assignedTo:
                        editFormData.assignedTo || undefined,
                    status: editFormData.status,
                    priority: editFormData.priority,
                }
            );

            setEditSuccess(
                "Task updated successfully!"
            );

            await fetchTasks();

            setTimeout(() => {
                setShowEditForm(false);
                setEditingTask(null);

                setEditFormData({
                    title: "",
                    description: "",
                    projectId: "",
                    assignedTo: "",
                    status: "todo",
                    priority: "medium",
                });

                setEditSuccess("");
            }, 800);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to update task";

            setEditError(message);
        } finally {
            setUpdating(false);
        }
    };

    // ==========================================
    // OPEN DELETE MODAL
    // ==========================================

    const openDeleteModal = (task) => {
        if (!isOwner) {
            return;
        }

        setDeletingTask(task);

        setDeleteError("");
        setDeleteSuccess("");

        setShowDeleteModal(true);
    };

    // ==========================================
    // CLOSE DELETE MODAL
    // ==========================================

    const closeDeleteModal = () => {
        if (deleting) return;

        setShowDeleteModal(false);
        setDeletingTask(null);

        setDeleteError("");
        setDeleteSuccess("");
    };

    // ==========================================
    // DELETE TASK
    // ==========================================

    const handleDeleteTask = async () => {
        if (!deletingTask || !isOwner) {
            return;
        }

        try {
            setDeleting(true);

            setDeleteError("");
            setDeleteSuccess("");

            await api.delete(
                `/tasks/${deletingTask._id}`
            );

            setDeleteSuccess(
                "Task deleted successfully!"
            );

            setTasks((previousTasks) =>
                previousTasks.filter(
                    (task) =>
                        task._id !== deletingTask._id
                )
            );

            setTimeout(() => {
                setShowDeleteModal(false);
                setDeletingTask(null);
                setDeleteSuccess("");
            }, 800);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to delete task";

            setDeleteError(message);
        } finally {
            setDeleting(false);
        }
    };

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    const getProjectName = (task) => {
        if (task.projectId?.name) {
            return task.projectId.name;
        }

        const projectId =
            typeof task.projectId === "object"
                ? task.projectId?._id
                : task.projectId;

        const project = projects.find(
            (item) => item._id === projectId
        );

        return project?.name || "Unknown Project";
    };

    const getAssignedUserName = (task) => {
        if (task.assignedTo?.name) {
            return task.assignedTo.name;
        }

        if (!task.assignedTo) {
            return "Unassigned";
        }

        const assignedUser = users.find(
            (item) =>
                item._id === task.assignedTo
        );

        return assignedUser?.name || "Unknown User";
    };

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {
        return (
            <div className="tasks-message">
                <h2>Loading Tasks...</h2>
            </div>
        );
    }

    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {
        return (
            <div className="tasks-message">
                <h2>Tasks Error</h2>

                <p className="tasks-error">
                    {error}
                </p>
            </div>
        );
    }

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="tasks-page">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="tasks-header">

                <div>
                    <h1>Tasks</h1>

                    <p>
                        Manage tasks in your organization
                    </p>
                </div>

                <div className="tasks-header-actions">

                    <div className="tasks-count">

                        <span>
                            Total Tasks
                        </span>

                        <strong>
                            {tasks.length}
                        </strong>

                    </div>

                    {canManageTasks && (
                        <button
                            className="add-task-button"
                            onClick={openCreateForm}
                        >
                            + Add Task
                        </button>
                    )}

                </div>

            </div>

            {/* ======================================
                MEMBER INFORMATION
            ====================================== */}

            {!canManageTasks && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "14px 18px",
                        border: "1px solid #333",
                        borderRadius: "10px",
                        background: "#18181d",
                        fontSize: "14px",
                        opacity: 0.7,
                    }}
                >
                    You have view-only access to organization tasks.
                </div>
            )}

            {/* ======================================
                TASK LIST
            ====================================== */}

            <div className="tasks-grid">

                {tasks.map((task) => (

                    <div
                        className="task-card"
                        key={task._id}
                    >

                        <div className="task-card-header">

                            <h2>
                                {task.title}
                            </h2>

                            <span
                                className={`task-status task-status-${task.status}`}
                            >
                                {task.status}
                            </span>

                        </div>

                        <p className="task-description">

                            {task.description ||
                                "No description provided."}

                        </p>

                        <div className="task-info">

                            <div>
                                <span>
                                    Project
                                </span>

                                <strong>
                                    {getProjectName(task)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Assigned To
                                </span>

                                <strong>
                                    {getAssignedUserName(task)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Priority
                                </span>

                                <strong
                                    className={`task-priority task-priority-${task.priority}`}
                                >
                                    {task.priority}
                                </strong>
                            </div>

                        </div>

                        {/* ==================================
                            CARD FOOTER
                        ================================== */}

                        <div className="task-card-footer">

                            <span>
                                Created{" "}
                                {task.createdAt
                                    ? new Date(
                                        task.createdAt
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </span>

                            <div className="task-card-actions">

                                {canManageTasks && (
                                    <button
                                        className="edit-task-button"
                                        onClick={() =>
                                            openEditForm(task)
                                        }
                                    >
                                        Edit
                                    </button>
                                )}

                                {isOwner && (
                                    <button
                                        className="delete-task-button"
                                        onClick={() =>
                                            openDeleteModal(task)
                                        }
                                    >
                                        Delete
                                    </button>
                                )}

                                {!canManageTasks && (
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            opacity: 0.5,
                                        }}
                                    >
                                        View only
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {/* ======================================
                EMPTY STATE
            ====================================== */}

            {tasks.length === 0 && (

                <div className="empty-tasks">

                    <h3>
                        No Tasks Found
                    </h3>

                    <p>
                        There are currently no tasks
                        in this organization.
                    </p>

                </div>

            )}

            {/* ======================================
                CREATE TASK MODAL
            ====================================== */}

            {showForm && canManageTasks && (

                <div className="task-modal-overlay">

                    <div className="task-modal">

                        <div className="task-modal-header">

                            <div>

                                <h2>
                                    Add New Task
                                </h2>

                                <p>
                                    Create a new task
                                    for your organization.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-task-modal-button"
                                onClick={closeCreateForm}
                                disabled={creating}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="task-form"
                            onSubmit={handleCreateTask}
                        >

                            {/* TITLE */}

                            <div className="task-form-group">

                                <label>
                                    Task Title
                                </label>

                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Enter task title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="task-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Enter task description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleFormChange}
                                    disabled={creating}
                                    rows="4"
                                />

                            </div>

                            {/* PROJECT */}

                            <div className="task-form-group">

                                <label>
                                    Project
                                </label>

                                <select
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                >

                                    <option value="">
                                        Select Project
                                    </option>

                                    {projects.map(
                                        (project) => (

                                            <option
                                                key={
                                                    project._id
                                                }
                                                value={
                                                    project._id
                                                }
                                            >
                                                {project.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ASSIGNED USER */}

                            <div className="task-form-group">

                                <label>
                                    Assign To
                                </label>

                                <select
                                    name="assignedTo"
                                    value={
                                        formData.assignedTo
                                    }
                                    onChange={handleFormChange}
                                    disabled={creating}
                                >

                                    <option value="">
                                        Unassigned
                                    </option>

                                    {users.map(
                                        (item) => (

                                            <option
                                                key={
                                                    item._id
                                                }
                                                value={
                                                    item._id
                                                }
                                            >
                                                {item.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* STATUS */}

                            <div className="task-form-row">

                                <div className="task-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        disabled={creating}
                                    >

                                        <option value="todo">
                                            To Do
                                        </option>

                                        <option value="in-progress">
                                            In Progress
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                    </select>

                                </div>

                                {/* PRIORITY */}

                                <div className="task-form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={
                                            formData.priority
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        disabled={creating}
                                    >

                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="high">
                                            High
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* ERROR */}

                            {formError && (

                                <p className="form-error">
                                    {formError}
                                </p>

                            )}

                            {/* SUCCESS */}

                            {formSuccess && (

                                <p className="form-success">
                                    {formSuccess}
                                </p>

                            )}

                            {/* BUTTONS */}

                            <div className="task-form-actions">

                                <button
                                    type="button"
                                    className="cancel-task-button"
                                    onClick={closeCreateForm}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-task-button"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Task"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* ======================================
                EDIT TASK MODAL
            ====================================== */}

            {showEditForm && editingTask && canManageTasks && (

                <div className="task-modal-overlay">

                    <div className="task-modal">

                        <div className="task-modal-header">

                            <div>

                                <h2>
                                    Edit Task
                                </h2>

                                <p>
                                    Update task information.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-task-modal-button"
                                onClick={closeEditForm}
                                disabled={updating}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="task-form"
                            onSubmit={handleUpdateTask}
                        >

                            {/* TITLE */}

                            <div className="task-form-group">

                                <label>
                                    Task Title
                                </label>

                                <input
                                    name="title"
                                    type="text"
                                    value={
                                        editFormData.title
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="task-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        editFormData.description
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                    rows="4"
                                />

                            </div>

                            {/* PROJECT */}

                            <div className="task-form-group">

                                <label>
                                    Project
                                </label>

                                <select
                                    name="projectId"
                                    value={
                                        editFormData.projectId
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                >

                                    <option value="">
                                        Select Project
                                    </option>

                                    {projects.map(
                                        (project) => (

                                            <option
                                                key={
                                                    project._id
                                                }
                                                value={
                                                    project._id
                                                }
                                            >
                                                {project.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ASSIGNED USER */}

                            <div className="task-form-group">

                                <label>
                                    Assign To
                                </label>

                                <select
                                    name="assignedTo"
                                    value={
                                        editFormData.assignedTo
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                >

                                    <option value="">
                                        Unassigned
                                    </option>

                                    {users.map(
                                        (item) => (

                                            <option
                                                key={
                                                    item._id
                                                }
                                                value={
                                                    item._id
                                                }
                                            >
                                                {item.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* STATUS + PRIORITY */}

                            <div className="task-form-row">

                                <div className="task-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            editFormData.status
                                        }
                                        onChange={
                                            handleEditFormChange
                                        }
                                        disabled={updating}
                                    >

                                        <option value="todo">
                                            To Do
                                        </option>

                                        <option value="in-progress">
                                            In Progress
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                    </select>

                                </div>

                                <div className="task-form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={
                                            editFormData.priority
                                        }
                                        onChange={
                                            handleEditFormChange
                                        }
                                        disabled={updating}
                                    >

                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="high">
                                            High
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* ERROR */}

                            {editError && (

                                <p className="form-error">
                                    {editError}
                                </p>

                            )}

                            {/* SUCCESS */}

                            {editSuccess && (

                                <p className="form-success">
                                    {editSuccess}
                                </p>

                            )}

                            {/* BUTTONS */}

                            <div className="task-form-actions">

                                <button
                                    type="button"
                                    className="cancel-task-button"
                                    onClick={closeEditForm}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-task-button"
                                    disabled={updating}
                                >
                                    {updating
                                        ? "Updating..."
                                        : "Update Task"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* ======================================
                DELETE CONFIRMATION MODAL
            ====================================== */}

            {showDeleteModal && deletingTask && isOwner && (

                <div className="task-modal-overlay">

                    <div className="task-delete-modal">

                        <div className="task-delete-icon">
                            ⚠️
                        </div>

                        <h2>
                            Delete Task?
                        </h2>

                        <p>
                            Are you sure you want to
                            delete{" "}
                            <strong>
                                "{deletingTask.title}"
                            </strong>
                            ?
                        </p>

                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>

                        {deleteError && (

                            <p className="form-error">
                                {deleteError}
                            </p>

                        )}

                        {deleteSuccess && (

                            <p className="form-success">
                                {deleteSuccess}
                            </p>

                        )}

                        <div className="task-form-actions">

                            <button
                                type="button"
                                className="cancel-task-button"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-delete-task-button"
                                onClick={handleDeleteTask}
                                disabled={deleting}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Tasks;