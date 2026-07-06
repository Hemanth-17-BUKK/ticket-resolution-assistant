import "./DashboardHeader.css";

function DashboardHeader() {

    const currentDate = new Date().toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

    return (

        <header className="admin-header">

            <div className="admin-header-left">

                <h1>

                    AI Ticket Resolution Assistant

                </h1>

                <p>

                    Administrator Console

                </p>

            </div>

            <div className="admin-header-right">

                <div className="admin-live">

                    <span className="admin-live-dot"></span>

                    Live

                </div>

                <div className="admin-date">

                    {currentDate}

                </div>

                <div className="admin-user">

                    Administrator

                </div>

            </div>

        </header>

    );

}

export default DashboardHeader;