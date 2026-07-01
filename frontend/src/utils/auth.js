export function getToken() {

    return localStorage.getItem(
        "token"
    );

}

export function getUserInfo() {

    const token =
        getToken();

    if (!token) {

        return {

            email: "",

            displayName: "Customer",

            initials: "CU"

        };

    }

    try {

        const payload = JSON.parse(

            atob(

                token.split(".")[1]

            )

        );

        const email =
            payload.email || "";

        let displayName = "";

            const username = email.split("@")[0];

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
                displayName = "Customer";
            }

        const initials =

            displayName

                .split(" ")

                .map(

                    word =>

                        word[0]

                )

                .join("")

                .substring(0, 2);

        return {

            email,

            displayName,

            initials

        };

    }

    catch {

        return {

            email: "",

            displayName: "Customer",

            initials: "CU"

        };

    }

}