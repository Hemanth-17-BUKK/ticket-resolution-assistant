import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { loginUser } from "../services/authService";

function Login({ setMode }) {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const session = await loginUser(

                email,

                password

            );

            const token =

                session
                    .getIdToken()
                    .getJwtToken();

            localStorage.setItem(

                "token",

                token

            );

            navigate("/dashboard");

        }

        catch (err) {

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <>

            <h2>

                Sign In

            </h2>

            <p>

                Access your support workspace

            </p>

            <form onSubmit={handleLogin}>

                <div className="auth-field">

                    <label>

                        Email Address

                    </label>

                    <input

                        type="email"

                        placeholder="Enter your email"

                        value={email}

                        onChange={(e) =>

                            setEmail(

                                e.target.value

                            )

                        }

                        required

                    />

                </div>

                <div className="auth-field">

                    <label>

                        Password

                    </label>

                    <div className="password-wrapper">

                        <input

                            type={

                                showPassword

                                    ? "text"

                                    : "password"

                            }

                            placeholder="Enter your password"

                            value={password}

                            onChange={(e) =>

                                setPassword(

                                    e.target.value

                                )

                            }

                            required

                        />

                        <button

                            type="button"

                            className="password-toggle"

                            onClick={() =>

                                setShowPassword(

                                    !showPassword

                                )

                            }

                        >

                            {

                                showPassword

                                    ?

                                    <FaEyeSlash />

                                    :

                                    <FaEye />

                            }

                        </button>

                    </div>

                </div>

                {

                    error && (

                        <div className="error">

                            {error}

                        </div>

                    )

                }

                <button

                    type="submit"

                    disabled={loading}

                >

                    {

                        loading

                            ?

                            "Signing In..."

                            :

                            "Sign In"

                    }

                </button>

            </form>

            <div className="auth-footer">

                <span>

                    Don't have an account?

                </span>

                <button

                    type="button"

                    className="auth-link-button"

                    onClick={() =>

                        setMode("signup")

                    }

                >

                    Create Account

                </button>

            </div>

        </>

    );

}

export default Login;