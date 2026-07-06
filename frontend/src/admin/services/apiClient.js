import { fetchAuthSession } from "aws-amplify/auth";

/* ==========================================================
   CONFIG
========================================================== */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ==========================================================
   AUTH HEADER
========================================================== */

async function getHeaders() {

    const session = await fetchAuthSession();

    const token =
        session.tokens?.idToken?.toString();

    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

}

/* ==========================================================
   REQUEST
========================================================== */

async function request(

    endpoint,

    options = {}

) {

    const headers = await getHeaders();

    const response = await fetch(

        `${API_BASE_URL}${endpoint}`,

        {

            ...options,

            headers: {

                ...headers,

                ...(options.headers || {})

            }

        }

    );

    if (!response.ok) {

        let message = "Request failed.";

        try {

            const error = await response.json();

            message =

                error.message ||

                error.error ||

                message;

        }

        catch {

            // Ignore JSON parsing errors

        }

        throw new Error(message);

    }

    if (response.status === 204) {

        return null;

    }

    return response.json();

}

/* ==========================================================
   HTTP METHODS
========================================================== */

const apiClient = {

    get(endpoint) {

        return request(

            endpoint,

            {

                method: "GET"

            }

        );

    },

    post(

        endpoint,

        body = {}

    ) {

        return request(

            endpoint,

            {

                method: "POST",

                body: JSON.stringify(body)

            }

        );

    },

    put(

        endpoint,

        body = {}

    ) {

        return request(

            endpoint,

            {

                method: "PUT",

                body: JSON.stringify(body)

            }

        );

    },

    delete(endpoint) {

        return request(

            endpoint,

            {

                method: "DELETE"

            }

        );

    }

};

export default apiClient;