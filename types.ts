// types.ts
export interface SelectedFeature {
  featureId: string // "abs", "ebd", "hiz-sabitleyici" gibi
  groupId: string // "guvenlik", "konfor" gibi
}

export type ListingStatus = "active" | "inactive" | "pending" | "sold" | "expired" | "rejected" | "removed"

interface ListingRemoveInfo {
  byUid: string // Kaldıran kişi uid
  byRole: "user" | "admin"
  reason: "sold" | "user-deactivated" | "violates-rules" | "other"
  note?: string // Kullanıcının veya adminin yorumu
  feedback?: string // İsteğe bağlı sistem geri bildirimi
  at: number // UTC ISO date string
}

// user'lara favori alırken tarihi de alıcaz boyllece tarihine göre geçmişi vericez unutmadan not alalım.

export interface CarListing {
  id: string // benzrsiz uuid
  listingNo: string // İlan numarası

  title: string // İlan başlığı
  description?: string // İlan açıklaması
  brand: string // Araç markası
  model: string // Araç modeli
  submodel?: string // Araç alt modeli
  year: number // Araç üretim yılı

  engineVolume?: string // Motor hacmi
  enginePower?: string // Motor gücü
  driveTrain?: string // Tahrik sistemi (4x4, 4x2, vb.)

  images: {
    Front: string[] // Ön görüntü
    Rear: string[] // Arka görüntü
    Side: string[] // Yan görüntü
    Interior: string[] // İç mekan görüntüsü
    Engine: string[] // Motor görüntüsü
    Console: string[] // Konsol görüntüsü
    Other: string[] // Diğer görüntüler
  }
  imageUrl?: string // Ana görsel URL'si

  status: ListingStatus // İlan durumu
  rejectionReason?: string // İlanın reddedilme nedeni

  selectedEquipmentFeatures?: SelectedFeature[]

  location: {
    country: string // Ülke
    city: string // Şehir
    district: string // İlçe
  }

  mileage: {
    value: number // Araç kilometresi
    unit: string // Araç kilometre birimi (km, mile)
  }

  originalPrice: {
    amount: number // Araç orijinal fiyatı
    currency: string // Araç orijinal fiyat para birimi
  }

  price: {
    amount: number // Araç güncel fiyatı
    currency: string // Araç güncel fiyat para birimi
  }

  exchangePrice?: {
    amount: number
    currency: string
  }

  priceHistory?: {
    date: number // Fiyat değişikliği tarihi
    amount: number // Fiyat değişikliği miktarı
    currency: string // Fiyat değişikliği para birimi
  }[]

  isPriceHidden: boolean // Fiyat gizli mi?
  isNegotiable: boolean // Fiyat pazarlık payı var mı?
  isExchange?: boolean // Takas ilanı mı?

  vehicleType: string // Araç tipi (otomobil, SUV, kamyonet, vb.)
  transmissionType: string // Şanzıman tipi (manuel, otomatik, yarı otomatik)
  fuelType: string // Yakıt tipi (benzin, dizel, LPG, elektrikli)

  color: {
    code: string // Araç rengi (hex kodu)
    name: string // Araç rengi (örneğin: "Kırmızı", "Mavi")
  }

  listingDate: number // İlan tarihi (Unix timestamp)
  publishDate: number // Yayın tarihi (Unix timestamp)
  expiryDate: number // İlanın son tarihi (Unix timestamp)

  viewCount: number // Görüntülenme sayısı
  favoriteCount: number // Favori sayısı

  seller: {
    uid: string // Satıcının benzersiz kimliği
    name: string // Satıcının adı
    type: string // Satıcı tipi (bireysel, kurumsal)
    phone?: string // Satıcının telefon numarası
    location?: string // Satıcının konumu
    memberSince?: string // Satıcının üye olduğu tarih
    verifiedSeller?: boolean // Satıcının doğrulanmış olup olmadığı
    badges?: string[] // Satıcının rozetleri (örneğin: "Yeni Üye", "Doğrulanmış")
    contactPreferences?: {
      allowDirectPhone: boolean // Doğrudan telefonla iletişim izni
      allowPhoneMessaging: boolean // Telefon mesajı ile iletişim izni
      allowWebsiteMessaging: boolean // Web sitesi mesajı ile iletişim izni
    }
  }

  remove?: ListingRemoveInfo // İlan kaldırma bilgisi
}


// Add IAppUser interface
export interface IAppUser {
  uid: string
  name: string
  email: string
  userType: "individual" | "corporate" | "admin"
  // Diğer kullanıcı özellikleri buraya eklenebilir
}


// Fiyat değişikliği kontrolü için yardımcı fonksiyonlar
export function hasPriceChanged(listing: CarListing): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  return firstPrice.amount !== lastPrice.amount
}

// Fiyat düşüşü kontrolü için yardımcı fonksiyon
export function hasPriceDecreased(listing: CarListing): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  return lastPrice.amount < firstPrice.amount
}

// Fiyat artışı kontrolü için yardımcı fonksiyon
export function hasPriceIncreased(listing: CarListing): boolean {
  if (!listing.priceHistory || listing.priceHistory.length <= 1) {
    return false
  }

  const firstPrice = listing.priceHistory[0]
  const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]

  return lastPrice.amount > firstPrice.amount
}

// Fiyat değişim yüzdesi hesaplama
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
