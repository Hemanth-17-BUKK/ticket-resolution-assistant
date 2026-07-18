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

function AIAccuracyChart({ stats }) {

    const resolved =
        stats?.resolvedTickets || 0;

    const rejected =
        stats?.rejectedTickets || 0;

    const total =
        resolved + rejected;

    const accuracy =
        total === 0
            ? 0
            : Math.round(
                (resolved / total) * 100
            );

    const data = {

    labels: [

        "Resolved",

        "Rejected"

    ],

    datasets: [

        {

            data: [

                resolved,

                rejected

            ],

            backgroundColor: [

                "#16a34a",

                "#f70808"

            ],

            hoverBackgroundColor: [

                "#15803d",

                "#f70808"

            ],

            borderColor: "#ffffff",

            borderWidth: 4,

            borderRadius: 0,

            spacing: 0,

            hoverOffset: 10

        }

    ]

};

    const options = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "76%",

    animation: {

        animateRotate: true,

        duration: 1200,

        easing: "easeOutQuart"

    },

    plugins: {

        legend: {

            display: false

        },

        tooltip: {

            backgroundColor: "#0f172a",

            titleColor: "#ffffff",

            bodyColor: "#ffffff",

            padding: 14,

            cornerRadius: 12,

            displayColors: true

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

                        {accuracy}%

                    </h2>

                    <span>

                        Accuracy

                    </span>

                </div>

            </div>

            <div className="accuracy-legend">

                <div className="legend-item">

                    <span className="legend-dot resolved"></span>

                    <span>

                        Resolved

                    </span>

                    <strong>

                        {resolved}

                    </strong>

                </div>

                <div className="legend-item">

                    <span className="legend-dot rejected"></span>

                    <span>

                        Rejected

                    </span>

                    <strong>

                        {rejected}

                    </strong>

                </div>

            </div>

        </div>

    );

}

export default AIAccuracyChart;