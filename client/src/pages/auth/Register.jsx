import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";


// ==========================================
// REGISTER PAGE
// ==========================================

const Register = () => {

    const navigate = useNavigate();

    const { login } = useAuth();


    // ======================================
    // FORM STATE
    // ======================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        organizationName: "",
    });


    // ======================================
    // UI STATE
    // ======================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ======================================
    // HANDLE INPUT
    // ======================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };


    // ======================================
    // HANDLE SUBMIT
    // ======================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ==================================
        // BASIC VALIDATION
        // ==================================

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.organizationName.trim()
        ) {
            setError(
                "All fields are required"
            );

            return;
        }


        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters long"
            );

            return;
        }


        try {

            setLoading(true);


            // ==================================
            // REGISTER API
            // ==================================

            const response = await api.post(
                "/auth/register",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    organizationName:
                        formData.organizationName.trim(),
                }
            );


            // ==================================
            // GET RESPONSE DATA
            // ==================================

            const {
                token,
                user,
                organization,
            } = response.data;


            // ==================================
            // SAVE AUTH DATA
            // ==================================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "organization",
                JSON.stringify(organization)
            );


            // ==================================
            // UPDATE AUTH CONTEXT
            // ==================================

            // Login function is not used here
            // because registration already
            // returned a JWT token.


            setSuccess(
                "Registration successful!"
            );


            // ==================================
            // REDIRECT
            // ==================================

            navigate("/dashboard");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // UI
    // ==========================================

    return (
        <div>

            <h1>
                Create SaaSFlow Account
            </h1>


            <form onSubmit={handleSubmit}>

                {/* ==============================
                    NAME
                ============================== */}

                <div>

                    <label htmlFor="name">
                        Full Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                    />

                </div>


                {/* ==============================
                    EMAIL
                ============================== */}

                <div>

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />

                </div>


                {/* ==============================
                    PASSWORD
                ============================== */}

                <div>

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />

                </div>


                {/* ==============================
                    ORGANIZATION
                ============================== */}

                <div>

                    <label htmlFor="organizationName">
                        Organization Name
                    </label>

                    <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        placeholder="Enter organization name"
                        value={
                            formData.organizationName
                        }
                        onChange={handleChange}
                    />

                </div>


                {/* ==============================
                    ERROR MESSAGE
                ============================== */}

                {error && (
                    <p>
                        {error}
                    </p>
                )}


                {/* ==============================
                    SUCCESS MESSAGE
                ============================== */}

                {success && (
                    <p>
                        {success}
                    </p>
                )}


                {/* ==============================
                    SUBMIT BUTTON
                ============================== */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
                </button>

            </form>


            {/* ==============================
                LOGIN LINK
            ============================== */}

            <p>

                Already have an account?{" "}

                <Link to="/login">
                    Login
                </Link>

            </p>

        </div>
    );
};


export default Register;