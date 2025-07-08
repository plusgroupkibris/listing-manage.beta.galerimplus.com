import { IAppUser } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



/**
 * Belirli bir kullanıcı tipine göre ilan bitiş tarihini hesaplar.
 * Bu sadece bir örnek uygulamadır, gerçek bir senaryoda daha karmaşık kurallar olabilir.
 * @param user IAppUser objesi
 * @returns İlanın bitiş tarihi (Unix timestamp)
 */
export function getListingExpiryDateByUserType(user?: IAppUser): number {
  const now = Date.now()
  let daysToAdd = 30 // Varsayılan 30 gün

  if (user) {
    switch (user.userType) {
      case "corporate":
        daysToAdd = 60 // Kurumsal kullanıcılar için 60 gün
        break
      case "admin":
        daysToAdd = 90 // Adminler için 90 gün
        break
      case "individual":
      default:
        daysToAdd = 30 // Bireysel kullanıcılar için 30 gün
        break
    }
  }

  return now + daysToAdd * 24 * 60 * 60 * 1000
}

export function hasPriceChanged(listing: CarListing): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  return firstPrice.amount !== lastPrice.amount
}

export function hasPriceDecreased(listing: CarListing): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  return lastPrice.amount < firstPrice.amount
}

export function hasPriceIncreased(listing: CarListing): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  return lastPrice.amount > firstPrice.amount
}

export function getPriceChangePercentage(listing: CarListing): number {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return 0
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  if (firstPrice.amount === 0) return 0

  return ((lastPrice.amount - firstPrice.amount) / firstPrice.amount) * 100
}

export function isActiveListing(listing: CarListing): boolean {
  return listing.status === "active"
}

export function isPendingListing(listing: CarListing): boolean {
  return listing.status === "pending"
}

export function isSoldListing(listing: CarListing): boolean {
  return listing.status === "sold"
}

export function isExpiredListing(listing: CarListing): boolean {
  return listing.status === "expired"
}

export function isRejectedListing(listing: CarListing): boolean {
  return listing.status === "rejected"
}

export function isInactiveListing(listing: CarListing): boolean {
  return listing.status === "inactive"
}

export function isRemovedListing(listing: CarListing): boolean {
  return listing.status === "removed"
}
