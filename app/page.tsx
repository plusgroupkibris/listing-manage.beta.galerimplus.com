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

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="add">Ekle</TabsTrigger>
          <TabsTrigger value="filter">Filtrele</TabsTrigger>
          <TabsTrigger value="list">İlanlar</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Add New Car Listing (Hızlı ekleme Test için sınırlı ozellikleri
                vardır)
              </CardTitle>
              <CardDescription>
                Fill in the details to add a new car to the inventory.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newListingTitle}
                  onChange={(e) => setNewListingTitle(e.target.value)}
                  placeholder="e.g., 2023 Honda Civic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newListingBrand}
                  onChange={(e) => setNewListingBrand(e.target.value)}
                  placeholder="e.g., Honda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newListingModel}
                  onChange={(e) => setNewListingModel(e.target.value)}
                  placeholder="e.g., Civic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newListingYear}
                  onChange={(e) =>
                    setNewListingYear(Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newListingPrice}
                  onChange={(e) =>
                    setNewListingPrice(Number.parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newListingCurrency}
                  onValueChange={setNewListingCurrency}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="TRY">TRY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileageValue">Mileage Value</Label>
                <Input
                  id="mileageValue"
                  type="number"
                  value={newListingMileageValue}
                  onChange={(e) =>
                    setNewListingMileageValue(Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileageUnit">Mileage Unit</Label>
                <Select
                  value={newListingMileageUnit}
                  onValueChange={setNewListingMileageUnit}
                >
                  <SelectTrigger id="mileageUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="mile">mile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={newListingFuelType}
                  onValueChange={setNewListingFuelType}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="LPG">LPG</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmissionType">Transmission</Label>
                <Select
                  value={newListingTransmissionType}
                  onValueChange={setNewListingTransmissionType}
                >
                  <SelectTrigger id="transmissionType">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Semi-Automatic">
                      Semi-Automatic
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={newListingVehicleType}
                  onValueChange={setNewListingVehicleType}
                >
                  <SelectTrigger id="vehicleType">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorName">Color Name</Label>
                <Input
                  id="colorName"
                  value={newListingColorName}
                  onChange={(e) => setNewListingColorName(e.target.value)}
                  placeholder="e.g., Black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorCode">Color Code</Label>
                <Input
                  id="colorCode"
                  value={newListingColorCode}
                  onChange={(e) => setNewListingColorCode(e.target.value)}
                  placeholder="e.g., #000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newListingCountry}
                  onChange={(e) => setNewListingCountry(e.target.value)}
                  placeholder="e.g., Turkey"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newListingCity}
                  onChange={(e) => setNewListingCity(e.target.value)}
                  placeholder="e.g., Istanbul"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={newListingDistrict}
                  onChange={(e) => setNewListingDistrict(e.target.value)}
                  placeholder="e.g., Kadıköy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerUid">Seller UID</Label>
                <Input
                  id="sellerUid"
                  value={newListingSellerUid}
                  onChange={(e) => setNewListingSellerUid(e.target.value)}
                  placeholder="e.g., seller123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerName">Seller Name</Label>
                <Input
                  id="sellerName"
                  value={newListingSellerName}
                  onChange={(e) => setNewListingSellerName(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerType">Seller Type</Label>
                <Select
                  value={newListingSellerType}
                  onValueChange={setNewListingSellerType}
                >
                  <SelectTrigger id="sellerType">
                    <SelectValue placeholder="Select seller type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddListing} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Add Listing
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="filter">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Filter Recent Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Label htmlFor="filterHours">Last</Label>
                <Input
                  id="filterHours"
                  type="number"
                  value={filterHours}
                  onChange={(e) =>
                    setFilterHours(Number.parseInt(e.target.value))
                  }
                  className="w-20"
                />
                <Label>hours</Label>
                <Button
                  onClick={() =>
                    console.log("Recent Listings:", recentListings)
                  }
                  variant="outline"
                  className="bg-black text-white"
                >
                  <Clock className="mr-2 h-4 w-4" /> Show
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter by Seller</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Label htmlFor="filterSeller">Seller UID</Label>
                <Input
                  id="filterSeller"
                  value={filterSellerUid}
                  onChange={(e) => setFilterSellerUid(e.target.value)}
                  placeholder="e.g., seller123"
                />
                <Button
                  onClick={() =>
                    console.log("Seller Listings:", sellerListings)
                  }
                  variant="outline"
                  className="bg-black text-white"
                >
                  <User className="mr-2 h-4 w-4" /> Show
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Listing No</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={async () =>
                    alert(`Generated: ${await generateListingNo()}`)
                  } // Await the async function
                  variant="outline"
                  className="bg-black text-white"
                >
                  Generate
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="list">
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
                          e.preventDefault(); // Link'in tıklanmasını engelle
                          startEditing(listing);
                        }}
                        size="sm"
                        variant="outline"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault(); // Link'in tıklanmasını engelle
                          deleteListing(listing.id);
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
