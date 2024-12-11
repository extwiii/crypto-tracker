import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartProps {
  historicalData: [number, number][]
}

const ChartComponent: React.FC<ChartProps> = ({ historicalData }) => {
  // Prepare chart data
  const chartData = {
    labels: historicalData.map((data) =>
      new Date(data[0]).toLocaleDateString()
    ), // Format timestamp to date
    datasets: [
      {
        label: 'Price (USD)',
        data: historicalData.map((data) => data[1]), // Extract the price value
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">
        Historical Price Chart (Last 30 Days)
      </h3>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default ChartComponent
