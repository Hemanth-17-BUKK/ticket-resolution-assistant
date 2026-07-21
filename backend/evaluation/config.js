module.exports = {

    api: {

        submitEndpoint:

            "https://nlct7zgx7f.execute-api.us-east-1.amazonaws.com/Prod/tickets",

        queryEndpoint:

            "https://nlct7zgx7f.execute-api.us-east-1.amazonaws.com/Prod/my-tickets",

        timeout: 30000

    },

    polling: {

        interval: 5000,

        maxAttempts: 12

    }

};