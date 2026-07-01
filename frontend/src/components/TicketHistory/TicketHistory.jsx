import "./TicketHistory.css";
import { ChevronRight } from "lucide-react";

function formatSubject(subject = "") {
    return subject
        .toLowerCase()
        .split(" ")
        .filter(word => word.trim() !== "")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (date.toDateString() === today.toDateString()) {
        return `Today • ${time}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday • ${time}`;
    }

    return `${date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    })} • ${time}`;
}

function getPriority(priority) {
    switch (priority) {
        case "HIGH":
            return "high";
        case "MEDIUM":
            return "medium";
        default:
            return "low";
    }
}

function TicketHistory({

    tickets,

    loading,

    openTicket

}) {

    return (

        <aside className="ticket-history">

            <h2 className="ticket-history-title">

                RECENT TICKETS

            </h2>

            <div className="ticket-history-list">

                {

                    loading ?

                        (

                            <div className="ticket-history-empty">

                                Loading tickets...

                            </div>

                        )

                        :

                        tickets.length === 0 ?

                            (

                                <div className="ticket-history-empty">

                                    No tickets available.

                                </div>

                            )

                            :

                            tickets.map(ticket => {

                                const priority = getPriority(ticket.priority);

                                return (

                                    <div

                                        key={ticket.ticketId}

                                        className={`ticket-history-card ${priority}`}

                                        onClick={() => openTicket(ticket)}

                                    >

                                        <div

                                            className={`ticket-history-id ${priority}`}

                                        >

                                            {ticket.ticketId}

                                        </div>

                                        <div className="ticket-history-subject-box">

                                            <div className="ticket-history-subject">

                                                {

                                                    formatSubject(

                                                        ticket.subject ||

                                                        "Untitled Ticket"

                                                    )

                                                }

                                            </div>

                                        </div>

                                        <div className="ticket-history-bottom">

                                            <span

                                                className={`ticket-history-status ${ticket.status}`}

                                            >

                                                {

                                                    ticket.status.replaceAll(

                                                        "_",

                                                        " "

                                                    )

                                                }

                                            </span>

                                            <div className="ticket-history-right">

                                                <span className="ticket-history-date">

                                                    {

                                                        formatDate(

                                                            ticket.createdAt

                                                        )

                                                    }

                                                </span>

                                                <ChevronRight

                                                    size={18}

                                                    className="ticket-history-arrow"

                                                />

                                            </div>

                                        </div>

                                    </div>

                                );

                            })

                }

            </div>

        </aside>

    );

}

export default TicketHistory;