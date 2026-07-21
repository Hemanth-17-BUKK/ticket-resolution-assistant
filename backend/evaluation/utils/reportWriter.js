const fs = require("fs");
const path = require("path");

function writeResults(results) {

    const reportDir = path.join(
        __dirname,
        "../reports"
    );

    if (!fs.existsSync(reportDir)) {

        fs.mkdirSync(
            reportDir,
            {
                recursive: true
            }
        );

    }

    fs.writeFileSync(

        path.join(
            reportDir,
            "results.json"
        ),

        JSON.stringify(
            results,
            null,
            2
        )

    );

    console.log(
        "✓ results.json created"
    );

}

module.exports = writeResults;