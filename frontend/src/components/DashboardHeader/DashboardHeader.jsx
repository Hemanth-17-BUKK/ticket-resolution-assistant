import "./DashboardHeader.css";

import ProfileDropdown
    from "../ProfileDropdown/ProfileDropdown";

function DashboardHeader({

    displayName,

    email,

    initials,

    showProfileMenu,

    setShowProfileMenu,

    logout,

    profileRef

}) {

    return (

        <header className="dashboard-header">

            <h1 className="header-title">
                TICKET RESOLUTION ASSISTANT
            </h1>

            <div
                className="header-right"
                ref={profileRef}
            >

                <span className="profile-name">

                    {displayName}

                </span>

                <div

                    className="profile-avatar"

                    onClick={() =>

                        setShowProfileMenu(

                            !showProfileMenu

                        )

                    }

                >

                    {initials}

                </div>

                {

                    showProfileMenu && (

                        <ProfileDropdown

                            displayName={displayName}

                            email={email}

                            initials={initials}

                            logout={logout}

                        />

                    )

                }

            </div>

        </header>

    );

}

export default DashboardHeader;