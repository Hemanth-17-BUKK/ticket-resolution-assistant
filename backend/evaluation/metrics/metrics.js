const fs = require("fs");
const path = require("path");

function calculateMetrics(results) {

    const successfulResults =

        results.filter(

            result => !result.error

        );

    const totalTickets =

        results.length;

    const successful =

        successfulResults.length;

    const failed =

        totalTickets - successful;

    if (successful === 0) {

        return {

            totalTickets,

            successful,

            failed,

            successRate: 0

        };

    }

    let categoryCorrect = 0;
    let priorityCorrect = 0;
    let sentimentCorrect = 0;

    let totalKeywordScore = 0;
    let totalLatency = 0;
    let totalConfidence = 0;

    let highestLatency = 0;
    let lowestLatency = Number.MAX_SAFE_INTEGER;

    successfulResults.forEach(result => {

        if (result.categoryCorrect)
            categoryCorrect++;

        if (result.priorityCorrect)
            priorityCorrect++;

        if (result.sentimentCorrect)
            sentimentCorrect++;

        totalKeywordScore +=

            result.keywordScore || 0;

        totalLatency +=

            result.latency || 0;

        totalConfidence +=

            result.confidence || 0;

        if (result.latency > highestLatency)

            highestLatency = result.latency;

        if (result.latency < lowestLatency)

            lowestLatency = result.latency;

    });

    return {

        totalTickets,

        successful,

        failed,

        successRate:

            Number(

                ((successful / totalTickets) * 100)

                    .toFixed(2)

            ),

        categoryAccuracy:

            Number(

                ((categoryCorrect / successful) * 100)

                    .toFixed(2)

            ),

        priorityAccuracy:

            Number(

                ((priorityCorrect / successful) * 100)

                    .toFixed(2)

            ),

        sentimentAccuracy:

            Number(

                ((sentimentCorrect / successful) * 100)

                    .toFixed(2)

            ),

        averageKeywordMatch:

            Number(

                (totalKeywordScore / successful)

                    .toFixed(2)

            ),

        averageConfidence:

            Number(

                (totalConfidence / successful)

                    .toFixed(2)

            ),

        averageLatency:

            Number(

                (totalLatency / successful)

                    .toFixed(2)

            ),

        highestLatency,

        lowestLatency

    };

}

function writeSummary(summary) {

    const reportPath = path.join(

        __dirname,

        "../reports",

        "summary.json"

    );

    fs.writeFileSync(

        reportPath,

        JSON.stringify(

            summary,

            null,

            2

        )

    );

    console.log(

        "✓ summary.json created"

    );

}

module.exports = {

    calculateMetrics,

    writeSummary

};