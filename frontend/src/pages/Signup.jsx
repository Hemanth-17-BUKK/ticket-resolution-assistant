import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { signUpUser } from "../services/authService";

function Signup({

    setMode,

    authData,

    setAuthData

}) {

    const [email, setEmail] = useState(authData.email);

    const [password, setPassword] = useState(authData.password);

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            await signUpUser(

                email,

                password

            );

            setAuthData({

                email,

                password

            });

            setMode("verify");

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

                Create Account

            </h2>

            <p>

                Create your customer account

            </p>

            <form onSubmit={handleSignup}>

                <div className="auth-field">

                    <label>

                        Email Address

                    </label>

                    <input

                        type="email"

                        placeholder="Enter your email"

                        value={email}

                        onChange={(e) =>

                            setEmail(e.target.value)

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

                            placeholder="Create a password"

                            value={password}

                            onChange={(e) =>

                                setPassword(e.target.value)

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

                <div className="auth-field">

                    <label>

                        Confirm Password

                    </label>

                    <div className="password-wrapper">

                        <input

                            type={

                                showConfirmPassword

                                    ? "text"

                                    : "password"

                            }

                            placeholder="Confirm your password"

                            value={confirmPassword}

                            onChange={(e) =>

                                setConfirmPassword(

                                    e.target.value

                                )

                            }

                            required

                        />

                        <button

                            type="button"

                            className="password-toggle"

                            onClick={() =>

                                setShowConfirmPassword(

                                    !showConfirmPassword

                                )

                            }

                        >

                            {

                                showConfirmPassword

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

                            "Creating Account..."

                            :

                            "Create Account"

                    }

                </button>

            </form>

            <div className="auth-footer">

                <span>

                    Already have an account?

                </span>

                <button

                    type="button"

                    className="auth-link-button"

                    onClick={() =>

                        setMode("login")

                    }

                >

                    Sign In

                </button>

            </div>

        </>

    );

}

export default Signup;