import "./TicketForm.css";

function TicketForm({

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

    function handleFileChange(event) {

        const selectedFiles = Array.from(
            event.target.files
        );

        setFiles(selectedFiles);

    }

    return (

        <section className="ticket-form">

            <h2 className="ticket-form-title">

                Create New Ticket

            </h2>

            {

                successMessage && (

                    <div className="ticket-form-success">

                        {successMessage}

                    </div>

                )

            }

            {

                errorMessage && (

                    <div className="ticket-form-error">

                        {errorMessage}

                    </div>

                )

            }

            <div className="ticket-form-field">

                <label>

                    SUBJECT

                </label>

                <input

                    type="text"

                    placeholder="Enter ticket subject..."

                    value={subject}

                    onChange={(event) =>

                        setSubject(
                            event.target.value
                        )

                    }

                    onKeyDown={(event) => {

                        if (event.key === "Enter") {

                            event.preventDefault();

                            submitTicket();

                        }

                    }}

                />

            </div>

            <div className="ticket-form-field">

                <label>

                    MESSAGE

                </label>

                <textarea

                    placeholder="Describe your issue..."

                    value={message}

                    onChange={(event) =>

                        setMessage(
                            event.target.value
                        )

                    }

                />

            </div>

            <div className="ticket-form-field">

                <label>

                    ATTACHMENTS

                </label>

                <div className="ticket-form-upload-row">

                    <label
                        htmlFor="ticket-upload"
                        className="ticket-form-upload-button"
                    >

                        Choose Files

                    </label>

                    <span className="ticket-form-upload-info">

                        PDF • PNG • JPG • DOCX

                    </span>

                </div>

                <input

                    id="ticket-upload"

                    type="file"

                    hidden

                    multiple

                    onChange={handleFileChange}

                />

            </div>

            {

                files.length > 0 && (

                    <div className="ticket-form-files">

                        {

                            files.map(

                                (

                                    file,

                                    index

                                ) => (

                                    <div

                                        key={index}

                                        className="ticket-form-chip"

                                    >

                                        {file.name}

                                    </div>

                                )

                            )

                        }

                    </div>

                )

            }

            <div className="ticket-form-actions">

                <button

                    className="ticket-form-submit"

                    onClick={submitTicket}

                >

                    Submit Ticket

                </button>

            </div>

        </section>

    );

}

export default TicketForm;