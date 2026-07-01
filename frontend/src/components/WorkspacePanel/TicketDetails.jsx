import "./TicketDetails.css";

function formatText(text = "") {
    return text
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatDate(dateString) {

    if (!dateString) return "-";

    return new Date(dateString).toLocaleString(
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

function TicketDetails({

    ticket,

    setSelectedTicket,

    setSubject,

    setMessage,

    setFiles

}) {

    if (!ticket) {

        return (

            <div className="ticket-details-empty">

                <h2>Ticket Details</h2>

                <p>

                    Search a ticket to view its details.

                </p>

            </div>

        );

    }

    const hasFinalReply = Boolean(ticket.finalReply);

    const responseTitle = hasFinalReply
        ? "FINAL RESPONSE"
        : "DRAFT RESPONSE";

    const response = hasFinalReply
        ? ticket.finalReply
        : ticket.draftReply;

    return (

        <section className="ticket-details">

            {/* ================= HEADER ================= */}

            <div className="ticket-details-header">

                <div className="ticket-header-info">

                    <h2>

                        Ticket Details

                    </h2>

                    <div className="ticket-id">

                        Ticket #{ticket.ticketId}

                    </div>

                    <div className="ticket-date">

                        {formatDate(ticket.createdAt)}

                    </div>

                </div>

                <div
                    className={`ticket-status ${ticket.status}`}
                >

                    {formatText(ticket.status)}

                </div>

            </div>

            {/* ================= META ================= */}

            <div className="ticket-meta">

                <div className="ticket-meta-card">

                    <label>

                        Priority

                    </label>

                    <span>

                        {ticket.priority}

                    </span>

                </div>

                <div className="ticket-meta-card">

                    <label>

                        Category

                    </label>

                    <span>

                        {formatText(ticket.category)}

                    </span>

                </div>

            </div>

            {/* ================= SUBJECT ================= */}

            <div className="ticket-section">

                <label>

                    SUBJECT

                </label>

                <div className="ticket-box">

                    {ticket.subject}

                </div>

            </div>

            {/* ================= MESSAGE ================= */}

            <div className="ticket-section">

                <label>

                    MESSAGE

                </label>

                <div className="ticket-message">

                    {ticket.message}

                </div>

            </div>

            {/* ================= RESPONSE ================= */}

            <div className="ticket-section">

                <label>

                    {responseTitle}

                </label>

                <div className="ticket-response">

                    {

                        response ||

                        "The AI response is not available yet."

                    }

                </div>

            </div>

            {/* ================= ATTACHMENTS ================= */}

            {

                ticket.attachments?.length > 0 && (

                    <div className="ticket-section">

                        <label>

                            ATTACHMENTS

                        </label>

                        <div className="ticket-files">

                            {

                                ticket.attachments.map(

                                    (

                                        file,

                                        index

                                    ) => (

                                        <a

                                            key={index}

                                            href={file.downloadUrl}

                                            target="_blank"

                                            rel="noopener noreferrer"

                                            className="ticket-file"

                                        >

                                            {file.fileName}

                                        </a>

                                    )

                                )

                            }

                        </div>

                    </div>

                )

            }

            {/* ================= ACTION ================= */}

            <div className="ticket-details-actions">

                <button

                    className="raise-ticket-button"

                    onClick={() => {

                        setSelectedTicket(null);

                        setSubject("");

                        setMessage("");

                        setFiles([]);

                    }}

                >

                    Raise New Ticket

                </button>

            </div>

        </section>

    );

}

export default TicketDetails;