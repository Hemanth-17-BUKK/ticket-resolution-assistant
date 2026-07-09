import { API_URL } from "../../utils/constants";

import {

    getToken,

    logout

} from "../../utils/auth";

/* ==========================================================
   REQUEST
========================================================== */

async function request(

    endpoint,

    options = {}

) {

    const token = getToken();

    const response = await fetch(

        `${API_URL}${endpoint}`,

        {

            ...options,

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`,

                ...(options.headers || {})

            }

        }

    );

    if (response.status === 401) {

        logout();

        window.location.href = "/";

        throw new Error("Session expired.");

    }

    if (response.status === 403) {

        throw new Error(

            "Access denied."

        );

    }

    if (!response.ok) {

        let message =

            "Something went wrong.";

        try {

            const error =

                await response.json();

            message =

                error.message ||

                error.error ||

                message;

        }

        catch {

            // Ignore parsing errors

        }

        throw new Error(message);

    }

    if (

        response.status === 204

    ) {

        return null;

    }

    return response.json();

}

/* ==========================================================
   API CLIENT
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