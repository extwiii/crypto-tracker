import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '../components/Input'
import { usePortfolioStore } from '../store'
import axios from 'axios'

const Edit: React.FC = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { updateHolding } = usePortfolioStore()

  const [quantity, setQuantity] = useState<number>(
    state?.holding?.quantity || 0
  )
  const [currentPrice, setCurrentPrice] = useState<number>(
    state?.holding?.currentPrice || 0
  )
  const [totalValue, setTotalValue] = useState<number>(
    state?.holding?.totalValue || 0
  )

  useEffect(() => {
    const fetchCurrentPrice = async (id: string) => {
      try {
        // Use axios to make a GET request
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
          {
            params: {
              x_cg_demo_api_key: process.env.REACT_APP_API_KEY || '', // Pass the API key as a header if needed
            },
          }
        )

        // Access the price from the response data
        const price = res.data[id]?.usd || 0
        setCurrentPrice(price)
      } catch (error) {
        console.error('Error fetching price:', error)
        setCurrentPrice(0) // Set to 0 in case of an error
      }
    }

    fetchCurrentPrice(state?.holding.id)
  }, [])

  useEffect(() => {
    setTotalValue(quantity * currentPrice)
  }, [quantity, currentPrice])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPrice || quantity <= 0) {
      alert('Please complete all fields')
      return
    }

    const updatedHolding = {
      ...state?.holding,
      quantity,
      totalValue,
    }

    updateHolding(updatedHolding)
    navigate('/')
  }

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Edit Holding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="symbol-input"
          label="Symbol"
          type="text"
          value={state?.holding?.symbol}
          disabled
          readOnly
        />

        <Input
          id="quantity-input"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = parseFloat(e.target.value)
            if (value >= 0 || e.target.value === '') {
              setQuantity(value)
            }
          }}
        />

        <Input
          id="price-input"
          label="Current Price (USD)"
          type="number"
          value={currentPrice}
          disabled
          readOnly
        />

        <Input
          id="total-input"
          label="Total Value (USD)"
          type="number"
          value={totalValue}
          disabled
          readOnly
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit
