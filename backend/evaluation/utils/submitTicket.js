const axios = require("axios");
const config = require("../config");

async function submitTicket(ticket, token) {

    try {

        const requestBody = {

            subject: ticket.input.subject,

            message: ticket.input.message,

            attachments:
                ticket.input.attachments || []

        };

        const response = await axios.post(

            config.api.submitEndpoint,

            requestBody,

            {

                headers: {

                    Authorization: `Bearer ${token}`,

                    "Content-Type": "application/json"

                },

                timeout: config.api.timeout

            }

        );

        console.log(

            `✓ Submitted: ${ticket.input.subject}`

        );

        return response.data;

    }

    catch (error) {

        console.error(

            "Ticket submission failed:",

            error.response?.data ||

            error.message

        );

        throw new Error(

            error.response?.data?.message ||

            error.message

        );

    }

}

module.exports = submitTicket;