import "./AIAccuracyChart.css";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip
);

function AIAccuracyChart({ tickets = [] }) {

    const confidenceTickets = tickets.filter(ticket =>
        typeof ticket.aiConfidence === "number" &&
        !Number.isNaN(ticket.aiConfidence)
    );

    const totalEvaluated = confidenceTickets.length;

    const averageConfidence =
        totalEvaluated === 0
            ? 0
            : Number(
                (
                    confidenceTickets.reduce(
                        (sum, ticket) => sum + ticket.aiConfidence,
                        0
                    ) / totalEvaluated
                ).toFixed(1)
            );

    const confidenceLevels = {
        veryHigh: 0,
        high: 0,
        moderate: 0,
        low: 0
    };

    confidenceTickets.forEach(ticket => {

        const confidence = ticket.aiConfidence;

        if (confidence >= 90) {

            confidenceLevels.veryHigh++;

        } else if (confidence >= 75) {

            confidenceLevels.high++;

        } else if (confidence >= 60) {

            confidenceLevels.moderate++;

        } else {

            confidenceLevels.low++;

        }

    });

    const data = {

        datasets: [

            {

                data: [

                    averageConfidence,
                    100 - averageConfidence

                ],

                backgroundColor: [

                    "#2563eb",
                    "#e5e7eb"

                ],

                hoverBackgroundColor: [

                    "#2563eb",
                    "#e5e7eb"

                ],

                borderWidth: 0,

                cutout: "78%"

            }

        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        animation: {

            animateRotate: true,

            duration: 1000,

            easing: "easeOutQuart"

        },

        plugins: {

            legend: {

                display: false

            },

            tooltip: {

                callbacks: {

                    label() {

                        return `Average AI Confidence : ${averageConfidence}%`;

                    }

                }

            }

        }

    };

    return (

        <div className="accuracy-chart">

            <div className="accuracy-doughnut">

                <Doughnut

                    data={data}

                    options={options}

                />

                <div className="accuracy-center">

                    <h2>

                        {averageConfidence}%

                    </h2>

                </div>

            </div>

            <div className="confidence-grid">

    <div className="confidence-card very-high">

        <div className="confidence-left">

            <div className="confidence-title">

                Very High

            </div>

            <span>

                90 – 100%

            </span>

        </div>

        <strong>

            {confidenceLevels.veryHigh}

        </strong>

    </div>

    <div className="confidence-card high">

        <div className="confidence-left">

            <div className="confidence-title">

                High

            </div>

            <span>

                75 – 89%

            </span>

        </div>

        <strong>

            {confidenceLevels.high}

        </strong>

    </div>

    <div className="confidence-card moderate">

        <div className="confidence-left">

            <div className="confidence-title">

                Moderate

            </div>

            <span>

                60 – 74%

            </span>

        </div>

        <strong>

            {confidenceLevels.moderate}

        </strong>

    </div>

    <div className="confidence-card low">

        <div className="confidence-left">

            <div className="confidence-title">

                Low

            </div>

            <span>

                Below 60%

            </span>

        </div>

        <strong>

            {confidenceLevels.low}

        </strong>

    </div>

</div>

        </div>

    );

}

export default AIAccuracyChart;