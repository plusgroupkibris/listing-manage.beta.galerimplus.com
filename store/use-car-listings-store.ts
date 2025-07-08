// store/use-car-listings-store.ts
import { create } from "zustand"
import {
  fetchAllCarListings,
  fetchCarListingsBySeller,
  addCarListing,
  updateCarListing,
  deleteCarListing,
  generateFirestoreListingNumber,
  fetchCarListingById, // Yeni servis fonksiyonunu import et
} from "@/services/car-listing-service"
import type { CarListing } from "@/types"

interface CarListingStore {
  listings: CarListing[]
  currentListing: CarListing | null // Detay sayfası için yeni state
  isLoading: boolean
  error: string | null
  filters: {
    brand: string
    fuelType: string
    transmissionType: string
    minYear: number | null
    maxYear: number | null
  }
  searchQuery: string
  fetchListings: () => Promise<void>
  fetchUserListings: (userId: string) => Promise<void>
  fetchListingDetail: (id: string) => Promise<void> // Yeni action
  addListing: (
    newListingData: Omit<
      CarListing,
      | "id"
      | "listingNo"
      | "listingDate"
      | "publishDate"
      | "viewCount"
      | "favoriteCount"
      | "status"
      | "expiryDate"
      | "remove"
    >,
  ) => Promise<CarListing | null>
  updateListing: (id: string, updates: Partial<CarListing>) => Promise<void>
  deleteListing: (id: string) => Promise<void>
  getListingById: (id: string) => CarListing | undefined
  getRecentListings: (hours: number) => CarListing[]
  getListingsBySeller: (sellerUid: string) => CarListing[]
  getPaginatedListings: (page: number, limit: number) => CarListing[]
  generateListingNo: () => Promise<string>
  setFilters: (newFilters: Partial<CarListingStore["filters"]>) => void
  setSearchQuery: (query: string) => void
  getFilteredAndSearchedListings: () => CarListing[] // New selector
}

export const useCarListingsStore = create<CarListingStore>((set, get) => ({
  listings: [],
  currentListing: null, // Başlangıçta null
  isLoading: false,
  error: null,
  filters: {
    brand: "all",
    fuelType: "all",
    transmissionType: "all",
    minYear: null,
    maxYear: null,
  },
  searchQuery: "",

  generateListingNo: async () => {
    return await generateFirestoreListingNumber()
  },

  fetchListings: async () => {
    set({ isLoading: true, error: null })
    try {
      const listingsList = await fetchAllCarListings()
      set({ listings: listingsList, isLoading: false })
    } catch (e: any) {
      console.error("Error fetching listings: ", e)
      set({ error: e.message, isLoading: false })
    }
  },

  fetchUserListings: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const userListings = await fetchCarListingsBySeller(userId)
      set({ listings: userListings, isLoading: false })
    } catch (e: any) {
      console.error("Error fetching user listings: ", e)
      set({ error: e.message, isLoading: false })
    }
  },

  fetchListingDetail: async (id: string) => {
    set({ isLoading: true, error: null, currentListing: null }) // Yeni ilanı çekerken mevcut ilanı sıfırla
    try {
      const listing = await fetchCarListingById(id)
      set({ currentListing: listing, isLoading: false })
    } catch (e: any) {
      console.error("Error fetching listing detail: ", e)
      set({ error: e.message, isLoading: false })
    }
  },

  addListing: async (newListingData) => {
    set({ isLoading: true, error: null })
    try {
      const generatedListingNo = await get().generateListingNo()
      const addedListing = await addCarListing(newListingData, generatedListingNo)

      set((state) => ({
        listings: [...state.listings, addedListing],
        isLoading: false,
      }))
      return addedListing
    } catch (e: any) {
      console.error("Error adding listing: ", e)
      set({ error: e.message, isLoading: false })
      return null
    }
  },

  updateListing: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      await updateCarListing(id, updates)

      set((state) => ({
        listings: state.listings.map((listing) => (listing.id === id ? { ...listing, ...updates } : listing)),
        isLoading: false,
      }))
    } catch (e: any) {
      console.error("Error updating listing: ", e)
      set({ error: e.message, isLoading: false })
    }
  },

  deleteListing: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await deleteCarListing(id)

      set((state) => ({
        listings: state.listings.filter((listing) => listing.id !== id),
        isLoading: false,
      }))
    } catch (e: any) {
      console.error("Error deleting listing: ", e)
      set({ error: e.message, isLoading: false })
    }
  },

  getListingById: (id: string) => {
    return get().listings.find((listing) => listing.id === id)
  },

  getRecentListings: (hours: number) => {
    const now = Date.now()
    const threshold = now - hours * 60 * 60 * 1000
    return get().listings.filter((listing) => {
      // publishDate is now a number (timestamp)
      return listing.publishDate >= threshold
    })
  },

  getListingsBySeller: (sellerUid: string) => {
    return get().listings.filter((listing) => listing.seller.uid === sellerUid)
  },

  getPaginatedListings: (page: number, limit: number) => {
    const filteredListings = get().getFilteredAndSearchedListings()
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return filteredListings.slice(startIndex, endIndex)
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  getFilteredAndSearchedListings: () => {
    const { listings, filters, searchQuery } = get()
    let filtered = listings

    // Apply search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(lowerCaseQuery) ||
          listing.brand.toLowerCase().includes(lowerCaseQuery) ||
          listing.model.toLowerCase().includes(lowerCaseQuery),
      )
    }

    // Apply filters
    if (filters.brand !== "all") {
      filtered = filtered.filter((listing) => listing.brand === filters.brand)
    }
    if (filters.fuelType !== "all") {
      filtered = filtered.filter((listing) => listing.fuelType === filters.fuelType)
    }
    if (filters.transmissionType !== "all") {
      filtered = filtered.filter((listing) => listing.transmissionType === filters.transmissionType)
    }
    if (filters.minYear !== null) {
      filtered = filtered.filter((listing) => listing.year >= filters.minYear!)
    }
    if (filters.maxYear !== null) {
      filtered = filtered.filter((listing) => listing.year <= filters.maxYear!)
    }

    return filtered
  },
}))
