import "./AdminProfileDropdown.css";

import { LogOut } from "lucide-react";

function AdminProfileDropdown({

    displayName,

    email,

    initials,

    logout

}) {

    return (

        <div className="admin-profile-dropdown">

            <div className="admin-profile-card">

                <div className="admin-profile-avatar-large">

                    {initials}

                </div>

                <div className="admin-profile-info">

                    <h3>

                        {displayName}

                    </h3>

                    <p>

                        {email}

                    </p>

                </div>

            </div>

            <button

                className="admin-logout-btn"

                onClick={logout}

            >

                <LogOut size={18} />

                Logout

            </button>

        </div>

    );

}

export default AdminProfileDropdown;