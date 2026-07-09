import {

    useEffect,

    useState

} from "react";

import "./ResolutionWorkspace.css";

import adminService

    from "../../services/adminService";

function formatText(text = "") {

    return text

        .replaceAll("_", " ")

        .toLowerCase()

        .replace(/\b\w/g,

            c => c.toUpperCase()

        );

}

function formatDate(date) {

    if (!date) {

        return "-";

    }

    return new Date(date).toLocaleString(

        "en-GB",

        {

            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }

    );

}

function ResolutionWorkspace({

    ticket,

    refreshDashboard,

    setSelectedTicket

}) {

    const [

        response,

        setResponse

    ] = useState("");

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        message,

        setMessage

    ] = useState("");

    const [

        error,

        setError

    ] = useState("");

    useEffect(() => {

        if (!ticket) {

            return;

        }

        setResponse(

            ticket.finalReply ||

            ticket.draftReply ||

            ticket.resolution ||

            ""

        );

        setMessage("");

        setError("");

    },

    [

        ticket

    ]);

    /* ==========================================================
       STATUS HELPERS
    ========================================================== */

    const requiresApproval =

        ticket?.status === "PENDING_APPROVAL";

    const isCompleted =

        ticket?.status === "RESOLVED" ||

        ticket?.status === "REJECTED";

    /* ==========================================================
       SAVE DRAFT
    ========================================================== */

    async function handleSaveDraft() {

    if (!ticket) {

        return;

    }

    try {

        setLoading(true);

        setMessage("");

        setError("");

        await adminService.updateTicket(

            ticket.ticketId,

            {

                status: ticket.status,

                draftReply: response,

                action: "UPDATED"

            }

        );

        setMessage(

            "Draft saved successfully."

        );

        await refreshDashboard();

    }

    catch (error) {

        setError(

            error.message ||

            "Unable to save draft."

        );

    }

    finally {

        setLoading(false);

    }

}

    /* ==========================================================
       RESOLVE
    ========================================================== */

    async function handleResolve() {

        if (!ticket) {

            return;

        }

        try {

            setLoading(true);

            setMessage("");

            setError("");

            await adminService.updateTicket(

                ticket.ticketId,

                {

                    status: "RESOLVED",

                    resolution: response,

                    finalReply: response,

                    action: "RESOLVED"

                }

            );

            setMessage(

                "Ticket resolved successfully."

            );

            await refreshDashboard();

            setSelectedTicket(null);

        }

        catch (error) {

            setError(

                error.message ||

                "Unable to resolve ticket."

            );

        }

        finally {

            setLoading(false);

        }

    }

    /* ==========================================================
       APPROVE
    ========================================================== */

    async function handleApprove() {

         console.log("Approve clicked");

        if (!ticket) {

            return;

        }

        try {

            setLoading(true);

            setMessage("");

            setError("");

            await adminService.approveTicket(

                ticket.ticketId,

                

            );

            setMessage(

                "Ticket approved successfully."

            );

            await refreshDashboard();

            setSelectedTicket(null);

        }

        catch (error) {

            setError(

                error.message ||

                "Unable to approve ticket."

            );

        }

        finally {

            setLoading(false);

        }

    }

    /* ==========================================================
       REJECT
    ========================================================== */

    async function handleReject() {

        if (!ticket) {

            return;

        }

        try {

            setLoading(true);

            setMessage("");

            setError("");

            await adminService.rejectTicket(

                ticket.ticketId

            );

            setMessage(

                "Ticket rejected."

            );

            await refreshDashboard();

            setSelectedTicket(null);

        }

        catch (error) {

            setError(

                error.message ||

                "Unable to reject ticket."

            );

        }

        finally {

            setLoading(false);

        }

    }

    if (!ticket) {

        return (

            <div className="resolution-empty">

                <h2>

                    Resolution Workspace

                </h2>

                <p>

                    Select a ticket to review.

                </p>

            </div>

        );

    }
        return (

        <section className="resolution-workspace">

            <div className="resolution-header">

                <h2>

                    RESOLUTION WORKSPACE

                </h2>

                <span>

                    {ticket.ticketId}

                </span>

            </div>

            {

                message && (

                    <div className="resolution-success">

                        {message}

                    </div>

                )

            }

            {

                error && (

                    <div className="resolution-error">

                        {error}

                    </div>

                )

            }

            <div className="resolution-field">

                <label>

                    Response

                </label>

                <textarea

                    value={response}

                    onChange={event =>

                        setResponse(

                            event.target.value

                        )

                    }

                    placeholder="Edit the response before sending it to the customer..."

                />

            </div>

            {/* ==========================================
                ACTIONS
            ========================================== */}

            <div className="resolution-section">

                <h3>

                    Actions

                </h3>

                {

                    isCompleted ? (

                        <div className="resolution-completed">

                            This ticket has already been completed.

                        </div>

                    )

                    :

                    requiresApproval ? (

                        <div className="resolution-actions">

                            <button

                                className="resolution-save"

                                disabled={loading}

                                onClick={handleSaveDraft}

                            >

                                Save Draft

                            </button>

                            <div className="resolution-decision-actions">

                                <button

                                    className="resolution-approve"

                                    disabled={loading}

                                    onClick={handleApprove}

                                >

                                    Approve

                                </button>

                                <button

                                    className="resolution-reject"

                                    disabled={loading}

                                    onClick={handleReject}

                                >

                                    Reject

                                </button>

                            </div>

                        </div>

                    )

                    :

                    (

                        <div className="resolution-actions">

                            <button

                                className="resolution-save"

                                disabled={loading}

                                onClick={handleSaveDraft}

                            >

                                Save Draft

                            </button>

                            <button

                                className="resolution-resolve"

                                disabled={loading}

                                onClick={handleResolve}

                            >

                                Resolve Ticket

                            </button>

                        </div>

                    )

                }

            </div>

            {/* ==========================================
                RECENT ACTIVITY
            ========================================== */}

            <div className="resolution-section activity-section">

                <h3>

                    Recent Activity

                </h3>

                <div className="activity-list">

                    {

                        ticket.history?.length

                        ?

                        ticket.history.map(

                            (

                                item,

                                index

                            ) => (

                                <div

                                    key={index}

                                    className={`activity-item ${item.status}`}

                                >

                                    <div className="activity-line"/>

                                    <div className="activity-content">

                                        <div className="activity-status">

                                            {

                                                (() => {

                                                    switch (item.action || item.status) {

                                                        case "CREATED":

                                                            return "Ticket Created";

                                                        case "UPDATED":

                                                            return "Draft Updated";

                                                        case "PENDING_APPROVAL":

                                                            return "Pending Approval";

                                                        case "APPROVED":

                                                            return "Approved";

                                                        case "RESOLVED":

                                                            return "Resolved";

                                                        case "REJECTED":

                                                            return "Rejected";

                                                        case "OPEN":

                                                            return "Ticket Created";

                                                        default:

                                                            return formatText(item.action || item.status);

                                                    }

                                                })()

                                            }

                                        </div>

                                        <div className="activity-date">

                                            {new Date(item.timestamp).toLocaleDateString("en-GB",{

                                                day:"2-digit",

                                                month:"short"

                                            })}

                                            <br/>

                                            {new Date(item.timestamp).toLocaleTimeString("en-GB",{

                                                hour:"2-digit",

                                                minute:"2-digit"

                                            })}

                                        </div>

                                    </div>

                                </div>

                            )

                        )

                        :

                        <div className="activity-empty">

                            No activity available.

                        </div>

                    }

                </div>

            </div>

        </section>

    );

}

export default ResolutionWorkspace;