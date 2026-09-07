import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";


// ==========================================
// LOGIN PAGE
// ==========================================

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();


    // ======================================
    // FORM STATE
    // ======================================

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    // ======================================
    // UI STATE
    // ======================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


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
    };


    // ======================================
    // HANDLE SUBMIT
    // ======================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // Basic validation
        if (
            !formData.email.trim() ||
            !formData.password
        ) {
            setError(
                "Email and password are required"
            );

            return;
        }


        try {

            setLoading(true);


            await login(
                formData.email,
                formData.password
            );


            // Login successful
            navigate("/dashboard");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Login failed. Please try again.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ======================================
    // UI
    // ======================================

    return (
        <div>

            <h1>
                SaaSFlow Login
            </h1>


            <form onSubmit={handleSubmit}>

                {/* Email */}

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


                {/* Password */}

                <div>

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />

                </div>


                {/* Error */}

                {error && (
                    <p>
                        {error}
                    </p>
                )}


                {/* Submit */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

            </form>


            {/* Register Link */}

            <p>

                Don't have an account?{" "}

                <Link to="/register">
                    Register
                </Link>

            </p>

        </div>
    );
};


export default Login;