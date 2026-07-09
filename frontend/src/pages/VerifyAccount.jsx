import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    confirmUser,
    loginUser
} from "../services/authService";

import {

    isAdmin

} from "../utils/auth";

function VerifyAccount({

    authData,

    setMode

}) {

    const navigate = useNavigate();

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const {

        email,

        password

    } = authData;

    const handleVerify = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            await confirmUser(

                email,

                code

            );

            const session = await loginUser(

                email,

                password

            );

            const idToken =

                session
                    .getIdToken()
                    .getJwtToken();

            localStorage.setItem(

                "token",

                idToken

            );

            if (isAdmin()) {

                navigate("/admin");

            }

            else {

                navigate("/dashboard");

            }

        }

        catch (err) {

            setError(

                err.message

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <>

            <h2>

                Verify Account

            </h2>

            <p>

                We've sent a verification code to

                <br />

                <strong>

                    {email}

                </strong>

            </p>

            <form

                onSubmit={handleVerify}

            >

                <div className="auth-field">

                    <label>

                        Verification Code

                    </label>

                    <input

                        type="text"

                        placeholder="Enter verification code"

                        value={code}

                        onChange={(e) =>

                            setCode(

                                e.target.value

                            )

                        }

                        required

                    />

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

                            "Verifying..."

                            :

                            "Verify Account"

                    }

                </button>

            </form>

            <div className="auth-footer">

                <span>

                    Wrong email?

                </span>

                <button

                    type="button"

                    className="auth-link-button"

                    onClick={() =>

                        setMode("signup")

                    }

                >

                    Go Back

                </button>

            </div>

        </>

    );

}

export default VerifyAccount;