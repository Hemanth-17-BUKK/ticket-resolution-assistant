import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Dashboard.css";

import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import OverviewPanel from "../components/OverviewPanel/OverviewPanel";
import WorkspacePanel from "../components/WorkspacePanel/WorkspacePanel";
import TicketHistory from "../components/TicketHistory/TicketHistory";

import { API_URL } from "../utils/constants";
import { getToken, getUserInfo } from "../utils/auth";

function Dashboard() {

    const navigate = useNavigate();

    const profileRef = useRef(null);

    const {

        displayName,

        email,

        initials

    } = getUserInfo();

    const [tickets, setTickets] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const [ticketId, setTicketId] =
        useState("");

    const [selectedTicket, setSelectedTicket] =
        useState(null);

    const [subject, setSubject] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [files, setFiles] =
        useState([]);

    const [

        successMessage,

        setSuccessMessage

    ] = useState("");

    const [

        errorMessage,

        setErrorMessage

    ] = useState("");

    const [

        showProfileMenu,

        setShowProfileMenu

    ] = useState(false);


    useEffect(() => {

        const interval = setInterval(async () => {

            await loadTickets();

            if (selectedTicket) {
                await searchTicket(selectedTicket.ticketId);
            }

        }, 5000);

        return () => clearInterval(interval);

    }, [selectedTicket]);

    useEffect(() => {

        loadTickets(true);

    }, []);

    useEffect(() => {

        const handleClickOutside = (

            event

        ) => {

            if (

                profileRef.current &&

                !profileRef.current.contains(

                    event.target

                )

            ) {

                setShowProfileMenu(

                    false

                );

            }

        };

        document.addEventListener(

            "mousedown",

            handleClickOutside

        );

        return () =>

            document.removeEventListener(

                "mousedown",

                handleClickOutside

            );

    }, []);

    const stats = useMemo(() => ({

        total:
            tickets.length,

        open:
            tickets.filter(
                ticket =>
                    ticket.status ===
                    "OPEN"
            ).length,

        pending:
            tickets.filter(
                ticket =>
                    ticket.status ===
                    "PENDING_APPROVAL"
            ).length,

        resolved:
            tickets.filter(
                ticket =>

                    ticket.status ===
                        "RESOLVED" ||

                    ticket.status ===
                        "REJECTED"

            ).length

    }), [tickets]);

    const sortedTickets =

        useMemo(

            () =>

                [...tickets].sort(

                    (

                        a,

                        b

                    ) =>

                        new Date(

                            b.createdAt

                        )

                        -

                        new Date(

                            a.createdAt

                        )

                ),

            [tickets]

        );

    const loadTickets = async (showLoader = false) => {

        if (showLoader) {
            setLoading(true);
        }

        try {

            const token = getToken();

            const response = await axios.get(

                `${API_URL}/my-tickets`,

                {

                    headers: {

                        Authorization:

                            `Bearer ${token}`

                    }

                }

            );


            console.log(response.data);

            setTickets(

                response.data

            );

        }

        catch (error) {

            console.error(

                error

            );

        }

        finally {

            if (showLoader) {
                setLoading(false);
            }

        }

    };

    const searchTicket = async (

        id = ticketId

    ) => {

        try {

            const token =

                getToken();

            const response =

                await axios.get(

                    `${API_URL}/tickets/${id}`,

                    {

                        headers: {

                            Authorization:

                                `Bearer ${token}`

                        }

                    }

                );

            setSelectedTicket(

                response.data

            );

            

        }

        catch (error) {

            console.error(

                error

            );

            setErrorMessage(

                "Ticket not found"

            );

            setTimeout(

                () =>

                    setErrorMessage(

                        ""

                    ),

                3000

            );

        }

    };

    const convertToBase64 = (

        file

    ) => {

        return new Promise(

            (

                resolve,

                reject

            ) => {

                const reader =

                    new FileReader();

                reader.readAsDataURL(

                    file

                );

                reader.onload =

                    () => {

                        resolve(

                            reader.result

                                .split(",")

                                [1]

                        );

                    };

                reader.onerror =

                    reject;

            }

        );

    };

    const openTicket = async (

        ticket

    ) => {

        setTicketId(

            ticket.ticketId

        );

        await searchTicket(

            ticket.ticketId

        );

    };

    const logout = () => {

        localStorage.removeItem(

            "token"

        );

        navigate(

            "/"

        );

    };

    const submitTicket = async () => {

        if (

            !subject.trim() ||

            !message.trim()

        ) {

            setErrorMessage(

                "Subject and Message are required."

            );

            setTimeout(

                () =>

                    setErrorMessage(

                        ""

                    ),

                3000

            );

            return;

        }

        try {

            const token =

                getToken();

            const attachments = [];

            for (

                const file of files

            ) {

                attachments.push({

                    fileName:

                        file.name,

                    content:

                        await convertToBase64(

                            file

                        )

                });

            }

            await axios.post(

                `${API_URL}/tickets`,

                {

                    subject,

                    message,

                    attachments

                },

                {

                    headers: {

                        Authorization:

                            `Bearer ${token}`

                    }

                }

            );

            setSuccessMessage(

                "Ticket submitted successfully."

            );

            setTimeout(

                () =>

                    setSuccessMessage(

                        ""

                    ),

                3000

            );

            setSubject("");

            setMessage("");

            setFiles([]);

            setTicketId("");

            setSelectedTicket(

                null

            );

            

            await loadTickets();

        }

        catch (error) {

            console.error(

                error

            );

            setErrorMessage(

                "Failed to submit ticket."

            );

            setTimeout(

                () =>

                    setErrorMessage(

                        ""

                    ),

                3000

            );

        }

    };

    
    return (

        <>

            <DashboardHeader

                profileRef={profileRef}

                displayName={displayName}

                email={email}

                initials={initials}

                showProfileMenu={showProfileMenu}

                setShowProfileMenu={setShowProfileMenu}

                logout={logout}

            />

            <div className="dashboard">

                <div className="left-panel">

                    <OverviewPanel

                        totalTickets={stats.total}

                        openTickets={stats.open}

                        pendingTickets={stats.pending}

                        resolvedTickets={stats.resolved}

                    />

                </div>

                <div className="middle-panel">

                    <WorkspacePanel

                        selectedTicket={selectedTicket}

                        setSelectedTicket={setSelectedTicket}

                        ticketId={ticketId}
                        setTicketId={setTicketId}

                        subject={subject}
                        setSubject={setSubject}

                        message={message}
                        setMessage={setMessage}

                        files={files}
                        setFiles={setFiles}

                        submitTicket={submitTicket}

                        searchTicket={searchTicket}

                        successMessage={successMessage}
                        errorMessage={errorMessage}

                    />

                </div>

                <div className="right-panel">

                    <TicketHistory

                        tickets={sortedTickets}

                        loading={loading}

                        openTicket={openTicket}

                    />

                </div>

            </div>

        </>

    );

}

export default Dashboard;