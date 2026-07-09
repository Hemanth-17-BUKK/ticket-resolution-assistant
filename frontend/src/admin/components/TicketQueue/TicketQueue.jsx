import { useMemo, useState } from "react";

import "./TicketQueue.css";

function TicketQueue({

    tickets,

    selectedTicket,

    onSelectTicket

}) {

    const [search, setSearch] =

        useState("");

    const [status, setStatus] =

        useState("ALL");

    const [priority, setPriority] =

        useState("ALL");

    /* ==========================================================
       FILTER TICKETS
    ========================================================== */

    const filteredTickets = useMemo(() => {

        const searchText =

            search

                .trim()

                .toLowerCase();

        return tickets.filter(ticket => {

            const matchesSearch =

                ticket.ticketId

                    ?.toLowerCase()

                    .includes(searchText)

                ||

                ticket.subject

                    ?.toLowerCase()

                    .includes(searchText)

                ||

                ticket.customerName

                    ?.toLowerCase()

                    .includes(searchText)

                ||

                ticket.customerEmail

                    ?.toLowerCase()

                    .includes(searchText);

            const matchesStatus =

                status === "ALL"

                ||

                ticket.status === status;

            const matchesPriority =

                priority === "ALL"

                ||

                ticket.priority === priority;

            return (

                matchesSearch

                &&

                matchesStatus

                &&

                matchesPriority

            );

        });

    },

    [

        tickets,

        search,

        status,

        priority

    ]);

    /* ==========================================================
       FORMAT TEXT
    ========================================================== */

    function formatText(text = "") {

        return text

            .replaceAll("_", " ")

            .toLowerCase()

            .replace(

                /\b\w/g,

                letter =>

                    letter.toUpperCase()

            );

    }

    /* ==========================================================
       FORMAT DATE
    ========================================================== */

    function formatDate(date) {

        if (!date) {

            return "-";

        }

        return new Date(date)

            .toLocaleDateString(

                "en-IN",

                {

                    day: "2-digit",

                    month: "short",

                    year: "numeric"

                }

            );

    }

    /* ==========================================================
       RENDER
    ========================================================== */

    return (

        <section className="ticket-queue">

            <div className="ticket-queue-header">

                <div>

                    <h2>

                        TICKET QUEUE

                    </h2>

                    

                </div>

            </div>

            {/* =======================================================
                SEARCH
            ======================================================== */}

            <div className="ticket-search">

                <input

                    type="text"

                    placeholder="Search by Ticket ID or Subject"

                    value={search}

                    onChange={event =>

                        setSearch(

                            event.target.value

                        )

                    }

                />

            </div>

            {/* =======================================================
                FILTERS
            ======================================================== */}

            <div className="ticket-filters">

                <select

                    value={status}

                    onChange={event =>

                        setStatus(

                            event.target.value

                        )

                    }

                >

                    <option value="ALL">

                        All Status

                    </option>

                    <option value="OPEN">

                        Open

                    </option>

                    <option value="PENDING_APPROVAL">

                        Pending Approval

                    </option>

                    <option value="APPROVED">

                        Approved

                    </option>

                    <option value="REJECTED">

                        Rejected

                    </option>

                    <option value="RESOLVED">

                        Resolved

                    </option>

                </select>

                <select

                    value={priority}

                    onChange={event =>

                        setPriority(

                            event.target.value

                        )

                    }

                >

                    <option value="ALL">

                        All Priority

                    </option>

                    <option value="LOW">

                        Low

                    </option>

                    <option value="MEDIUM">

                        Medium

                    </option>

                    <option value="HIGH">

                        High

                    </option>

                    <option value="CRITICAL">

                        Critical

                    </option>

                </select>

            </div>

            {/* =======================================================
                TICKET LIST
            ======================================================== */}

            <div className="ticket-list">
                                {

                    filteredTickets.length === 0 && (

                        <div className="ticket-empty">

                            No tickets match your search criteria.

                        </div>

                    )

                }

                {

                    filteredTickets.map(ticket => (

                        <div

                            key={ticket.ticketId}

                            className={

                                `queue-card ${

                                    selectedTicket?.ticketId === ticket.ticketId

                                        ? "selected"

                                        : ""

                                }`

                            }

                            onClick={() =>

                                onSelectTicket(

                                    ticket.ticketId

                                )

                            }

                        >

                            {/* ======================================
                                HEADER
                            ======================================= */}

                            <div className="queue-card-top">

                                <span className="queue-ticket-id">

                                    {

                                        ticket.ticketId

                                    }

                                </span>

                                <span

                                    className={

                                        `queue-status ${ticket.status}`

                                    }

                                >

                                    {

                                        formatText(

                                            ticket.status

                                        )

                                    }

                                </span>

                            </div>

                            {/* ======================================
                                SUBJECT
                            ======================================= */}

                            <h3 className="queue-subject">

                                {

                                    ticket.subject

                                }

                            </h3>

                            {/* ======================================
                                CUSTOMER
                            ======================================= */}

                            {

                                ticket.customerName && (

                                    <p className="queue-customer">

                                        {

                                            ticket.customerName

                                        }

                                    </p>

                                )

                            }

                            {/* ======================================
                                FOOTER
                            ======================================= */}

                            <div className="queue-card-footer">

                                <span

                                    className={

                                        `priority ${ticket.priority}`

                                    }

                                >

                                    {

                                        formatText(

                                            ticket.priority

                                        )

                                    }

                                </span>

                                <span className="queue-date">

                                    {

                                        formatDate(

                                            ticket.createdAt

                                        )

                                    }

                                </span>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default TicketQueue;