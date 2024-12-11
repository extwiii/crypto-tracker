import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { usePortfolioStore } from '../store'

ChartJS.register(ArcElement, Tooltip, Legend)

const DonutChart: React.FC = () => {
  const { holdings } = usePortfolioStore()

  // Data preparation for the chart
  const labels = holdings.map((holding) => holding.name)
  const dataValues = holdings.map((holding) => holding.totalValue)

  const data = {
    labels,
    datasets: [
      {
        label: 'Portfolio Distribution',
        data: dataValues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `$${tooltipItem.raw.toFixed(2)}`
          },
        },
      },
    },
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">
        Portfolio Breakdown
      </h2>
      {holdings.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : (
        <p className="text-center text-gray-500">
          No holdings available to display.
        </p>
      )}
    </div>
  )
}

export default DonutChart
