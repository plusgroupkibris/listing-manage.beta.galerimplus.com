// services/car-listing-service.ts
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getCountFromServer,
  Timestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import type { CarListing, ListingStatus } from "@/types";

const CAR_LISTINGS_COLLECTION = "car_listings";

/**
 * Firestore Timestamp objelerini CarListing'deki number tipine dönüştüren yardımcı fonksiyon.
 * @param data Firestore'dan gelen ham veri objesi.
 * @returns Dönüştürülmüş CarListing objesi.
 */
const convertTimestampsToNumbers = (data: any): CarListing => {
  const convertedData = { ...data };

  // Tarih alanlarını kontrol et ve dönüştür
  if (convertedData.listingDate instanceof Timestamp) {
    convertedData.listingDate = convertedData.listingDate.toMillis();
  }
  if (convertedData.publishDate instanceof Timestamp) {
    convertedData.publishDate = convertedData.publishDate.toMillis();
  }
  if (convertedData.expiryDate instanceof Timestamp) {
    convertedData.expiryDate = convertedData.expiryDate.toMillis();
  }

  // priceHistory içindeki tarihleri kontrol et ve dönüştür
  if (Array.isArray(convertedData.priceHistory)) {
    convertedData.priceHistory = convertedData.priceHistory.map((item: any) => {
      if (item.date instanceof Timestamp) {
        return { ...item, date: item.date.toMillis() };
      }
      return item;
    });
  }

  // remove objesi içindeki 'at' alanını kontrol et ve dönüştür
  if (convertedData.remove && convertedData.remove.at instanceof Timestamp) {
    convertedData.remove.at = convertedData.remove.at.toMillis();
  }

  return convertedData as CarListing;
};

/**
 * Fetches all car listings from Firestore.
 * @returns A promise that resolves to an array of CarListing objects.
 */
export const fetchAllCarListings = async (): Promise<CarListing[]> => {
  const listingsCol = collection(db, CAR_LISTINGS_COLLECTION);
  const listingSnapshot = await getDocs(listingsCol);
  const listingsList = listingSnapshot.docs.map((doc) =>
    convertTimestampsToNumbers({ id: doc.id, ...doc.data() })
  );
  return listingsList;
};

/**
 * Fetches car listings for a specific seller from Firestore.
 * @param userId The UID of the seller.
 * @returns A promise that resolves to an array of CarListing objects.
 */
export const fetchCarListingsBySeller = async (
  userId: string
): Promise<CarListing[]> => {
  const listingsCol = collection(db, CAR_LISTINGS_COLLECTION);
  const q = query(listingsCol, where("seller.uid", "==", userId));
  const listingSnapshot = await getDocs(q);
  const userListings = listingSnapshot.docs.map((doc) =>
    convertTimestampsToNumbers({ id: doc.id, ...doc.data() })
  );
  return userListings;
};

/**
 * Fetches a single car listing by its ID from Firestore.
 * @param id The ID of the listing to fetch.
 * @returns A promise that resolves to a CarListing object or null if not found.
 */
export const fetchCarListingById = async (
  id: string
): Promise<CarListing | null> => {
  const listingRef = doc(db, CAR_LISTINGS_COLLECTION, id);
  const listingSnap = await getDoc(listingRef);

  if (listingSnap.exists()) {
    return convertTimestampsToNumbers({
      id: listingSnap.id,
      ...listingSnap.data(),
    });
  } else {
    console.log("No such document!");
    return null;
  }
};

/**
 * Adds a new car listing to Firestore.
 * @param newListingData The data for the new car listing (excluding auto-generated fields).
 * @returns A promise that resolves to the newly added CarListing object.
 */
export const addCarListing = async (
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
  generatedListingNo: string
): Promise<CarListing> => {
  const now = Date.now(); // Use timestamp for dates

  const fullListing: Omit<CarListing, "id"> = {
    ...newListingData,
    listingNo: generatedListingNo,
    listingDate: now,
    publishDate: now,
    expiryDate: now + 30 * 24 * 60 * 60 * 1000, // Default 30 days from now
    viewCount: 0,
    favoriteCount: 0,
    status: "pending" as ListingStatus, // Default status for new listings
    priceHistory: [
      {
        date: now,
        amount: newListingData.price.amount,
        currency: newListingData.price.currency,
      },
    ],
    // 'remove' alanı burada açıkça undefined olarak ayarlanmıyor.
    // Eğer newListingData içinde 'remove' yoksa, Firestore'a gönderilen objede de olmayacak.
  };

  const listingRef = await addDoc(
    collection(db, CAR_LISTINGS_COLLECTION),
    fullListing
  );

  const listingId = listingRef.id;

  await setDoc(listingRef, {
    ...newListingData,
    id: listingId,
  });

  const addedListing: CarListing = {
    id: listingRef.id,
    ...fullListing,
  };

  return addedListing;
};

/**
 * Updates an existing car listing in Firestore.
 * @param id The ID of the listing to update.
 * @param updates The partial updates to apply to the listing.
 * @returns A promise that resolves when the update is complete.
 */
export const updateCarListing = async (
  id: string,
  updates: Partial<CarListing>
): Promise<void> => {
  const listingRef = doc(db, CAR_LISTINGS_COLLECTION, id);
  await updateDoc(listingRef, updates);
};

/**
 * Deletes a car listing from Firestore.
 * @param id The ID of the listing to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteCarListing = async (id: string): Promise<void> => {
  const listingRef = doc(db, CAR_LISTINGS_COLLECTION, id);
  await deleteDoc(listingRef);
};

/**
 * Generates a new sequential listing number based on the count of documents in the collection.
 * Falls back to a random number on error.
 * @returns A promise that resolves to a 10-digit listing number string.
 */
export const generateFirestoreListingNumber = async (): Promise<string> => {
  try {
    const coll = collection(db, CAR_LISTINGS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    const count = snapshot.data().count;

    const newListingNumber = count + 1;
    return newListingNumber.toString().padStart(10, "0");
  } catch (error) {
    console.error("İlan numarası oluşturulurken hata:", error);
    const randomNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    return randomNumber.toString().padStart(10, "0");
  }
};
