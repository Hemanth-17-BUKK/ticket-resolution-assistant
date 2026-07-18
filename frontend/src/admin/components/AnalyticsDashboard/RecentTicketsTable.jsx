import "./RecentTicketsTable.css";

function RecentTicketsTable({ tickets = [] }) {

    const recentTickets = [...tickets]
        .sort(
            (a, b) =>
                new Date(b.createdAt || b.timestamp || 0) -
                new Date(a.createdAt || a.timestamp || 0)
        )
        .slice(0, 10);

    function formatTime(date) {

        if (!date) return "-";

        const diff =
            Date.now() - new Date(date).getTime();

        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Just now";

        if (minutes < 60)
            return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

        const hours = Math.floor(minutes / 60);

        if (hours < 24)
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;

        const days = Math.floor(hours / 24);

        return `${days} day${days > 1 ? "s" : ""} ago`;

    }

    function getConfidenceDetails(confidence) {

    const value = Number(confidence);

    if (value >= 90) {
        return {
            className: "excellent",
            label: "Very High"
        };
    }

    if (value >= 75) {
        return {
            className: "good",
            label: "High"
        };
    }

    if (value >= 60) {
        return {
            className: "average",
            label: "Moderate"
        };
    }

    return {
        className: "low",
        label: "Low"
    };

}

    if (!recentTickets.length) {

        return (

            <div className="recent-empty">

                <div className="empty-icon">📄</div>

                <h3>No Recent Tickets</h3>

                <p>
                    Newly created tickets will appear here.
                </p>

            </div>

        );

    }

    return (

        <div className="recent-table-wrapper">

            

            <table className="recent-table">

                <thead>

                    <tr>

                        <th>Ticket ID</th>

                        <th>EMAIL</th>

                        <th>Category</th>

                        <th>Priority</th>

                        <th>Status</th>

                        <th>AI Confidence</th>

                        <th>Created</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        recentTickets.map(ticket => (

                            <tr key={ticket.ticketId}>

                                <td>

                                    <span className="ticket-id">

                                        {ticket.ticketId}

                                    </span>

                                </td>

                                <td>

                                    <span className="customer-email-only">

                                        {ticket.customerEmail || "-"}

                                    </span>

                                </td>

                                <td>

                                    {ticket.category || "-"}

                                </td>

                                <td>

                                    <span
                                        className={`badge priority ${(
                                            ticket.priority || ""
                                        ).toLowerCase()}`}
                                    >

                                        {ticket.priority}

                                    </span>

                                </td>

                                <td>

                                    <span
                                        className={`badge status ${(
                                            ticket.status || ""
                                        ).toLowerCase()}`}
                                    >

                                        {ticket.status}

                                    </span>

                                </td>

                                <td>

                                    {(() => {

                                        const confidence = getConfidenceDetails(ticket.aiConfidence);

                                        return (

                                            <span
                                                className={`badge confidence ${confidence.className}`}
                                            >

                                                {ticket.aiConfidence ?? "--"}%
                                                <small>{confidence.label}</small>

                                            </span>

                                        );

                                    })()}

                                </td>

                                <td>

                                    {formatTime(
                                        ticket.createdAt ||
                                        ticket.timestamp
                                    )}

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default RecentTicketsTable;