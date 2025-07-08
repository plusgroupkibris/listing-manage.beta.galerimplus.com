// lib/factories/car-listing.ts

import { v4 as uuidv4 } from "uuid"
import type { IAppUser, CarListing, ListingStatus } from "@/types"
import { getListingExpiryDateByUserType } from "@/lib/utils"

type CreateCarListingParams = {
  user?: IAppUser
  listingNumber?: string
  title?: string
  description?: string
  brand?: string
  model?: string
  submodel?: string
  year?: number
  engineVolume?: string
  enginePower?: string
  driveTrain?: string
  images?: CarListing["images"]
  imageUrl?: string
  status?: ListingStatus
  rejectionReason?: string
  selectedEquipmentFeatures?: CarListing["selectedEquipmentFeatures"]
  location?: {
    country: string
    city: string
    district: string
  }
  mileage?: {
    value: number
    unit: string
  }
  originalPrice?: {
    amount: number
    currency: string
  }
  price?: {
    amount: number
    currency: string
  }
  exchangePrice?: {
    amount: number
    currency: string
  }
  isPriceHidden?: boolean
  isNegotiable?: boolean
  isExchange?: boolean
  vehicleType?: string
  transmissionType?: string
  fuelType?: string
  color?: {
    code: string
    name: string
  }
  listingDate?: number
  publishDate?: number
  expiryDate?: number
  viewCount?: number
  favoriteCount?: number
  seller?: CarListing["seller"]
  remove?: CarListing["remove"]
}

export function createCarListingFromObject(params: CreateCarListingParams): CarListing {
  const now = Date.now()
  const defaultUser: IAppUser = {
    uid: "default-user-uid",
    name: "Default User",
    email: "default@example.com",
    userType: "individual",
  }
  const effectiveUser = params.user || defaultUser

  const defaultImages = {
    Front: ["/placeholder.svg?height=200&width=300"],
    Rear: ["/placeholder.svg?height=200&width=300"],
    Side: ["/placeholder.svg?height=200&width=300"],
    Interior: ["/placeholder.svg?height=200&width=300"],
    Engine: ["/placeholder.svg?height=200&width=300"],
    Console: ["/placeholder.svg?height=200&width=300"],
    Other: ["/placeholder.svg?height=200&width=300"],
  }

  const defaultPrice = { amount: 0, currency: "USD" }

  const newListing: CarListing = {
    id: uuidv4(),
    listingNo: params.listingNumber || `TEMP-${uuidv4().substring(0, 8).toUpperCase()}`, // Firestore'dan gelene kadar geçici
    title: params.title || "Untitled Car Listing",
    description: params.description || "A detailed description of the car.",
    brand: params.brand || "Unknown Brand",
    model: params.model || "Unknown Model",
    submodel: params.submodel,
    year: params.year || 2023,
    engineVolume: params.engineVolume,
    enginePower: params.enginePower,
    driveTrain: params.driveTrain,
    images: params.images || defaultImages,
    imageUrl: params.imageUrl || "/placeholder.svg?height=200&width=300",
    status: params.status || "pending",
    rejectionReason: params.rejectionReason,
    selectedEquipmentFeatures: params.selectedEquipmentFeatures || [],
    location: params.location || {
      country: "Turkey",
      city: "Istanbul",
      district: "Kadıköy",
    },
    mileage: params.mileage || { value: 0, unit: "km" },
    originalPrice: params.originalPrice || params.price || defaultPrice,
    price: params.price || defaultPrice,
    exchangePrice: params.exchangePrice,
    priceHistory: params.price
      ? [{ date: now, amount: params.price.amount, currency: params.price.currency }]
      : [{ date: now, amount: defaultPrice.amount, currency: defaultPrice.currency }],
    isPriceHidden: params.isPriceHidden ?? false,
    isNegotiable: params.isNegotiable ?? true,
    isExchange: params.isExchange,
    vehicleType: params.vehicleType || "Sedan",
    transmissionType: params.transmissionType || "Automatic",
    fuelType: params.fuelType || "Gasoline",
    color: params.color || { code: "#000000", name: "Black" },
    listingDate: params.listingDate || now,
    publishDate: params.publishDate || now,
    expiryDate: params.expiryDate || getListingExpiryDateByUserType(effectiveUser),
    viewCount: params.viewCount ?? 0,
    favoriteCount: params.favoriteCount ?? 0,
    seller: params.seller || {
      uid: effectiveUser.uid,
      name: effectiveUser.name,
      type: effectiveUser.userType === "corporate" ? "corporate" : "individual",
      phone: "555-123-4567",
      location: `${effectiveUser.userType === "corporate" ? "Corporate Office" : "Individual Residence"}`,
      memberSince: new Date(now).toISOString(),
      verifiedSeller: true,
      badges: ["New Member"],
      contactPreferences: {
        allowDirectPhone: true,
        allowPhoneMessaging: true,
        allowWebsiteMessaging: true,
      },
    },
    remove: params.remove,
  }

  return newListing
}
