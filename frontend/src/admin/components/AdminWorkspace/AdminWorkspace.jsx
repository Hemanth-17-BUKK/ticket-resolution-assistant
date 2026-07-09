import "./AdminWorkspace.css";

import TicketQueue from "../TicketQueue/TicketQueue";

import TicketViewer from "../TicketViewer/TicketViewer";

import ResolutionWorkspace from "../ResolutionWorkspace/ResolutionWorkspace";

function AdminWorkspace({

    tickets,

    selectedTicket,

    onSelectTicket,

    refreshDashboard,

    setSelectedTicket

}) {

    return (

        <section className="admin-workspace">

            <div className="workspace-left">

                <TicketQueue

                    tickets={tickets}

                    selectedTicket={selectedTicket}

                    onSelectTicket={onSelectTicket}

                />

            </div>

            <div className="workspace-center">

                <TicketViewer

                    ticket={selectedTicket}

                />

            </div>

            <div className="workspace-right">

                <ResolutionWorkspace

                    ticket={selectedTicket}

                    refreshDashboard={refreshDashboard}

                    setSelectedTicket={setSelectedTicket}

                />

            </div>

        </section>

    );

}

export default AdminWorkspace;