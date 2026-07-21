import "./RecentTicketsTable.css";
import { useMemo, useState } from "react";

function RecentTicketsTable({ tickets = [] }) {

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");
    const [currentPage, setCurrentPage] = useState(1);

const PAGE_SIZE = 20;

    const filteredTickets = useMemo(() => {

    let data = [...tickets];

    if (statusFilter !== "ALL") {

        data = data.filter(
            ticket => ticket.status === statusFilter
        );

    }

    if (search.trim()) {

        const keyword = search.toLowerCase();

        data = data.filter(ticket =>

            ticket.ticketId?.toLowerCase().includes(keyword) ||

            ticket.customerEmail?.toLowerCase().includes(keyword) ||

            ticket.subject?.toLowerCase().includes(keyword) ||

            ticket.category?.toLowerCase().includes(keyword)

        );

    }

    data.sort((a, b) => {

        const first =
            new Date(a.createdAt || a.timestamp || 0);

        const second =
            new Date(b.createdAt || b.timestamp || 0);

        return sortBy === "NEWEST"

            ? second - first

            : first - second;

    });

    return data;

}, [tickets, search, statusFilter, sortBy]);

const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / PAGE_SIZE)
);

const startIndex =
    (currentPage - 1) * PAGE_SIZE;

const recentTickets =
    filteredTickets.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

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

    if (
        confidence === undefined ||
        confidence === null ||
        confidence === ""
    ) {

        return null;

    }

    const value = Number(confidence);

    if (Number.isNaN(value)) {

        return null;

    }

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

    <div className="recent-table-container">

        <div className="recent-toolbar">

            <div className="recent-toolbar-left">

                <input

                    type="text"

                    placeholder="Search by Ticket ID, Email, Subject or Category"

                    value={search}

                    onChange={(e) => {

                        setSearch(e.target.value);
                        setCurrentPage(1);

                    }}

                    className="recent-search"

                />

            </div>

            <div className="recent-toolbar-right">

                <select

                    value={statusFilter}

                    onChange={(e) => {

                        setStatusFilter(e.target.value);
                        setCurrentPage(1);

                    }}

                    className="recent-select"

                >

                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>

                </select>

                <select

                    value={sortBy}

                    onChange={(e) =>

                        setSortBy(e.target.value)

                    }

                    className="recent-select"

                >

                    <option value="NEWEST">Newest</option>
                    <option value="OLDEST">Oldest</option>

                </select>

            </div>

        </div>

        <div className="recent-table-wrapper">

    <table className="recent-table">

        <thead>

            <tr>

                <th>Ticket ID</th>

                <th>Email</th>

                <th>Category</th>

                <th>Priority</th>

                <th>Status</th>

                <th>AI Confidence</th>

                <th>Created</th>

            </tr>

        </thead>

        <tbody>

            {

                recentTickets.map(ticket => {

                    const confidence =
                        getConfidenceDetails(ticket.aiConfidence);

                    return (

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

                                    {ticket.priority || "-"}

                                </span>

                            </td>

                            <td>

                                <span
                                    className={`badge status ${(
                                        ticket.status || ""
                                    ).toLowerCase()}`}
                                >

                                    {(ticket.status || "-")
                                        .replaceAll("_", " ")}

                                </span>

                            </td>

                            <td>

                                {

                                    confidence ? (

                                        <span
                                            className={`badge confidence ${confidence.className}`}
                                        >

                                            <span>

                                                {ticket.aiConfidence}%

                                            </span>

                                            <small>

                                                {confidence.label}

                                            </small>

                                        </span>

                                    ) : (

                                        <span className="confidence-empty">

                                            --

                                        </span>

                                    )

                                }

                            </td>

                            <td>

                                {

                                    formatTime(

                                        ticket.createdAt ||

                                        ticket.timestamp

                                    )

                                }

                            </td>

                        </tr>

                    );

                })

            }

        </tbody>

    </table>
        <div className="recent-footer">

        <div className="recent-count">

            Showing

            <strong>

                {" "}
                {filteredTickets.length === 0
                    ? 0
                    : startIndex + 1}

            </strong>

            -

            <strong>

                {

                    Math.min(

                        startIndex + PAGE_SIZE,

                        filteredTickets.length

                    )

                }

            </strong>

            of

            <strong>

                {" "}
                {filteredTickets.length}

            </strong>

            tickets

        </div>

        <div className="pagination">

            <button

                className="page-button"

                disabled={currentPage === 1}

                onClick={() =>
                    setCurrentPage(currentPage - 1)
                }

            >

                Previous

            </button>

            {

                Array.from(

                    { length: totalPages },

                    (_, index) => (

                        <button

                            key={index + 1}

                            className={`page-button ${
                                currentPage === index + 1
                                    ? "active"
                                    : ""
                            }`}

                            onClick={() =>
                                setCurrentPage(index + 1)
                            }

                        >

                            {index + 1}

                        </button>

                    )

                )

            }

            <button

                className="page-button"

                disabled={currentPage === totalPages}

                onClick={() =>
                    setCurrentPage(currentPage + 1)
                }

            >

                Next

            </button>

        </div>

    </div>

</div>

</div>

);

}

export default RecentTicketsTable;
