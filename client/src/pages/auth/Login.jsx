import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            await login(
                formData.email,
                formData.password
            );

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

    return (
        <div className="auth-page">

            {/* Background decoration */}
            <div className="auth-glow auth-glow-one"></div>
            <div className="auth-glow auth-glow-two"></div>

            <div className="auth-container">

                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-logo">
                        S
                    </div>

                    <span>SaaSFlow</span>
                </div>

                {/* Login Card */}
                <div className="auth-card">

                    <div className="auth-header">
                        <h1>
                            Welcome back
                        </h1>

                        <p>
                            Sign in to continue to your workspace
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Email */}
                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>

                        {/* Password */}
                        <div className="form-group">

                            <div className="password-label-row">

                                <label htmlFor="password">
                                    Password
                                </label>

                            </div>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                disabled={loading}
                            />

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="auth-error">
                                <span>!</span>
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Login button */}
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                    </form>

                    {/* Register */}
                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>

                </div>

                {/* Bottom text */}
                <p className="auth-security">
                    Secure authentication powered by SaaSFlow
                </p>

            </div>
        </div>
    );
};

export default Login;