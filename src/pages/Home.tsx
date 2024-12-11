import React, { useEffect, useState } from 'react'
import { usePortfolioStore, Holding } from '../store'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'

import DonutChart from '../components/DonutChart'
import axios from 'axios'

const Home: React.FC = () => {
  const { holdings, setHoldings, removeHolding, updateHolding } =
    usePortfolioStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<string>('')
  const [sortOption, setSortOption] = useState<string>('')

  const fetchCurrentPrice = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            ids: id,
            x_cg_demo_api_key: process.env.REACT_APP_API_KEY || '', // Add the API key as a header if needed
            t: new Date().getTime(), // Adds a timestamp to avoid cache
          },
        }
      )
      return response.data[0]?.current_price || 0 // Return the USD value for the requested id
    } catch (error) {
      console.error('Error fetching price:', error)
      return 0 // Default to 0 if there is an error
    }
  }

  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio')
    let handleVisibilityChange: any
    if (savedPortfolio) {
      setHoldings(JSON.parse(savedPortfolio)) // Load saved portfolio from localStorage
      const updatePrices = async () => {
        for (const holding of JSON.parse(savedPortfolio)) {
          const price = await fetchCurrentPrice(holding.id)
          if (price) {
            updateHolding({ ...holding, currentPrice: price })
          }
        }
      }

      handleVisibilityChange = () => {
        if (!document.hidden) {
          updatePrices() // Fetch prices when the tab gains focus
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Filter holdings based on search
  const filteredHoldings = holdings.filter((holding) =>
    holding.name.toLowerCase().includes(filter.toLowerCase())
  )

  // Sort holdings based on selected criteria
  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name)
    }
    if (sortOption === 'value') {
      return b.totalValue - a.totalValue
    }
    return 0 // No sorting
  })

  const handleDelete = (symbol: string) => {
    removeHolding(symbol) // Remove the holding from the store
  }

  const handleEdit = (holding: Holding) => {
    navigate('/edit', { state: { holding } }) // Navigate to Edit Holding page with current holding data
  }

  const handleSeeDetails = (id: string) => {
    // Redirect to the details screen with the holding's symbol
    navigate(`/details/${id}`)
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Crypto Portfolio
          </h1>
          <button
            onClick={() => navigate('/add')}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add New Holding
          </button>
        </div>

        {/* If portfolio is empty */}
        {holdings.length === 0 ? (
          <p className="text-center text-gray-500">Your portfolio is empty.</p>
        ) : (
          <div>
            {/* Filter and Sort Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              {/* Filter Input */}
              <Input
                id="search-input"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name..."
              />

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-3 border rounded-lg shadow-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-100 transition-all duration-200 ease-in-out"
                aria-label="Sort holdings"
              >
                <option value="" disabled>
                  Sort By
                </option>
                <option value="name">Name</option>
                <option value="value">Total Value</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHoldings.map((holding: Holding) => (
                <div
                  key={holding.symbol}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-101"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {holding.name}
                  </h2>
                  <p className="text-lg text-gray-500">
                    {holding.symbol.toUpperCase()}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Quantity</span>
                      <span>{holding.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Current Price</span>
                      <span>${holding.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Total Value</span>
                      <span>${holding.totalValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-around mt-6 space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(holding)}
                      className="p-3 text-yellow-600 hover:text-yellow-800 focus:outline-none transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-pencil-alt text-xl"></i>
                    </button>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleSeeDetails(holding.id)}
                      className="p-3 text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                      title="View Details"
                    >
                      <i className="fas fa-info-circle text-xl"></i>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(holding.symbol)}
                      className="p-3 text-red-600 hover:text-red-800 focus:outline-none transition-colors"
                      title="Delete"
                    >
                      <i className="fas fa-trash text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-10">
              <DonutChart />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
