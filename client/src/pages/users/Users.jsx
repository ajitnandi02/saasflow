import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Users.css";


// ==========================================
// USERS PAGE
// ==========================================

const Users = () => {

    const { user: currentUser } = useAuth();


    // ==========================================
    // USERS STATE
    // ==========================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // CREATE USER STATE
    // ==========================================

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "member",
    });

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [creating, setCreating] = useState(false);


    // ==========================================
    // EDIT USER STATE
    // ==========================================

    const [editingUser, setEditingUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const [editFormData, setEditFormData] = useState({
        name: "",
        email: "",
        role: "member",
    });

    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [updating, setUpdating] = useState(false);


    // ==========================================
    // DELETE USER STATE
    // ==========================================

    const [deletingUser, setDeletingUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] =
        useState(false);

    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);


    // ==========================================
    // ROLE PERMISSIONS
    // ==========================================

    const isOwner =
        currentUser?.role === "owner";

    const isAdmin =
        currentUser?.role === "admin";

    const canManageUsers =
        isOwner || isAdmin;


    // ==========================================
    // CHECK EDIT PERMISSION
    // ==========================================

    const canEditUser = (targetUser) => {

        if (!canManageUsers) {
            return false;
        }

        // Nobody can change owner role
        // Owner can still edit owner's name/email.
        return true;
    };


    // ==========================================
    // CHECK DELETE PERMISSION
    // ==========================================

    const canDeleteUser = (targetUser) => {

        if (!canManageUsers) {
            return false;
        }

        // Owner account cannot be deleted.
        if (targetUser.role === "owner") {
            return false;
        }

        return true;
    };


    // ==========================================
    // FETCH USERS
    // ==========================================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/users");

            setUsers(response.data.users || []);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to load users";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchUsers();

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

        if (!canManageUsers) {
            return;
        }

        setFormData({
            name: "",
            email: "",
            password: "",
            role: "member",
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
            email: "",
            password: "",
            role: "member",
        });

        setFormError("");
        setFormSuccess("");
    };


    // ==========================================
    // CREATE USER
    // ==========================================

    const handleCreateUser = async (event) => {

        event.preventDefault();

        if (!canManageUsers) {
            return;
        }

        setFormError("");
        setFormSuccess("");

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!name || !email || !password) {

            setFormError(
                "Name, email and password are required"
            );

            return;
        }

        if (password.length < 6) {

            setFormError(
                "Password must be at least 6 characters long"
            );

            return;
        }

        try {

            setCreating(true);

            await api.post("/users", {
                name,
                email,
                password,
                role: formData.role,
            });

            setFormSuccess(
                "User created successfully!"
            );

            await fetchUsers();

            setTimeout(() => {

                setShowForm(false);

                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "member",
                });

                setFormSuccess("");

            }, 800);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to create user";

            setFormError(message);

        } finally {

            setCreating(false);
        }
    };


    // ==========================================
    // OPEN EDIT USER MODAL
    // ==========================================

    const openEditForm = (targetUser) => {

        if (!canEditUser(targetUser)) {
            return;
        }

        setEditingUser(targetUser);

        setEditFormData({
            name: targetUser.name || "",
            email: targetUser.email || "",
            role: targetUser.role || "member",
        });

        setEditError("");
        setEditSuccess("");

        setShowEditForm(true);
    };


    // ==========================================
    // CLOSE EDIT MODAL
    // ==========================================

    const closeEditForm = () => {

        if (updating) {
            return;
        }

        setShowEditForm(false);
        setEditingUser(null);

        setEditFormData({
            name: "",
            email: "",
            role: "member",
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
    // UPDATE USER
    // ==========================================

    const handleUpdateUser = async (event) => {

        event.preventDefault();

        if (!editingUser || !canManageUsers) {
            return;
        }

        setEditError("");
        setEditSuccess("");

        const name = editFormData.name.trim();
        const email = editFormData.email.trim().toLowerCase();


        if (!name || !email) {

            setEditError(
                "Name and email are required"
            );

            return;
        }


        // Owner role cannot be changed.
        if (
            editingUser.role === "owner" &&
            editFormData.role !== "owner"
        ) {

            setEditError(
                "Owner role cannot be changed"
            );

            return;
        }


        // Admin cannot demote another admin.
        if (
            currentUser?.role === "admin" &&
            editingUser.role === "admin" &&
            editFormData.role !== "admin"
        ) {

            setEditError(
                "Admin cannot change another admin's role"
            );

            return;
        }


        // User cannot change their own role.
        if (
            editingUser._id === currentUser?._id &&
            editFormData.role !== editingUser.role
        ) {

            setEditError(
                "You cannot change your own role"
            );

            return;
        }


        try {

            setUpdating(true);

            await api.put(
                `/users/${editingUser._id}`,
                {
                    name,
                    email,
                    role: editFormData.role,
                }
            );

            setEditSuccess(
                "User updated successfully!"
            );

            await fetchUsers();


            // If current user changes their own
            // name/email, refresh local auth data.
            if (
                editingUser._id === currentUser?._id
            ) {

                const updatedUser = {
                    ...currentUser,
                    name,
                    email,
                    role: editFormData.role,
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );
            }


            setTimeout(() => {

                setShowEditForm(false);
                setEditingUser(null);

                setEditFormData({
                    name: "",
                    email: "",
                    role: "member",
                });

                setEditSuccess("");

            }, 800);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to update user";

            setEditError(message);

        } finally {

            setUpdating(false);
        }
    };


    // ==========================================
    // OPEN DELETE CONFIRMATION
    // ==========================================

    const openDeleteConfirm = (targetUser) => {

        if (!canDeleteUser(targetUser)) {
            return;
        }

        setDeletingUser(targetUser);

        setDeleteError("");

        setShowDeleteConfirm(true);
    };


    // ==========================================
    // CLOSE DELETE CONFIRMATION
    // ==========================================

    const closeDeleteConfirm = () => {

        if (deleting) {
            return;
        }

        setShowDeleteConfirm(false);
        setDeletingUser(null);

        setDeleteError("");
    };


    // ==========================================
    // DELETE USER
    // ==========================================

    const handleDeleteUser = async () => {

        if (
            !deletingUser ||
            !canDeleteUser(deletingUser)
        ) {
            return;
        }

        try {

            setDeleting(true);

            setDeleteError("");

            await api.delete(
                `/users/${deletingUser._id}`
            );

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (item) =>
                        item._id !== deletingUser._id
                )
            );

            setShowDeleteConfirm(false);
            setDeletingUser(null);

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to delete user";

            setDeleteError(message);

        } finally {

            setDeleting(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="users-message">

                <h2>
                    Loading Users...
                </h2>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="users-message">

                <div>

                    <h2>
                        Users Error
                    </h2>

                    <p className="users-error">
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

        <div className="users-page">


            {/* ==================================
                USERS HEADER
            ================================== */}

            <div className="users-header">

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
                        Team Management
                    </p>

                    <h1>
                        Users
                    </h1>

                    <p>
                        Manage users in your organization
                    </p>

                </div>


                <div className="users-header-actions">


                    {/* TOTAL USERS */}

                    <div className="users-count">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {users.length}
                        </strong>

                    </div>


                    {/* ADD USER */}

                    {canManageUsers && (

                        <button
                            className="add-user-button"
                            onClick={openCreateForm}
                        >
                            + Add User
                        </button>

                    )}

                </div>

            </div>


            {/* ==================================
                MEMBER INFORMATION
            ================================== */}

            {!canManageUsers && (

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
                    You have view-only access to the
                    organization users.
                </div>

            )}


            {/* ==================================
                USERS TABLE
            ================================== */}

            <div className="users-table-container">

                <table className="users-table">

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Joined
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.map((targetUser) => (

                            <tr
                                key={targetUser._id}
                            >


                                {/* NAME */}

                                <td>

                                    <div className="user-name">

                                        {targetUser.name}

                                    </div>

                                </td>


                                {/* EMAIL */}

                                <td>

                                    <span className="user-email">

                                        {targetUser.email}

                                    </span>

                                </td>


                                {/* ROLE */}

                                <td>

                                    <span
                                        className={`role-badge role-${targetUser.role}`}
                                    >
                                        {targetUser.role}
                                    </span>

                                </td>


                                {/* JOINED */}

                                <td>

                                    {targetUser.createdAt
                                        ? new Date(
                                            targetUser.createdAt
                                        ).toLocaleDateString()
                                        : "N/A"}

                                </td>


                                {/* ACTIONS */}

                                <td>

                                    <div className="user-actions">


                                        {/* EDIT */}

                                        {canEditUser(targetUser) && (

                                            <button
                                                className="edit-user-button"
                                                onClick={() =>
                                                    openEditForm(
                                                        targetUser
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        )}


                                        {/* DELETE */}

                                        {canDeleteUser(targetUser) && (

                                            <button
                                                className="delete-user-button"
                                                onClick={() =>
                                                    openDeleteConfirm(
                                                        targetUser
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        )}


                                        {/* NO ACTION */}

                                        {!canManageUsers && (

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

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>


                {/* ==================================
                    EMPTY STATE
                ================================== */}

                {users.length === 0 && (

                    <div className="empty-users">

                        <h3>
                            No Users Found
                        </h3>

                        <p>
                            There are currently no users
                            in this organization.
                        </p>

                    </div>

                )}

            </div>


            {/* ==================================
                CREATE USER MODAL
            ================================== */}

            {showForm && canManageUsers && (

                <div className="user-modal-overlay">

                    <div className="user-modal">


                        {/* HEADER */}

                        <div className="user-modal-header">

                            <div>

                                <h2>
                                    Add New User
                                </h2>

                                <p>
                                    Create a new user for your
                                    organization.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={closeCreateForm}
                                disabled={creating}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="user-form"
                            onSubmit={handleCreateUser}
                        >


                            {/* NAME */}

                            <div className="form-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                />

                            </div>


                            {/* ROLE */}

                            <div className="form-group">

                                <label htmlFor="role">
                                    Role
                                </label>

                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleFormChange}
                                    disabled={creating}
                                >

                                    <option value="member">
                                        Member
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                </select>

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

                            <div className="user-form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeCreateForm}
                                    disabled={creating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-user-button"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ==================================
                EDIT USER MODAL
            ================================== */}

            {showEditForm && editingUser && (

                <div className="user-modal-overlay">

                    <div className="user-modal">


                        {/* HEADER */}

                        <div className="user-modal-header">

                            <div>

                                <h2>
                                    Edit User
                                </h2>

                                <p>
                                    Update user information.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-modal-button"
                                onClick={closeEditForm}
                                disabled={updating}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="user-form"
                            onSubmit={handleUpdateUser}
                        >


                            {/* NAME */}

                            <div className="form-group">

                                <label htmlFor="edit-name">
                                    Full Name
                                </label>

                                <input
                                    id="edit-name"
                                    name="name"
                                    type="text"
                                    value={editFormData.name}
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label htmlFor="edit-email">
                                    Email
                                </label>

                                <input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    value={editFormData.email}
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={updating}
                                />

                            </div>


                            {/* ROLE */}

                            <div className="form-group">

                                <label htmlFor="edit-role">
                                    Role
                                </label>

                                <select
                                    id="edit-role"
                                    name="role"
                                    value={editFormData.role}
                                    onChange={
                                        handleEditFormChange
                                    }
                                    disabled={
                                        updating ||
                                        editingUser.role === "owner" ||
                                        (
                                            currentUser?.role === "admin" &&
                                            editingUser.role === "admin"
                                        ) ||
                                        editingUser._id === currentUser?._id
                                    }
                                >

                                    <option value="member">
                                        Member
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                    {editingUser.role === "owner" && (

                                        <option value="owner">
                                            Owner
                                        </option>

                                    )}

                                </select>


                                {/* OWNER MESSAGE */}

                                {editingUser.role === "owner" && (

                                    <small>
                                        Owner role cannot be changed.
                                    </small>

                                )}


                                {/* ADMIN MESSAGE */}

                                {currentUser?.role === "admin" &&
                                    editingUser.role === "admin" && (

                                        <small>
                                            Admin cannot change another
                                            admin's role.
                                        </small>

                                    )}


                                {/* SELF ROLE MESSAGE */}

                                {editingUser._id === currentUser?._id && (

                                    <small>
                                        You cannot change your own role.
                                    </small>

                                )}

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

                            <div className="user-form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeEditForm}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-user-button"
                                    disabled={updating}
                                >
                                    {updating
                                        ? "Updating..."
                                        : "Update User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ==================================
                DELETE CONFIRMATION
            ================================== */}

            {showDeleteConfirm && deletingUser && (

                <div className="user-modal-overlay">

                    <div className="delete-modal">


                        <div className="delete-modal-icon">
                            !
                        </div>


                        <h2>
                            Delete User?
                        </h2>


                        <p>

                            Are you sure you want to delete{" "}

                            <strong>
                                {deletingUser.name}
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


                        <div className="user-form-actions">


                            <button
                                type="button"
                                className="cancel-button"
                                onClick={closeDeleteConfirm}
                                disabled={deleting}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="confirm-delete-button"
                                onClick={handleDeleteUser}
                                disabled={deleting}
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete User"}
                            </button>


                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default Users;