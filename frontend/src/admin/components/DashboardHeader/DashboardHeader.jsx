import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

import "./DashboardHeader.css";

import AdminProfileDropdown from "./AdminProfileDropdown";

function DashboardHeader({

    admin,

    adminTitle,

    onLogout,

    showAnalytics,

    setShowAnalytics

}) {

    const [

        open,

        setOpen

    ] = useState(false);

    const dropdownRef =

        useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (

                dropdownRef.current &&

                !dropdownRef.current.contains(

                    event.target

                )

            ) {

                setOpen(false);

            }

        }

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

    return (

        <header className="dashboard-header">

            <h1 className="dashboard-title">

                TICKET RESOLUTION ASSISTANT

            </h1>

           <div className="dashboard-header-actions">

    <button

        className="analytics-button"

        onClick={() =>

            setShowAnalytics(

                !showAnalytics

            )

        }

    >

        {

            showAnalytics

                ? "Home"

                : "Analytics"

        }

    </button>

    <div

        className="admin-profile-wrapper"

        ref={dropdownRef}

    >

        <button

            className="admin-profile-button"

            onClick={() =>

                setOpen(

                    !open

                )

            }

        >

            <div className="admin-avatar">

                {admin.initials}

            </div>

            <span>

                ADMIN

            </span>

            <ChevronDown

                size={18}

            />

        </button>

        {

            open && (

                <AdminProfileDropdown

                    initials={

                        admin.initials

                    }

                    email={

                        admin.email

                    }

                    displayName={

                        adminTitle ||

                        "System Administrator"

                    }

                    logout={

                        onLogout

                    }

                />

            )

        }

    </div>

</div>

        </header>

    );

}

export default DashboardHeader;