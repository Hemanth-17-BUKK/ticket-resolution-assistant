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

        setFiles(prev => [

            ...prev,

            ...selectedFiles

        ]);

    }

    function removeFile(index) {

        setFiles(

            files.filter(

                (_, i) => i !== index

            )

        );

    }

    return (

        <section className="ticket-form">

            {/* ================= HEADER ================= */}

            <div className="ticket-form-header">

                <h2 className="ticket-form-title">

                    CREATE NEW TICKET

                </h2>

                

            </div>

            {/* ================= ALERTS ================= */}

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

            {/* ================= SUBJECT ================= */}

            <div className="ticket-form-field">

                <label>

                    Subject

                </label>

                <input

                    type="text"

                    placeholder="Enter a short summary of your issue"

                    value={subject}

                    onChange={(event) =>

                        setSubject(

                            event.target.value

                        )

                    }

                    onKeyDown={(event) => {

                        if (

                            event.key === "Enter"

                        ) {

                            event.preventDefault();

                            submitTicket();

                        }

                    }}

                />

            </div>

            {/* ================= MESSAGE ================= */}

            <div className="ticket-form-field">

                <label>

                    Message

                </label>

                <textarea

                    placeholder="Describe your issue in detail..."

                    value={message}

                    onChange={(event) =>

                        setMessage(

                            event.target.value

                        )

                    }

                />

                <div className="ticket-character-count">

                    {message.length} / 2000

                </div>

            </div>
                        {/* ================= ATTACHMENTS ================= */}

            <div className="ticket-form-field">

                <label>

                    Attachments

                </label>

                <label

                    htmlFor="ticket-upload"

                    className="ticket-upload-area"

                >

                    <div className="ticket-upload-icon">

                        📎

                    </div>

                    <div className="ticket-upload-title">

                        Drag & Drop files here

                    </div>

                    <div className="ticket-upload-subtitle">

                        or click to browse your computer

                    </div>

                    <div className="ticket-upload-info">

                        PDF • PNG • JPG • DOCX

                    </div>

                </label>

                <input

                    id="ticket-upload"

                    type="file"

                    hidden

                    multiple

                    onChange={handleFileChange}

                />

            </div>

            {/* ================= FILES ================= */}

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

                                        className="ticket-file-card"

                                    >

                                        <span

                                            className="ticket-file-name"

                                        >

                                            {file.name}

                                        </span>

                                        <button

                                            type="button"

                                            className="ticket-file-remove"

                                            onClick={() =>

                                                removeFile(index)

                                            }

                                        >

                                            ×

                                        </button>

                                    </div>

                                )

                            )

                        }

                    </div>

                )

            }

            {/* ================= ACTION ================= */}

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