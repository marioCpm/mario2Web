import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// Custom plugin to draw icons on the chart and trigger tooltips
const drawIconsPlugin = {
  id: 'drawIcons',
  afterDatasetsDraw: (chart) => {
    const { ctx, data } = chart;
    const dataset = data.datasets[0];
    ctx.save();

    dataset.data.forEach((dataPoint, index) => {
      const meta = chart.getDatasetMeta(0);
      const { x, y } = meta.data[index].getProps(['x', 'y']);
      const icon = getStepIcon(dataPoint.type);
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, x, y); // Draw the icon
    });

    ctx.restore();
  },
};

const parseReviewText = (reviewText) => {
  const steps = JSON.parse(JSON.parse(reviewText));
  const startTime = new Date(`1970-01-01T${steps[0].timestamp}Z`).getTime();

  return steps.map((step, index) => ({
    x: (new Date(`1970-01-01T${step.timestamp}Z`).getTime() - startTime) / 1000, // Convert to seconds
    y: index + 1,
    type: step.type,
    message: step.message,
    timestamp: step.timestamp,
  }));
};

const getStepIcon = (type) => {
  switch (type) {
    case 'Starting_session':
      return '🔄'; // Replace with an actual icon
    case 'ClickedWellcome':
      return '👋'; // Replace with an actual icon
    case 'informerStarted':
      return 'ℹ️'; // Replace with an actual icon
    case 'InformerDone':
      return '✅'; // Replace with an actual icon
    case 'questionStarted':
      return '❓'; // Replace with an actual icon
    case 'QuestionDone':
      return '✔️'; // Replace with an actual icon
    case 'ScnenarioFinished':
      return '🏁'; // Replace with an actual icon
    default:
      return '❔'; // Default icon for unknown types
  }
};

const AreaChart = ({ data }) => {
  const review = data[0]; // Assuming you have only one review for simplicity
  const parsedDataPoints = parseReviewText(review.reviewText);
  const maxXValue = parsedDataPoints[parsedDataPoints.length - 1].x;

  const chartData = {
    datasets: [
      {
        label: 'Session Steps',
        data: parsedDataPoints,
        pointRadius: 26, // Set the radius for the transparent default points
        pointBackgroundColor: 'rgba(0, 0, 0, 0)', // Make default points transparent
        pointBorderColor: 'rgba(0, 0, 0, 0)', // Make default points transparent
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Session Progress',
        color: 'white', // Set the title color to white
        font: {
          size: 24, // Increase the font size of the title
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `Step ${context[0].raw.y}: ${context[0].raw.type}`;
          },
          label: (context) => {
            const { message, timestamp } = context.raw;
            return [
              `Timestamp: ${timestamp}`,
              `Message: ${message}`,
            ];
          },
        },
        titleFont: {
          size: 16, // Increase the font size of the tooltip title
        },
        bodyFont: {
          size: 14, // Increase the font size of the tooltip body
        },
        bodyColor: 'white', // Set the tooltip text color to white
        titleColor: 'white', // Set the tooltip title color to white
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Step Index',
          color: 'white', // Set the y-axis title color to white
          font: {
            size: 18, // Increase the font size of the y-axis title
          },
        },
        ticks: {
          color: 'white', // Set the y-axis ticks color to white
          font: {
            size: 14, // Increase the font size of the y-axis ticks
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Seconds from Start',
          color: 'white', // Set the x-axis title color to white
          font: {
            size: 18, // Increase the font size of the x-axis title
          },
        },
        type: 'linear', // Use linear scale for relative time
        max: maxXValue,
        ticks: {
          callback: function (value) {
            return `${value}s`;
          },
          color: 'white', // Set the x-axis ticks color to white
          font: {
            size: 14, // Increase the font size of the x-axis ticks
          },
        },
      },
    },
  };

  return (
    <div>
      <Line options={options} data={chartData} plugins={[drawIconsPlugin]} />
    </div>
  );
};

export default AreaChart;
