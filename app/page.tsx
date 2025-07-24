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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
    updateListing,
    deleteListing,
    getFilteredAndSearchedListings, // Get the new selector
  } = useCarListingsStore();

  const [confirmationCode, setConfirmationCode] = useState("");


  const isConfirmed = confirmationCode === "GP2025.,";

  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);



  const [filter, setFilter] = useState("");

  const filteredListings = listings.filter((listing) =>
    listing.listingNo.toLowerCase().includes(filter.toLowerCase().trim())
  );

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


const handleDelete = async (listingId: string) => {
  await deleteListing(listingId);
  router.push("/"); 
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

  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Car Listings Dashboard</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
        <input
          type="text"
          placeholder="İlan numarasına göre ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <li
                key={listing.id}
                className="py-2 px-3 hover:bg-blue-50 cursor-pointer rounded"
                onClick={() => router.push(`/listings/${listing.id}`)}
              >
                <span className="font-semibold text-gray-800">
                  {listing.listingNo}
                </span>{" "}
                - <span className="text-gray-600">{listing.title}</span>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400 py-4">Sonuç bulunamadı</li>
          )}
        </ul>
      </div>

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

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Silme işlemini onayla
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu işlem geri alınamaz, lütfen dikkatli olun. Silme
                            işlemini onaylamak için geliştiricinin size ilettiği
                            silme kodunu girin.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <Input
                          value={confirmationCode}
                          onChange={(e) => setConfirmationCode(e.target.value)}
                          placeholder="Kod girin"
                        />

                        <AlertDialogFooter>
                          <AlertDialogAction
                            disabled={!isConfirmed}
                            onClick={() => handleDelete(listing.id)}
                          >
                            Evet, sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
