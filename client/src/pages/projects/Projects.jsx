import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Projects.css";


// ==========================================
// PROJECTS PAGE
// ==========================================

const Projects = () => {

    const { user } = useAuth();

    // ==========================================
    // ROLE PERMISSIONS
    // ==========================================

    const isOwner = user?.role === "owner";

    const canManageProjects =
        user?.role === "owner" ||
        user?.role === "admin";


    // ==========================================
    // PROJECTS STATE
    // ==========================================

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // CREATE PROJECT STATE
    // ==========================================

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [creating, setCreating] = useState(false);


    // ==========================================
    // EDIT PROJECT STATE
    // ==========================================

    const [editingProject, setEditingProject] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        status: "active",
    });

    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [updating, setUpdating] = useState(false);


    // ==========================================
    // DELETE PROJECT STATE
    // ==========================================

    const [deletingProject, setDeletingProject] = useState(null);
    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleteError, setDeleteError] = useState("");
    const [deleteSuccess, setDeleteSuccess] = useState("");
    const [deleting, setDeleting] = useState(false);


    // ==========================================
    // FETCH PROJECTS
    // ==========================================

    const fetchProjects = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/projects");

            setProjects(response.data.projects || []);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to load projects";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchProjects();

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

        if (!canManageProjects) {
            return;
        }

        setFormData({
            name: "",
            description: "",
        });

        setFormError("");
        setFormSuccess("");

        setShowForm(true);
    };


    // ==========================================
    // CLOSE CREATE FORM
    // ==========================================

    const closeCreateForm = () => {

        if (creating) {
            return;
        }

        setShowForm(false);

        setFormData({
            name: "",
            description: "",
        });

        setFormError("");
        setFormSuccess("");
    };


    // ==========================================
    // CREATE PROJECT
    // ==========================================

    const handleCreateProject = async (event) => {

        event.preventDefault();

        if (!canManageProjects) {
            return;
        }

        setFormError("");
        setFormSuccess("");

        const name = formData.name.trim();
        const description = formData.description.trim();


        if (!name) {

            setFormError(
                "Project name is required"
            );

            return;
        }


        try {

            setCreating(true);

            await api.post("/projects", {
                name,
                description,
            });

            setFormSuccess(
                "Project created successfully!"
            );

            await fetchProjects();


            setTimeout(() => {

                setShowForm(false);

                setFormData({
                    name: "",
                    description: "",
                });

                setFormSuccess("");

            }, 800);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to create project";

            setFormError(message);

        } finally {

            setCreating(false);
        }
    };


    // ==========================================
    // OPEN EDIT FORM
    // ==========================================

    const openEditForm = (project) => {

        if (!canManageProjects) {
            return;
        }

        setEditingProject(project);

        setEditFormData({
            name: project.name || "",
            description: project.description || "",
            status: project.status || "active",
        });

        setEditError("");
        setEditSuccess("");

        setShowEditForm(true);
    };


    // ==========================================
    // CLOSE EDIT FORM
    // ==========================================

    const closeEditForm = () => {

        if (updating) {
            return;
        }

        setShowEditForm(false);
        setEditingProject(null);

        setEditFormData({
            name: "",
            description: "",
            status: "active",
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
    // UPDATE PROJECT
    // ==========================================

    const handleUpdateProject = async (event) => {

        event.preventDefault();

        if (!editingProject || !canManageProjects) {
            return;
        }

        setEditError("");
        setEditSuccess("");

        const name = editFormData.name.trim();
        const description =
            editFormData.description.trim();


        if (!name) {

            setEditError(
                "Project name is required"
            );

            return;
        }


        try {

            setUpdating(true);

            await api.put(
                `/projects/${editingProject._id}`,
                {
                    name,
                    description,
                    status: editFormData.status,
                }
            );

            setEditSuccess(
                "Project updated successfully!"
            );

            await fetchProjects();


            setTimeout(() => {

                setShowEditForm(false);
                setEditingProject(null);

                setEditFormData({
                    name: "",
                    description: "",
                    status: "active",
                });

                setEditSuccess("");

            }, 800);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to update project";

            setEditError(message);

        } finally {

            setUpdating(false);
        }
    };


    // ==========================================
    // OPEN DELETE MODAL
    // ==========================================

    const openDeleteModal = (project) => {

        if (!isOwner) {
            return;
        }

        setDeletingProject(project);

        setDeleteError("");
        setDeleteSuccess("");

        setShowDeleteModal(true);
    };


    // ==========================================
    // CLOSE DELETE MODAL
    // ==========================================

    const closeDeleteModal = () => {

        if (deleting) {
            return;
        }

        setShowDeleteModal(false);
        setDeletingProject(null);

        setDeleteError("");
        setDeleteSuccess("");
    };


    // ==========================================
    // DELETE PROJECT
    // ==========================================

    const handleDeleteProject = async () => {

        if (
            !deletingProject ||
            !isOwner
        ) {
            return;
        }


        try {

            setDeleting(true);
            setDeleteError("");
            setDeleteSuccess("");

            await api.delete(
                `/projects/${deletingProject._id}`
            );

            setDeleteSuccess(
                "Project deleted successfully!"
            );


            setProjects((previousProjects) =>
                previousProjects.filter(
                    (project) =>
                        project._id !== deletingProject._id
                )
            );


            setTimeout(() => {

                setShowDeleteModal(false);
                setDeletingProject(null);
                setDeleteSuccess("");

            }, 800);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to delete project";

            setDeleteError(message);

        } finally {

            setDeleting(false);
        }
    };


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (
            <div className="projects-message">

                <h2>
                    Loading Projects...
                </h2>

            </div>
        );
    }


    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {

        return (
            <div className="projects-message">

                <div>

                    <h2>
                        Projects Error
                    </h2>

                    <p className="projects-error">
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="projects-page">


            {/* ==================================
                PROJECT HEADER
            ================================== */}

            <div className="projects-header">

                <div>

                    <p
                        style={{
                            margin: 0,
                            marginBottom: "6px",
                            fontSize: "13px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            opacity: 0.5,
                        }}
                    >
                        Project Management
                    </p>

                    <h1>
                        Projects
                    </h1>

                    <p>
                        Manage projects in your organization
                    </p>

                </div>


                <div className="projects-header-actions">


                    {/* TOTAL PROJECTS */}

                    <div className="projects-count">

                        <span>
                            Total Projects
                        </span>

                        <strong>
                            {projects.length}
                        </strong>

                    </div>


                    {/* ADD PROJECT */}

                    {canManageProjects && (

                        <button
                            className="add-project-button"
                            onClick={openCreateForm}
                        >
                            + Add Project
                        </button>

                    )}

                </div>

            </div>


            {/* ==================================
                MEMBER INFORMATION
            ================================== */}

            {!canManageProjects && (

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
                    You have view-only access to
                    organization projects.
                </div>

            )}


            {/* ==================================
                PROJECT GRID
            ================================== */}

            <div className="projects-grid">

                {projects.map((project) => (

                    <div
                        className="project-card"
                        key={project._id}
                    >

                        {/* PROJECT HEADER */}

                        <div className="project-card-header">

                            <h2>
                                {project.name}
                            </h2>

                            <span
                                className={`project-status status-${project.status}`}
                            >
                                {project.status}
                            </span>

                        </div>


                        {/* DESCRIPTION */}

                        <p className="project-description">

                            {project.description ||
                                "No description provided."}

                        </p>


                        {/* PROJECT FOOTER */}

                        <div className="project-card-footer">

                            <span>
                                Created{" "}

                                {project.createdAt
                                    ? new Date(
                                        project.createdAt
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </span>


                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >

                                {/* EDIT */}

                                {canManageProjects && (

                                    <button
                                        className="edit-project-button"
                                        onClick={() =>
                                            openEditForm(project)
                                        }
                                    >
                                        Edit
                                    </button>

                                )}


                                {/* DELETE */}

                                {isOwner && (

                                    <button
                                        className="delete-project-button"
                                        onClick={() =>
                                            openDeleteModal(project)
                                        }
                                    >
                                        Delete
                                    </button>

                                )}


                                {/* VIEW ONLY */}

                                {!canManageProjects && (

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


            {/* ==================================
                EMPTY STATE
            ================================== */}

            {projects.length === 0 && (

                <div className="empty-projects">

                    <h3>
                        No Projects Found
                    </h3>

                    <p>
                        There are currently no projects
                        in this organization.
                    </p>

                </div>

            )}


            {/* ==================================
                CREATE PROJECT MODAL
            ================================== */}

            {showForm && canManageProjects && (

                <div className="project-modal-overlay">

                    <div className="project-modal">


                        {/* HEADER */}

                        <div className="project-modal-header">

                            <div>

                                <h2>
                                    Add New Project
                                </h2>

                                <p>
                                    Create a new project
                                    for your organization.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-project-modal-button"
                                onClick={closeCreateForm}
                                disabled={creating}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="project-form"
                            onSubmit={handleCreateProject}
                        >


                            {/* NAME */}

                            <div className="project-form-group">

                                <label htmlFor="project-name">
                                    Project Name
                                </label>

                                <input
                                    id="project-name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter project name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="project-form-group">

                                <label htmlFor="project-description">
                                    Description
                                </label>

                                <textarea
                                    id="project-description"
                                    name="description"
                                    placeholder="Enter project description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                    rows="5"
                                />

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


                            {/* ACTIONS */}

                            <div className="project-form-actions">

                                <button
                                    type="button"
                                    className="cancel-project-button"
                                    onClick={closeCreateForm}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="create-project-button"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Project"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ==================================
                EDIT PROJECT MODAL
            ================================== */}

            {showEditForm && editingProject && canManageProjects && (

                <div className="project-modal-overlay">

                    <div className="project-modal">


                        {/* HEADER */}

                        <div className="project-modal-header">

                            <div>

                                <h2>
                                    Edit Project
                                </h2>

                                <p>
                                    Update project information.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-project-modal-button"
                                onClick={closeEditForm}
                                disabled={updating}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="project-form"
                            onSubmit={handleUpdateProject}
                        >


                            {/* NAME */}

                            <div className="project-form-group">

                                <label htmlFor="edit-project-name">
                                    Project Name
                                </label>

                                <input
                                    id="edit-project-name"
                                    name="name"
                                    type="text"
                                    value={
                                        editFormData.name
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="project-form-group">

                                <label htmlFor="edit-project-description">
                                    Description
                                </label>

                                <textarea
                                    id="edit-project-description"
                                    name="description"
                                    value={
                                        editFormData.description
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                    rows="5"
                                />

                            </div>


                            {/* STATUS */}

                            <div className="project-form-group">

                                <label htmlFor="edit-project-status">
                                    Status
                                </label>

                                <select
                                    id="edit-project-status"
                                    name="status"
                                    value={
                                        editFormData.status
                                    }
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                    <option value="archived">
                                        Archived
                                    </option>

                                </select>

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


                            {/* ACTIONS */}

                            <div className="project-form-actions">

                                <button
                                    type="button"
                                    className="cancel-project-button"
                                    onClick={closeEditForm}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="create-project-button"
                                    disabled={updating}
                                >
                                    {updating
                                        ? "Updating..."
                                        : "Update Project"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ==================================
                DELETE CONFIRMATION MODAL
            ================================== */}

            {showDeleteModal && deletingProject && isOwner && (

                <div className="project-modal-overlay">

                    <div className="project-delete-modal">


                        <div className="project-delete-icon">
                            ⚠️
                        </div>


                        <h2>
                            Delete Project?
                        </h2>


                        <p>

                            Are you sure you want to delete{" "}

                            <strong>
                                "{deletingProject.name}"
                            </strong>

                            ?

                        </p>


                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>


                        {/* ERROR */}

                        {deleteError && (

                            <p className="form-error">
                                {deleteError}
                            </p>

                        )}


                        {/* SUCCESS */}

                        {deleteSuccess && (

                            <p className="form-success">
                                {deleteSuccess}
                            </p>

                        )}


                        {/* ACTION BUTTONS */}

                        <div className="project-form-actions">

                            <button
                                type="button"
                                className="cancel-project-button"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="confirm-delete-project-button"
                                onClick={handleDeleteProject}
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


export default Projects;