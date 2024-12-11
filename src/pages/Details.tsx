import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChartComponent from '../components/ChartComponent'
import axios from 'axios'

const Details: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cryptoData, setCryptoData] = useState<any | null>(null)
  const [historicalData, setHistoricalData] = useState<[number, number][]>([])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        // Fetch cryptocurrency details using axios
        const cryptoResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            params: {
              x_cg_demo_api_key: process.env.REACT_APP_API_KEY || '',
            },
          }
        )
        setCryptoData(cryptoResponse.data)

        // Fetch historical data (prices for the last 30 days) using axios
        const historicalResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: 30,
              x_cg_demo_api_key: process.env.REACT_APP_API_KEY || '',
            },
          }
        )
        setHistoricalData(historicalResponse.data.prices) // Array of [timestamp, price]
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id])

  if (!cryptoData) return <div>Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 mb-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
      >
        Back to Portfolio
      </button>
      <h2 className="text-3xl font-semibold text-center mb-6">
        {cryptoData.name}
      </h2>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          Symbol: {cryptoData?.symbol?.toUpperCase()}
        </h3>
        <p className="text-lg">
          Current Price: ${cryptoData.market_data.current_price.usd}
        </p>
        <p className="text-lg">
          Market Cap: ${cryptoData.market_data.market_cap.usd}
        </p>
        <p className="text-lg">
          24h Change:{' '}
          {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>

      <ChartComponent historicalData={historicalData} />
    </div>
  )
}

export default Details
