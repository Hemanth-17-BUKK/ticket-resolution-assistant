import "./OverviewPanel.css";

function StatCard({

    title,

    value,

    type

}) {

    return (

        <div className={`stat-card ${type}`}>

            <div className="stat-header">

                {title}

            </div>

            <div className="stat-value">

                {value}

            </div>

        </div>

    );

}

function OverviewPanel({

    totalTickets,

    openTickets,

    pendingTickets,

    resolvedTickets

}) {

    return (

        <aside className="overview-panel">

            <h2 className="overview-title">

                TICKETS OVERVIEW

            </h2>

            <div className="overview-cards">

                <StatCard

                    title="TOTAL"

                    value={totalTickets}

                    type="total"

                />

                <StatCard

                    title="OPEN"

                    value={openTickets}

                    type="open"

                />

                <StatCard

                    title="PENDING"

                    value={pendingTickets}

                    type="pending"

                />

                <StatCard

                    title="CLOSED"

                    value={resolvedTickets}

                    type="resolved"

                />

            </div>

        </aside>

    );

}

export default OverviewPanel;