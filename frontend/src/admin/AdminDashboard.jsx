import {

    useEffect,

    useState,

    useCallback

} from "react";

import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

import DashboardHeader from "./components/DashboardHeader/DashboardHeader";

import DashboardStats from "./components/DashboardStats/DashboardStats";

import AdminWorkspace from "./components/AdminWorkspace/AdminWorkspace";

import adminService from "./services/adminService";

import {

    getUserInfo,

    logout

} from "../utils/auth";

function AdminDashboard() {

    const navigate = useNavigate();

    const [admin] = useState(

        getUserInfo()

    );

    const [stats, setStats] = useState(null);

    const [tickets, setTickets] = useState([]);

    const [selectedTicket, setSelectedTicket] =

        useState(null);

    const [loading, setLoading] =

        useState(true);

    const [error, setError] =

        useState("");

    const [lastUpdated, setLastUpdated] =

        useState(null);

    const [refreshing, setRefreshing] =

        useState(false);

        /* ==========================================================
   LOAD DASHBOARD
========================================================== */

const loadDashboard = useCallback(

    async (

        showLoader = false

    ) => {

        try {

            if (showLoader) {

                setLoading(true);

            }

            else {

                setRefreshing(true);

            }

            setError("");

            // const [

            //     dashboard,

            //     ticketList

            // ] = await Promise.all([

            //     adminService.getDashboard(),

            //     adminService.getTickets()

            // ]);

            // setStats(dashboard);

            // setTickets(ticketList);

            // setLastUpdated(

            //     new Date()

            // );

            const [

                dashboard,

                ticketList

            ] = await Promise.all([

                adminService.getDashboard(),

                adminService.getTickets()

            ]);

            const sortedTickets = [...ticketList].sort(

                (a, b) => {

                    const dateA = new Date(

                        a.createdAt ||

                        a.timestamp ||

                        0

                    );

                    const dateB = new Date(

                        b.createdAt ||

                        b.timestamp ||

                        0

                    );

                    return dateB - dateA;

                }

            );

            setStats(dashboard);

            setTickets(sortedTickets);

            setLastUpdated(

                new Date()

            );

        }

        catch (error) {

            console.error(error);

            setError(

                error.message ||

                "Unable to load dashboard."

            );

        }

        finally {

            setLoading(false);

            setRefreshing(false);

        }

    },

    []

);

/* ==========================================================
   LOAD TICKET DETAILS
========================================================== */

const loadTicket = useCallback(

    async (

        ticketId

    ) => {

        try {

            const [

                ticket,

                history

            ] = await Promise.all([

                adminService.getTicket(

                    ticketId

                ),

                adminService.getTicketHistory(

                    ticketId

                )

            ]);

            setSelectedTicket({

                ...ticket,

                history

            });

        }

        catch (error) {

            console.error(error);

            setError(

                error.message ||

                "Unable to load ticket."

            );

        }

    },

    []

);

/* ==========================================================
   LOGOUT
========================================================== */

function handleLogout() {

    logout();

    navigate(

        "/"

    );

}
/* ==========================================================
   INITIAL LOAD
========================================================== */

useEffect(() => {

    loadDashboard(true);

}, [loadDashboard]);

/* ==========================================================
   POLLING
========================================================== */

useEffect(() => {

    const interval = setInterval(() => {

        loadDashboard(false);

    }, 5000);

    return () => clearInterval(interval);

}, [loadDashboard]);

/* ==========================================================
   REFRESH AFTER ACTION
========================================================== */

async function refreshDashboard() {

    await loadDashboard(false);

    if (selectedTicket?.ticketId) {

        await loadTicket(

            selectedTicket.ticketId

        );

    }

}

/* ==========================================================
   LOADING
========================================================== */

// if (loading) {

//     return (

//         <div className="admin-dashboard-loading">

//             Loading dashboard...

//         </div>

//     );

// }

/* ==========================================================
   ERROR
========================================================== */

if (error && !stats) {

    return (

        <div className="admin-dashboard-error">

            <h2>

                Unable to load dashboard

            </h2>

            <p>

                {error}

            </p>

        </div>

    );

}

/* ==========================================================
   UI
========================================================== */

return (

    <div className="admin-dashboard">

        <DashboardHeader

            admin={admin}

            lastUpdated={lastUpdated}

            refreshing={refreshing}

            onLogout={handleLogout}

        />

        <DashboardStats

            stats={stats}

        />

        <AdminWorkspace

            tickets={tickets}

            selectedTicket={selectedTicket}

            onSelectTicket={loadTicket}

            refreshDashboard={refreshDashboard}

            setSelectedTicket={setSelectedTicket}

        />

    </div>

);

}

export default AdminDashboard;