import "./AdminDashboard.css";

function AdminDashboard() {

    return (

        <main className="admin-dashboard">

            {/* ================= HEADER ================= */}

            <header className="admin-header">

                <div className="admin-header-left">

                    <h1>

                        AI Ticket Resolution

                    </h1>

                    <p>

                        Administrator Console

                    </p>

                </div>

                <div className="admin-header-right">

                    <div className="admin-live-status">

                        <span className="live-dot"></span>

                        Live

                    </div>

                    <div className="admin-user">

                        Administrator

                    </div>

                </div>

            </header>

            {/* ================= STATS ================= */}

            <section className="admin-stats">

                <div className="admin-stat-card">

                    <span>

                        Open

                    </span>

                    <h2>

                        18

                    </h2>

                </div>

                <div className="admin-stat-card">

                    <span>

                        Pending

                    </span>

                    <h2>

                        5

                    </h2>

                </div>

                <div className="admin-stat-card">

                    <span>

                        Resolved

                    </span>

                    <h2>

                        42

                    </h2>

                </div>

                <div className="admin-stat-card">

                    <span>

                        Critical

                    </span>

                    <h2>

                        2

                    </h2>

                </div>

            </section>

            {/* ================= WORKSPACE ================= */}

            <section className="admin-workspace">

                <div className="admin-panel">

                    <h2>

                        Ticket Queue

                    </h2>

                </div>

                <div className="admin-panel">

                    <h2>

                        Ticket Workspace

                    </h2>

                </div>

                <div className="admin-panel">

                    <h2>

                        Resolution Workspace

                    </h2>

                </div>

            </section>

        </main>

    );

}

export default AdminDashboard;