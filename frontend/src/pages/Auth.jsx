import { useState } from "react";

import Login from "./Login";
import Signup from "./Signup";
import VerifyAccount from "./VerifyAccount";

function Auth() {

    const [mode, setMode] = useState("login");

    const [authData, setAuthData] = useState({

        email: "",

        password: ""

    });

    return (

        <div className="auth-layout">

            <div className="auth-left">

                <div>

                    <h1>
                        Ticket Resolution Assistant
                    </h1>

                    <p className="hero-text">

                        Your centralized support workspace for
                        reporting issues, tracking requests,
                        and staying informed until resolution.

                    </p>

                    <div className="feature-grid">

                        <div className="feature-card">

                            <h3>Raise Requests</h3>

                            <p>
                                Submit issues, service requests
                                and support inquiries.
                            </p>

                        </div>

                        <div className="feature-card">

                            <h3>Follow Progress</h3>

                            <p>
                                Track your ticket throughout
                                the resolution process.
                            </p>

                        </div>

                        <div className="feature-card">

                            <h3>Receive Updates</h3>

                            <p>
                                Stay informed with AI powered
                                status updates.
                            </p>

                        </div>

                        <div className="feature-card">

                            <h3>Review History</h3>

                            <p>
                                Access all your previously
                                submitted tickets.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="auth-right">

                <div className="auth-card">

                    {

                        mode === "login" && (

                            <Login

                                setMode={setMode}

                            />

                        )

                    }

                    {

                        mode === "signup" && (

                            <Signup

                                setMode={setMode}

                                authData={authData}

                                setAuthData={setAuthData}

                            />

                        )

                    }

                    {

                        mode === "verify" && (

                            <VerifyAccount

                                authData={authData}

                                setMode={setMode}

                            />

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default Auth;