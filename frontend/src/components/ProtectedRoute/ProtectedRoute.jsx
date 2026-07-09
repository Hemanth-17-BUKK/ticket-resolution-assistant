import { Navigate } from "react-router-dom";

import {

    isAuthenticated,

    isAdmin,

    isCustomer

} from "../../utils/auth";

function ProtectedRoute({

    children,

    role

}) {

    if (!isAuthenticated()) {

        return <Navigate to="/" replace />;

    }

    if (

        role === "Admin" &&

        !isAdmin()

    ) {

        return (

            <Navigate

                to="/dashboard"

                replace

            />

        );

    }

    if (

        role === "Customer" &&

        !isCustomer()

    ) {

        return (

            <Navigate

                to="/admin"

                replace

            />

        );

    }

    return children;

}

export default ProtectedRoute;