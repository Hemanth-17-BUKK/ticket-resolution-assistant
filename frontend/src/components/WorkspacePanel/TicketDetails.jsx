import "./TicketDetails.css";

function formatText(text = "") {

    return text
        .toLowerCase()
        .split("_")
        .join(" ")
        .split(" ")
        .filter(Boolean)
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
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

                <h2>

                    Ticket Details

                </h2>

                <p>

                    Search a ticket to view its details.

                </p>

            </div>

        );

    }

    const response =
        ticket.finalReply ||
        ticket.draftReply;

    return (

        <section className="ticket-details">

            {/* ================= HEADER ================= */}

            <div className="ticket-details-header">

                <h2 className="ticket-title">

                    {ticket.subject}

                </h2>

                <div className="ticket-header-left-meta">

    <div className="ticket-id-badge">

        {ticket.ticketId}

    </div>

    <div
        className={`ticket-status ${ticket.status}`}
    >

        {formatText(ticket.status)}

    </div>

    {

        ticket.attachments?.length > 0 && (

            <button

                className="ticket-attachment-button"

                onClick={() =>
                    window.open(
                        ticket.attachments[0].downloadUrl,
                        "_blank"
                    )
                }

            >

                Attachments

            </button>

        )

    }

</div>


            </div>

            <div className="ticket-details-content">

                <div className="ticket-meta ticket-fixed">

                    <div className="ticket-meta-card">

                        <span className="ticket-meta-title">

                            Priority

                        </span>

                        <span
                            className={`priority-badge ${ticket.priority}`}
                        >

                            {formatText(ticket.priority)}

                        </span>

                    </div>

                    <div className="ticket-meta-card">

                        <span className="ticket-meta-title">

                            Category

                        </span>

                        <span className="category-badge">

                            {formatText(ticket.category)}

                        </span>

                    </div>

                </div>

                <div className="ticket-section ticket-fixed">

                    <h4>

                        Message

                    </h4>

                    <div className="ticket-message">

                        {ticket.message}

                    </div>

                </div>

                <div className="ticket-section ticket-response-section">

    <h4>

        Response

    </h4>

    <div className="ticket-response">

        {

            response ||

            "Your ticket has been received. The AI response will appear here once it has been generated."

        }

    </div>

</div>

                

            </div>

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