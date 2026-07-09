import "./TicketViewer.css";

function formatText(text = "") {

    return text

        .replaceAll("_", " ")

        .toLowerCase()

        .replace(/\b\w/g, c =>

            c.toUpperCase()

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

function TicketViewer({

    ticket

}) {

    if (!ticket) {

        return (

            <div className="ticket-viewer-empty">

                <h2>

                    Ticket Details

                </h2>

                <p>

                    Select a ticket from the queue to review its details.

                </p>

            </div>

        );

    }

    const aiReply =

        ticket.finalReply ||

        ticket.draftReply ||

        "No AI draft has been generated yet.";

    return (

        <section className="ticket-viewer">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="viewer-header">

                <div className="viewer-header-left">

                    <div className="viewer-ticket-id">

                        {ticket.ticketId}

                    </div>

                    <h2>

                        {

                            ticket.subject

                                ?.charAt(0)

                                .toUpperCase()

                            +

                            ticket.subject

                                ?.slice(1)

                        }

                    </h2>

                    <div className="viewer-created">

                        Created On

                        <span>

                            {

                                formatDate(

                                    ticket.createdAt

                                )

                            }

                        </span>

                    </div>

                </div>

                <div className="viewer-header-right">

                    <div className="viewer-status-label">

                        Status

                    </div>

                    <div

                        className={

                            `viewer-status ${ticket.status}`

                        }

                    >

                        {

                            formatText(

                                ticket.status

                            )

                        }

                    </div>

                </div>

            </div>

            {/* ==========================================
                INFORMATION
            ========================================== */}

            <div className="viewer-info-grid">

                <div className="viewer-info-card">

                    <span>

                        Customer

                    </span>

                    <strong>

                        {

                            ticket.customerEmail

                        }

                    </strong>

                </div>

                <div className="viewer-info-card">

                    <span>

                        Category

                    </span>

                    <strong>

                        {

                            formatText(

                                ticket.category

                            )

                        }

                    </strong>

                </div>

                <div className="viewer-info-card">

                    <span>

                        Priority

                    </span>

                    <strong>

                        {

                            formatText(

                                ticket.priority

                            )

                        }

                    </strong>

                </div>

            </div>

            {/* ==========================================
                CUSTOMER MESSAGE
            ========================================== */}
                        <div className="viewer-section">

                <h3>

                    Customer Message

                </h3>

                <div className="viewer-message">

                    {

                        ticket.message ||

                        "No customer message available."

                    }

                </div>

            </div>

            {/* ==========================================
                AI DRAFT RESPONSE
            ========================================== */}

            <div className="viewer-section">

                <h3>

                    AI Draft Response

                </h3>

                <div className="viewer-ai">

                    {

                        aiReply

                    }

                </div>

            </div>

            {/* ==========================================
                ATTACHMENTS
            ========================================== */}

            {

                ticket.attachments?.length > 0 && (

                    <div className="viewer-section">

                        <h3>

                            Attachments

                        </h3>

                        <div className="viewer-files">

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

                                            rel="noreferrer"

                                            className="viewer-file"

                                        >

                                            <span>

                                                {

                                                    file.fileName

                                                }

                                            </span>

                                        </a>

                                    )

                                )

                            }

                        </div>

                    </div>

                )

            }

        </section>

    );

}

export default TicketViewer;