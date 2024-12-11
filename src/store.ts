import { create } from 'zustand'

export interface Holding {
  id: string
  name: string
  symbol: string
  quantity: number
  currentPrice: number
  totalValue: number
}

interface PortfolioState {
  holdings: Holding[]
  addHolding: (holding: Holding) => void
  removeHolding: (symbol: string) => void
  updateHolding: (updatedHolding: Holding) => void
  setHoldings: (holdings: Holding[]) => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: [],

  // Initialize the portfolio from localStorage when the app starts
  setHoldings: (holdings: Holding[]) => {
    set({ holdings })
    localStorage.setItem('portfolio', JSON.stringify(holdings)) // Save to localStorage
  },

  // Add a new holding and persist the change
  addHolding: (holding: Holding) => {
    set((state) => {
      const updatedHoldings = [...state.holdings, holding]
      localStorage.setItem('portfolio', JSON.stringify(updatedHoldings)) // Save to localStorage
      return { holdings: updatedHoldings }
    })
  },

  // Remove a holding by symbol and persist the change
  removeHolding: (symbol: string) => {
    set((state) => {
      const updatedHoldings = state.holdings.filter(
        (holding) => holding.symbol !== symbol
      )
      localStorage.setItem('portfolio', JSON.stringify(updatedHoldings)) // Save to localStorage
      return { holdings: updatedHoldings }
    })
  },

  // Update an existing holding and persist the change
  updateHolding: (updatedHolding: Holding) => {
    set((state) => {
      const updatedHoldings = state.holdings.map((holding) =>
        holding.symbol === updatedHolding.symbol ? updatedHolding : holding
      )
      localStorage.setItem('portfolio', JSON.stringify(updatedHoldings)) // Save to localStorage
      return { holdings: updatedHoldings }
    })
  },
}))
