import "./SearchSection.css";

function SearchSection({

    ticketId,

    setTicketId,

    searchTicket

}) {

    return (

        <section className="search-section">

            <h2 className="search-title">

                SEARCH TICKET

            </h2>

            <div className="search-row">

                <input

                    type="text"

                    className="search-input"

                    placeholder="Search by Ticket ID or Subject..."

                    value={ticketId}

                    onChange={(event) =>

                        setTicketId(

                            event.target.value

                        )

                    }

                    onKeyDown={(event) => {

                        if (

                            event.key === "Enter"

                        ) {

                            searchTicket();

                        }

                    }}

                />

                <button

                    className="search-button"

                    onClick={searchTicket}

                >

                    Search

                </button>

            </div>

        </section>

    );

}

export default SearchSection;