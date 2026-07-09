/* ==========================================================
   TOKEN
========================================================== */

export function getToken() {

    return localStorage.getItem(
        "token"
    );

}

/* ==========================================================
   DECODE TOKEN
========================================================== */

export function decodeToken() {

    const token = getToken();

    if (!token) {

        return null;

    }

    try {

        return JSON.parse(

            atob(

                token.split(".")[1]

            )

        );

    }

    catch {

        return null;

    }

}

/* ==========================================================
   AUTHENTICATION
========================================================== */

export function isAuthenticated() {

    return !!getToken();

}

export function logout() {

    localStorage.removeItem(
        "token"
    );

}

/* ==========================================================
   ROLE
========================================================== */

/* ==========================================================
   ROLE
========================================================== */

export function getUserRole() {

    const payload = decodeToken();

    if (!payload) {

        return null;

    }

    const groups =

        (payload["cognito:groups"] || [])

            .map(group => group.toUpperCase());

    if (groups.includes("ADMIN")) {

        return "Admin";

    }

    if (groups.includes("CUSTOMER")) {

        return "Customer";

    }

    return null;

}

export function isAdmin() {

    return getUserRole() === "Admin";

}

export function isCustomer() {

    return getUserRole() === "Customer";

}

/* ==========================================================
   USER INFO
========================================================== */

export function getUserInfo() {

    const payload = decodeToken();

    if (!payload) {

        return {

            email: "",

            displayName: "Customer",

            initials: "CU"

        };

    }

    const email =

        payload.email || "";

    let displayName = "";

    const username =

        email.split("@")[0];

    displayName = username

        .replace(/[._-]+/g, " ")

        .replace(/\d+/g, "")

        .replace(/\s+/g, " ")

        .trim()

        .split(" ")

        .filter(Boolean)

        .map(

            word =>

                word.charAt(0).toUpperCase() +

                word.slice(1).toLowerCase()

        )

        .join(" ");

    if (!displayName) {

        displayName =

            getUserRole() || "User";

    }

    const initials =

        displayName

            .split(" ")

            .map(

                word => word[0]

            )

            .join("")

            .substring(0, 2)

            .toUpperCase();

    return {

        email,

        displayName,

        initials,

        role: getUserRole()

    };

}