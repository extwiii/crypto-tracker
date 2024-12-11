import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Input from '../components/Input'
import { usePortfolioStore } from '../store'

interface SearchResult {
  id: string
  name: string
  symbol: string
}

const Add: React.FC = () => {
  const { addHolding } = usePortfolioStore()
  const [symbol, setSymbol] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(0)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const navigate = useNavigate()

  // Function to handle search by symbol or name
  const handleSearch = async (input: string) => {
    setSymbol(input)

    if (input.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      const searchResponse = await axios.get(
        `https://api.coingecko.com/api/v3/search`,
        {
          params: {
            query: input,
            x_cg_demo_api_key: process.env.REACT_APP_API_KEY || '',
          },
        }
      )

      const results = searchResponse.data.coins.slice(0, 10)
      setSearchResults(results)
    } catch (error) {
      console.error('Error fetching data from CoinGecko', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Function to handle coin selection
  const handleSelect = async (coin: SearchResult) => {
    setName(coin.name)
    setSymbol(coin.symbol.toUpperCase())
    setId(coin.id)

    try {
      const marketResponse = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            ids: coin.id,
            x_cg_demo_api_key: process.env.REACT_APP_API_KEY || '',
          },
        }
      )

      const selectedCoin = marketResponse.data[0]
      setCurrentPrice(selectedCoin.current_price)
      setSearchResults([])
    } catch (error) {
      console.error('Error fetching market data from CoinGecko', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !symbol || !currentPrice || quantity <= 0) {
      alert('Please complete all fields')
      return
    }

    // Create a new holding object
    const newHolding = {
      id,
      name,
      symbol,
      quantity,
      currentPrice,
      totalValue: quantity * currentPrice,
    }

    addHolding(newHolding) // Update Zustand store
    navigate('/')
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Add New Holding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="symbol-input"
            label="Cryptocurrency Symbol"
            type="text"
            value={symbol}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter cryptocurrency symbol (e.g., BTC, ETH)"
          />
          {isSearching && <p className="text-gray-500 mt-2">Searching...</p>}

          {searchResults.length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-md rounded-md">
              {searchResults.map((coin: SearchResult) => (
                <div
                  key={coin.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelect(coin)}
                >
                  <p>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          id="price-input"
          label="Current Price (USD)"
          type="number"
          value={currentPrice ?? 0}
          placeholder="Select Symbol to populate"
          disabled
          readOnly
        />

        <Input
          id="quantity-input"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          placeholder="Enter quantity"
          required
          min="0"
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Holding
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
