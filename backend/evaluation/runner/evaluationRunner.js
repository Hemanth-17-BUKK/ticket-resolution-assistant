require("dotenv").config();

const fs = require("fs");
const path = require("path");

const submitTicket = require("../utils/submitTicket");
const pollLatestTicket = require("../utils/pollLatestTicket");
const compareResults = require("../utils/compareResults");
const writeResults = require("../utils/reportWriter");
const authenticate = require("../utils/authenticate");

const {
    calculateMetrics,
    writeSummary
} = require("../metrics/metrics");

const logger = require("../utils/logger");

const users = require("../users.json");

async function runEvaluation() {

    logger.title("AI Ticket Evaluation Started");

    // ===============================
    // Authenticate all users
    // ===============================

    const tokenCache = {};

    logger.title("Authenticating Users");

    for (const user of users) {

        try {

            const session = await authenticate(
                user.email,
                user.password
            );

            tokenCache[user.email] = session.idToken;

            logger.success(
                `${user.email} authenticated`
            );

        }

        catch (error) {

            logger.failure(error.message);
            return;

        }

    }

    // ===============================
    // Load Dataset
    // ===============================

    const datasetPath = path.join(
        __dirname,
        "../dataset/eval-dataset.json"
    );

    const dataset = JSON.parse(
        fs.readFileSync(
            datasetPath,
            "utf8"
        )
    );

    const results = [];

    const startTime = Date.now();

    // ===============================
    // Execute Evaluation
    // ===============================

    const ticketsPerUser = 10;

    for (let i = 0; i < dataset.length; i++) {

        const ticket = dataset[i];

        const userIndex = Math.floor(i / ticketsPerUser);

        if (userIndex >= users.length) {
            throw new Error(
                `Not enough users. Need at least ${Math.ceil(dataset.length / ticketsPerUser)} users.`
            );
        }

        const user = users[userIndex];

        const token = tokenCache[user.email];

        console.log();

        logger.title(
            `Ticket ${i + 1} / ${dataset.length}`
        );

        console.log(
            `User       : ${user.email}`
        );

        console.log(
            `Subject    : ${ticket.input.subject}`
        );

        try {

            // Submit Ticket
            await submitTicket(
                ticket,
                token
            );

            // Wait until AI processing completes
            const {
                ticket: processedTicket,
                latency
            } = await pollLatestTicket(
                token
            );

            // Compare Expected vs Actual
            const comparison = compareResults(
                ticket.expected,
                processedTicket,
                latency
            );

            results.push(comparison);

            logger.success(
                `Completed in ${latency} ms`
            );

        }

        catch (error) {

            logger.failure(
                error.message
            );

            results.push({

                user: user.email,

                subject: ticket.input.subject,

                expected: ticket.expected,

                error: error.message

            });

        }

    }

    // ===============================
    // Reports
    // ===============================

    writeResults(results);

    const summary =
        calculateMetrics(results);

    writeSummary(summary);

    const totalTime =
        Date.now() - startTime;

    logger.title("Evaluation Complete");

    console.table(summary);

    console.log();

    console.log(
        `Total Execution Time : ${(totalTime / 1000).toFixed(2)} seconds`
    );

}

runEvaluation();