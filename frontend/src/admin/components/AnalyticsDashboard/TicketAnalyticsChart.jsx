import "./TicketAnalyticsChart.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function TicketAnalyticsChart({ tickets = [] }) {

    const counts = {
        OPEN: 0,
        PENDING_APPROVAL: 0,
        RESOLVED: 0,
        REJECTED: 0
    };

    tickets.forEach(ticket => {

        if (counts[ticket.status] !== undefined) {
            counts[ticket.status]++;
        }

    });

    const total =
        counts.OPEN +
        counts.PENDING_APPROVAL +
        counts.RESOLVED +
        counts.REJECTED;

    const data = {

        labels: [
            "Open",
            "Pending",
            "Resolved",
            "Rejected"
        ],

        datasets: [

            {

                data: [

                    counts.OPEN,
                    counts.PENDING_APPROVAL,
                    counts.RESOLVED,
                    counts.REJECTED

                ],

                backgroundColor: [

                    "#3b82f6",
                    "#f59e0b",
                    "#16a34a",
                    "#dc2626"

                ],

                hoverBackgroundColor: [

                    "#2563eb",
                    "#d97706",
                    "#15803d",
                    "#b91c1c"

                ],

                borderRadius: 0,

                hoverBorderRadius: 0,

                borderSkipped: false,

                borderWidth: 0,

                barThickness: 30,

                maxBarThickness: 34,

                categoryPercentage: 0.40,

                barPercentage: 0.60

            }

        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        animation: {

            duration: 800,
            easing: "easeOutQuart"

        },

        layout: {

            padding: {

                top: 4,
                left: 4,
                right: 4,
                bottom: 0

            }

        },

        plugins: {

            legend: {

                display: false

            },

            tooltip: {

                backgroundColor: "#111827",

                titleColor: "#ffffff",

                bodyColor: "#e5e7eb",

                cornerRadius: 10,

                padding: 12,

                displayColors: false,

                callbacks: {

                    title(context) {

                        return context[0].label;

                    },

                    label(context) {

                        const value = context.raw;

                        const percentage =
                            total === 0
                                ? 0
                                : ((value / total) * 100).toFixed(1);

                        return [

                            `Tickets : ${value}`,
                            `Percentage : ${percentage}%`

                        ];

                    }

                }

            }

        },

        scales: {

            x: {

                grid: {

                    display: false

                },

                border: {

                    display: false

                },

                ticks: {

                    color: "#64748b",

                    font: {

                        size: 11,
                        weight: "600"

                    }

                }

            },

            y: {

                beginAtZero: true,

                grace: "5%",

                border: {

                    display: false

                },

                ticks: {

                    precision: 0,

                    color: "#94a3b8",

                    padding: 6,

                    font: {

                        size: 10

                    },

                    callback(value) {

                        return value === 0 ? "" : value;

                    }

                },

                grid: {

                    color: "rgba(148,163,184,.08)",

                    lineWidth: 1

                }

            }

        }

    };

    const summary = [

        {

            label: "Open",

            value: counts.OPEN,

            color: "open"

        },

        {

            label: "Pending",

            value: counts.PENDING_APPROVAL,

            color: "pending"

        },

        {

            label: "Resolved",

            value: counts.RESOLVED,

            color: "resolved"

        },

        {

            label: "Rejected",

            value: counts.REJECTED,

            color: "rejected"

        }

    ];

    return (

        <div className="ticket-analytics">

            <div className="ticket-chart">

                <Bar
                    data={data}
                    options={options}
                />

            </div>

            <div className="ticket-summary">

                {

                    summary.map(item => (

                        <div
                            key={item.label}
                            className="summary-item"
                        >

                            <div className="summary-left">

                                <span
                                    className={`summary-dot ${item.color}`}
                                />

                                <span>{item.label}</span>

                            </div>

                            <div className="summary-right">

                                <strong>{item.value}</strong>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default TicketAnalyticsChart;