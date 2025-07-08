"use client";

import { useState, useEffect } from "react";
import {
  type CarListing,
  hasPriceChanged,
  hasPriceDecreased,
  hasPriceIncreased,
  getPriceChangePercentage,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  PlusCircle,
  Trash2,
  Edit,
  Clock,
  User,
  Car,
  DollarSign,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useCarListingsStore } from "@/store/use-car-listings-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CarListingsPage() {
  const {
    listings,
    isLoading,
    error,
    fetchListings,
    fetchUserListings,
    addListing,
    updateListing,
    deleteListing,
    getRecentListings,
    getListingsBySeller,
    getPaginatedListings,
    generateListingNo,
    filters, // Get filters from store
    searchQuery, // Get searchQuery from store
    setFilters, // Get setFilters action
    setSearchQuery, // Get setSearchQuery action
    getFilteredAndSearchedListings, // Get the new selector
  } = useCarListingsStore();

  const [newListingTitle, setNewListingTitle] = useState("");
  const [newListingBrand, setNewListingBrand] = useState("");
  const [newListingModel, setNewListingModel] = useState("");
  const [newListingYear, setNewListingYear] = useState(2023);
  const [newListingPrice, setNewListingPrice] = useState(0);
  const [newListingCurrency, setNewListingCurrency] = useState("USD");
  const [newListingFuelType, setNewListingFuelType] = useState("Gasoline");
  const [newListingTransmissionType, setNewListingTransmissionType] =
    useState("Automatic");
  const [newListingVehicleType, setNewListingVehicleType] = useState("Sedan");
  const [newListingColorName, setNewListingColorName] = useState("Black");
  const [newListingColorCode, setNewListingColorCode] = useState("#000000");
  const [newListingMileageValue, setNewListingMileageValue] = useState(0);
  const [newListingMileageUnit, setNewListingMileageUnit] = useState("km");
  const [newListingCountry, setNewListingCountry] = useState("Turkey");
  const [newListingCity, setNewListingCity] = useState("Istanbul");
  const [newListingDistrict, setNewListingDistrict] = useState("Kadıköy");
  const [newListingSellerUid, setNewListingSellerUid] = useState("seller123");
  const [newListingSellerName, setNewListingSellerName] = useState("John Doe");
  const [newListingSellerType, setNewListingSellerType] =
    useState("individual");

  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState(0);

  const [filterHours, setFilterHours] = useState(24);
  const [filterSellerUid, setFilterSellerUid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleAddListing = async () => {
    if (
      !newListingTitle ||
      !newListingBrand ||
      !newListingModel ||
      !newListingPrice
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const dummyImages = {
      Front: ["/placeholder.svg?height=200&width=300"],
      Rear: ["/placeholder.svg?height=200&width=300"],
      Side: ["/placeholder.svg?height=200&width=300"],
      Interior: ["/placeholder.svg?height=200&width=300"],
      Engine: ["/placeholder.svg?height=200&width=300"],
      Console: ["/placeholder.svg?height=200&width=300"],
      Other: ["/placeholder.svg?height=200&width=300"],
    };

    const newListing: Omit<
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
    > = {
      title: newListingTitle,
      brand: newListingBrand,
      model: newListingModel,
      year: newListingYear,
      price: { amount: newListingPrice, currency: newListingCurrency },
      originalPrice: { amount: newListingPrice, currency: newListingCurrency },
      mileage: { value: newListingMileageValue, unit: newListingMileageUnit },
      fuelType: newListingFuelType,
      transmissionType: newListingTransmissionType,
      vehicleType: newListingVehicleType,
      color: { name: newListingColorName, code: newListingColorCode },
      location: {
        country: newListingCountry,
        city: newListingCity,
        district: newListingDistrict,
      },
      seller: {
        uid: newListingSellerUid,
        name: newListingSellerName,
        type: newListingSellerType,
      },
      images: dummyImages,
      isPriceHidden: false,
      isNegotiable: true,
      // expiryDate ve remove alanları CarListing'in Omit kısmında olduğu için burada belirtmeye gerek yok.
      // Servis katmanı bunları otomatik olarak ekleyecek.
      imageUrl: "/placeholder.svg?height=200&width=300",
    };

    await addListing(newListing);

    setNewListingTitle("");
    setNewListingBrand("");
    setNewListingModel("");
    setNewListingYear(2023);
    setNewListingPrice(0);
    setNewListingMileageValue(0);
  };

  const handleUpdateListing = async (id: string) => {
    if (editingListingId) {
      await updateListing(id, {
        price: { amount: editPrice, currency: "USD" },
        title: editTitle,
      });
      setEditingListingId(null);
      setEditTitle("");
      setEditPrice(0);
    }
  };

  const startEditing = (listing: CarListing) => {
    setEditingListingId(listing.id);
    setEditTitle(listing.title);
    setEditPrice(listing.price.amount);
  };

  // Use the new selector for filtered/searched listings
  const displayedListings = getFilteredAndSearchedListings();
  const totalPages = Math.ceil(displayedListings.length / listingsPerPage);
  const paginatedListings = displayedListings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  const recentListings = getRecentListings(filterHours);
  const sellerListings = getListingsBySeller(filterSellerUid);

  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Car Listings Dashboard</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <>
    
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            All Car Listings ({displayedListings.length})
          </h2>
          <Button
            onClick={fetchListings}
            disabled={isLoading}
            variant="outline"
            className="bg-black text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Listings
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading listings...</span>
          </div>
        )}
        {!isLoading && displayedListings.length === 0 && (
          <p>No listings found matching your criteria.</p>
        )}

        <div className="grid gap-6">
          {paginatedListings.map((listing) => (
            <Card className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4">
              <img
                src={
                  listing.imageUrl ||
                  "/placeholder.svg?height=100&width=150&query=car-default"
                }
                alt={listing.title}
                width={150}
                height={100}
                className="rounded-md object-cover aspect-[3/2]"
              />
              <div className="flex-1 grid gap-1">
                {editingListingId === listing.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xl font-semibold"
                  />
                ) : (
                  <h3 className="text-xl font-semibold">{listing.title}</h3>
                )}
                <p className="text-sm text-muted-foreground">
                  {listing.brand} {listing.model} ({listing.year})
                </p>

                <p className="text-sm text-muted-foreground">
                 {listing.seller.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-4 w-4" /> {listing.mileage.value}{" "}
                  {listing.mileage.unit}
                  <DollarSign className="h-4 w-4" /> {listing.price.amount}{" "}
                  {listing.price.currency}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      listing.status === "active" ? "default" : "secondary"
                    }
                  >
                    {listing.status}
                  </Badge>
                  {hasPriceChanged(listing) && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Price Changed
                      {hasPriceDecreased(listing) && (
                        <span className="ml-1 text-green-600">
                          ({getPriceChangePercentage(listing).toFixed(2)}%)
                        </span>
                      )}
                      {hasPriceIncreased(listing) && (
                        <span className="ml-1 text-red-600">
                          ({getPriceChangePercentage(listing).toFixed(2)}%)
                        </span>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                {editingListingId === listing.id ? (
                  <>
                    <Input
                      type="number"
                      value={editPrice}
                      onChange={(e) =>
                        setEditPrice(Number.parseFloat(e.target.value))
                      }
                      className="w-24"
                    />
                    <Button
                      onClick={() => handleUpdateListing(listing.id)}
                      size="sm"
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingListingId(null)}
                      size="sm"
                      variant="outline"
                      className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => router.push(`/listings/${listing.id}`)}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={(e) => {
                       // startEditing(listing);
                        alert(`listing edit`);
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        //deleteListing(listing.id);
                        alert(`silme listeleme basladıgı için devredısıdır.`);
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            variant="outline"
            className="bg-black text-white"
          >
            Previous
          </Button>
          <span className="flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || isLoading}
            variant="outline"
            className="bg-black text-white"
          >
            Next
          </Button>
        </div>
      </>
    </div>
  );
}
