import "./ProfileDropdown.css";

import { LogOut } from "lucide-react";

function ProfileDropdown({

    displayName,

    email,

    initials,

    logout

}) {

    return (

        <div className="profile-dropdown">

            <div className="profile-card">

                <div className="profile-avatar-large">

                    {initials}

                </div>

                <div className="profile-info">

                    <h3>

                        {displayName}

                    </h3>

                    <p>

                        {email}

                    </p>

                </div>

            </div>

            <button

                className="logout-btn"

                onClick={logout}

            >

                <LogOut size={18} />

                Logout

            </button>

        </div>

    );

}

export default ProfileDropdown;