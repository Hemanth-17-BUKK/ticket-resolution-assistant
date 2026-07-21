const axios = require("axios");
const config = require("../config");

async function pollLatestTicket(token) {

    const startTime = Date.now();

    let attempts = 0;

    while (attempts < config.polling.maxAttempts) {

        const response = await axios.get(

            config.api.queryEndpoint,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        const tickets = response.data || [];
        // console.log("\n================================");
        // console.log(`Polling Attempt: ${attempts + 1}`);
        // console.log(`Tickets Returned: ${tickets.length}`);

        // tickets
        //     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        //     .slice(0, 3)
        //     .forEach((ticket, index) => {

        //         console.log(`Ticket ${index + 1}`);

        //         console.log({
        //             ticketId: ticket.ticketId,
        //             subject: ticket.subject,
        //             status: ticket.status,
        //             category: ticket.category,
        //             priority: ticket.priority,
        //             sentiment: ticket.sentiment,
        //             createdAt: ticket.createdAt
        //         });

        //     });

        if (tickets.length > 0) {

            const latestTicket = tickets
                .sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                )[0];


            // console.log({
            //     ticketId: latestTicket.ticketId,
            //     status: latestTicket.status,
            //     category: latestTicket.category,
            //     priority: latestTicket.priority,
            //     sentiment: latestTicket.sentiment
            // });

            const processed =

                latestTicket.category &&
                latestTicket.priority &&
                latestTicket.sentiment;

            if (processed) {

                return {

                    latency:
                        Date.now() - startTime,

                    ticket:
                        latestTicket

                };

            }

        }

        await new Promise(resolve =>
            setTimeout(
                resolve,
                config.polling.interval
            )
        );

        attempts++;

    }

    throw new Error(
        "AI Processing Timeout"
    );

}

module.exports = pollLatestTicket;