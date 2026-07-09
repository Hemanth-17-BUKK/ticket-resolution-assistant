import "./DashboardStats.css";

function DashboardStats({

    stats

}) {

    const cards = [

        {

            id: "total",

            title: "Total Tickets",

            value:

                stats?.totalTickets || 0,

            description:

                "All Submitted Tickets",

            className: "blue"

        },

        {

            id: "open",

            title: "Open Tickets",

            value:

                stats?.openTickets || 0,

            description:

                "Currently Active",

            className: "orange"

        },

        {

            id: "pending",

            title: "Pending Approval",

            value:

                stats?.pendingApprovalTickets || 0,

            description:

                "Awaiting Review",

            className: "yellow"

        },

        {

            id: "resolved",

            title: "Resolved Tickets",

            value:

                stats?.resolvedTickets || 0,

            description:

                "Successfully Closed",

            className: "green"

        },

        {

            id: "priority",

            title: "High Priority",

            value:

                stats?.highPriorityTickets || 0,

            description:

                "Requires Attention",

            className: "red"

        }

    ];

    return (

        <section className="dashboard-stats">

            {

                cards.map(card => (

                    <article

                        key={card.id}

                        className={`stats-card ${card.className}`}

                    >

                        <h3 className="stats-title">

                            {card.title}

                        </h3>

                        <div className="stats-value">

                            {

                                Number(

                                    card.value

                                ).toLocaleString()

                            }

                        </div>

                        <p className="stats-description">

                            {card.description}

                        </p>

                    </article>

                ))

            }

        </section>

    );

}

export default DashboardStats;