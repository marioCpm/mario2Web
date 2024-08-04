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

const drawIconsPlugin = {
  id: 'drawIcons',
  afterDatasetsDraw: (chart) => {
    const { ctx, scales } = chart;
    const { y } = scales;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      dataset.data.forEach((dataPoint, index) => {
        const { x, y: yPos } = meta.data[index].getProps(['x', 'y']);
        const icon = getStepIcon(dataPoint.type, dataPoint);
        if (icon) {
          if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('/'))) {
            const image = new Image();
            const imageSize = 40;
            image.onload = () => {
              ctx.drawImage(image, x - imageSize / 2, yPos - imageSize * 1.5, imageSize, imageSize);
            };
            image.src = icon;
          } else {
            ctx.font = '20px Arial';
            ctx.fillStyle = "white";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, x, yPos);
          }
        }
      });
    });
  },
};


const getStepIcon = (type,point) => {
  switch (type.toLowerCase()) {
    case 'unit':
      return '✅'; // Replace with an actual icon
    case 'badge':
      return point.icon; 
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

const AreaChartFullProgress = ({ completedUnits, badges }) => {
  let cumulativeScore = 0;
  const sortedUnits = completedUnits.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  const unitData = sortedUnits.map(unit => {
    cumulativeScore += unit.score;
    return {
      x: new Date(unit.completedAt),
      y: cumulativeScore,
      type: 'Unit',
      name: unit.unit_name || `ID ${unit.unit_id}`,
      click: () => {
        //alert(`Clicked on score: ${unit.unit_name || unit.unit_id}`)
      }

    };
  });

  const badgeData = badges.map(badge => ({
    x: new Date(badge.completedAt),
    y: cumulativeScore,
    type: 'Badge',
    icon: badge.img,
    name: badge.journeyName,
    click: () => {
      //alert(`Clicked on badge: ${badge.journeyName}`)  // Ensure this line is correctly defined
    }

  }));

  const combinedData = [...unitData, ...badgeData].sort((a, b) => a.x - b.x);
  // Calculate 5% padding for the x-axis
  const minTime = Math.min(...combinedData.map(d => d.x.getTime()));
  const maxTime = Math.max(...combinedData.map(d => d.x.getTime()));
  const timeSpan = maxTime - minTime;
  const padding = 0.05 * timeSpan;  // 5% of the total time span

  const chartData = {
    datasets: [
      {
        data: combinedData,
        borderWidth: 8,
        pointRadius: 56, // Set the radius for the transparent default points
        pointBackgroundColor: 'rgba(0, 0, 0, 0)', // Make default points transparent
        pointBorderColor: 'rgba(0, 0, 0, 0)', // Make default points transparent
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: -0.2,
      },
    ],
  };
  const options = {

    events: ['click'],
    onClick: function(e) {
      const points = this.getElementsAtEventForMode(e, 'nearest', { intersect: false }, true);
      if (points.length) {
        const firstPoint = points[0];
        const data = this.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        const {x, y} = firstPoint.element.getProps(['x', 'y']);
        const yScale = this.scales.y;
        const pixelPerUnit = yScale.getPixelForValue(yScale.max) - yScale.getPixelForValue(yScale.max - 1);
        const iconOffsetY = pixelPerUnit * 10;
        const {offsetX, offsetY} = e;
        const distanceY = Math.abs(offsetY - (y - iconOffsetY));
        const maxDistanceY = 50; // Maximum distance in the Y direction to detect clicks
  
        if (distanceY <= maxDistanceY && data.click) {
          data.click();
        }
      }
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'My Progress',
        color: 'white', // Set the title color to white
        font: {
          size: 24, // Increase the font size of the title
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context) => {
            return `${context[0].raw.type}:\n ${context[0].raw.name}`;
          },
          label: (context) => {
            const { y, journeyName,type } = context.raw;
            return [    
              `Score: ${y}`,
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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
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
          display: false,
          text: 'Date',
          color: 'white', // Set the x-axis title color to white
          font: {
            size: 18, // Increase the font size of the x-axis title
          },
        },
        type: 'linear', // Use linear scale for relative time
        min: new Date(minTime - padding),
        max: new Date(maxTime + padding),
        ticks: {
          display: false,
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
    <div >
      <Line options={options} data={chartData} plugins={[drawIconsPlugin]} />
    </div>
  );
};

export default AreaChartFullProgress;
