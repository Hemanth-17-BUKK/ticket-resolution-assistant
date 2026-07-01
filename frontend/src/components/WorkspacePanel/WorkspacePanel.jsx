import "./WorkspacePanel.css";

import SearchSection from "./SearchSection";
import TicketForm from "./TicketForm";
import TicketDetails from "./TicketDetails";

function WorkspacePanel({

    selectedTicket,

    setSelectedTicket,

    ticketId,
    setTicketId,

    searchTicket,

    subject,
    setSubject,

    message,
    setMessage,

    files,
    setFiles,

    submitTicket,

    successMessage,
    errorMessage

}) {

    return (

        <div className="workspace-panel">

            <SearchSection

                ticketId={ticketId}
                setTicketId={setTicketId}
                searchTicket={searchTicket}

            />

            <div className="workspace-content">

                {

                    selectedTicket

                        ?

                        <TicketDetails

                            ticket={selectedTicket}

                            setSelectedTicket={setSelectedTicket}

                            setSubject={setSubject}

                            setMessage={setMessage}

                            setFiles={setFiles}

                        />

                        :

                        <TicketForm

                            subject={subject}
                            setSubject={setSubject}

                            message={message}
                            setMessage={setMessage}

                            files={files}
                            setFiles={setFiles}

                            submitTicket={submitTicket}

                            successMessage={successMessage}
                            errorMessage={errorMessage}

                        />

                }

            </div>

        </div>

    );

}

export default WorkspacePanel;