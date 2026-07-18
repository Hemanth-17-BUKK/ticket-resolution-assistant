import "./AnalyticsDashboard.css";
import AIAccuracyChart from "./AIAccuracyChart";
import TicketAnalyticsChart from "./TicketAnalyticsChart";

import RecentTicketsTable from "./RecentTicketsTable";
function AnalyticsDashboard({

    tickets,

    stats

}) {

    return (

        <div className="analytics-dashboard">

            <div className="analytics-top">

                <section className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>AI Accuracy</h2>

                    </div>

                    <div className="analytics-card-body">

                        <AIAccuracyChart

                            stats={stats}

                        />

                    </div>

                </section>

                <section className="analytics-card">

                    <div className="analytics-card-header">

                        <h2>Ticket Analytics</h2>

                    </div>

                    <div className="analytics-card-body">

                        <TicketAnalyticsChart
                            tickets={tickets}
                        />

                    </div>

                </section>

            </div>

            <section className="analytics-card">

                <div className="analytics-card-header">

                    <h2>Recent Tickets</h2>

                    <span className="analytics-card-subtitle">
                        Latest {tickets.length >= 10 ? 10 : tickets.length} Tickets
                    </span>

                </div>

                <div className="analytics-card-body">

                    <RecentTicketsTable
                        tickets={tickets}
                    />

                </div>

            </section>

        </div>

    );

}

export default AnalyticsDashboard;