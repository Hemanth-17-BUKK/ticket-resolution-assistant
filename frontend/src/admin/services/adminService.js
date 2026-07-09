import apiClient from "./apiClient";

/* ==========================================================
   DASHBOARD
========================================================== */

async function getDashboard() {

    return apiClient.get(

        "/dashboard"

    );

}

/* ==========================================================
   TICKETS
========================================================== */

async function getTickets() {

    return apiClient.get(

        "/tickets"

    );

}

async function getTicket(

    ticketId

) {

    return apiClient.get(

        `/tickets/${ticketId}`

    );

}

async function getTicketHistory(

    ticketId

) {

    return apiClient.get(

        `/tickets/${ticketId}/history`

    );

}

/* ==========================================================
   APPROVALS
========================================================== */

async function approveTicket(ticketId) {

    return apiClient.get(
        `/approve/${ticketId}`
    );

}

async function rejectTicket(ticketId) {

    return apiClient.get(
        `/reject/${ticketId}`
    );

}

/* ==========================================================
   UPDATE
========================================================== */

async function updateTicket(

    ticketId,

    payload

) {

    return apiClient.put(

        `/tickets/${ticketId}`,

        payload

    );

}

/* ==========================================================
   DELETE
========================================================== */

async function deleteTicket(

    ticketId

) {

    return apiClient.delete(

        `/tickets/${ticketId}`

    );

}

/* ==========================================================
   EXPORT
========================================================== */

const adminService = {

    getDashboard,

    getTickets,

    getTicket,

    getTicketHistory,

    approveTicket,

    rejectTicket,

    updateTicket,

    deleteTicket

};

export default adminService;