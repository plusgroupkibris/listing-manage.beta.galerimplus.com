"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCarListingsStore } from "@/store/use-car-listings-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Car,
  Calendar,
  MapPin,
  Gauge,
  Fuel,
  GitPullRequestArrow,
  Palette,
  User,
  Phone,
} from "lucide-react";
import {
  hasPriceChanged,
  hasPriceDecreased,
  hasPriceIncreased,
  getPriceChangePercentage,
} from "@/types";
import ImageTabs from "./components/image-tabs";
import FeatureBadges from "./components/feature-badges";
import { equipmentGroups } from "@/constants/equipmentGroups";

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;

  // fetchListingDetail'ın doğru şekilde destructure edildiğinden emin olun
  const { currentListing, isLoading, error, fetchListingDetail } =
    useCarListingsStore();

  // Hata ayıklama için: fetchListingDetail'ın değerini konsola yazdırın
  // console.log("fetchListingDetail:", fetchListingDetail);

  useEffect(() => {
    if (listingId) {
      // fetchListingDetail'ın bir fonksiyon olduğundan emin olun
      if (typeof fetchListingDetail === "function") {
        fetchListingDetail(listingId);
      } else {
        console.error(
          "fetchListingDetail is not a function (inside useEffect check)"
        );
      }
    }
  }, [listingId, fetchListingDetail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading listing details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  if (!currentListing) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-lg text-muted-foreground">Listing not found.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  const formatTimestampToDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFeature = (featureId: string) => {
    return featureId
      .replace(/-/g, " ") // tireleri boşluk yap
      .replace(/\b\w/g, (l) => l.toUpperCase()); // baş harfleri büyük yap
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
        </Link>

        <h1 className="text-xl sm:text-3xl font-bold text-center sm:text-left">
          {currentListing.title}
        </h1>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <img
              src={
                currentListing.imageUrl ||
                "/placeholder.svg?height=400&width=600&query=car-detail"
              }
              alt={currentListing.title}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full max-h-[400px]"
            />
            <ImageTabs images={currentListing.images} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  currentListing.status === "active" ? "default" : "secondary"
                }
              >
                {currentListing.status.toUpperCase()}
              </Badge>
              {hasPriceChanged(currentListing) && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Price Changed
                  {hasPriceDecreased(currentListing) && (
                    <span className="ml-1 text-green-600">
                      ({getPriceChangePercentage(currentListing).toFixed(2)}%)
                    </span>
                  )}
                  {hasPriceIncreased(currentListing) && (
                    <span className="ml-1 text-red-600">
                      ({getPriceChangePercentage(currentListing).toFixed(2)}%)
                    </span>
                  )}
                </Badge>
              )}
            </div>

            <h2 className="text-4xl font-extrabold text-gray-900">
              {currentListing.price.amount} {currentListing.price.currency}
              {currentListing.isNegotiable && (
                <span className="text-lg text-gray-500 ml-2">(Negotiable)</span>
              )}
            </h2>
            <p className="text-lg text-gray-700">
              {currentListing.description || "No description provided."}
            </p>

            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span>
                  Brand:{" "}
                  <span className="font-medium">{currentListing.brand}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span>
                  Model:{" "}
                  <span className="font-medium">{currentListing.model}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>
                  Year:{" "}
                  <span className="font-medium">{currentListing.year}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <span>
                  Mileage:{" "}
                  <span className="font-medium">
                    {currentListing.mileage.value} {currentListing.mileage.unit}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-primary" />
                <span>
                  Fuel Type:{" "}
                  <span className="font-medium">{currentListing.fuelType}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitPullRequestArrow className="h-5 w-5 text-primary" />
                <span>
                  Transmission:{" "}
                  <span className="font-medium">
                    {currentListing.transmissionType}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <span>
                  Color:{" "}
                  <span className="font-medium">
                    {currentListing?.color?.name}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>
                  Location:{" "}
                  <span className="font-medium">
                    {currentListing.location.city},{" "}
                    {currentListing.location.district}
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Seller Information</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5 text-primary" />
                <span>
                  Name:{" "}
                  <span className="font-medium">
                    {currentListing.seller.name} ({currentListing.seller.type})
                  </span>
                </span>
              </div>
              {currentListing.seller.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>
                    Phone:{" "}
                    <span className="font-medium">
                      {currentListing.seller.phone}
                    </span>
                  </span>
                </div>
              )}
              {currentListing.seller.memberSince && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>
                    Member Since:{" "}
                    <span className="font-medium">
                      {new Date(
                        currentListing.seller.memberSince
                      ).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              )}
              {currentListing.seller.verifiedSeller && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Verified Seller
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Listing Details</h3>
              <p className="text-gray-600">
                Listing No:{" "}
                <span className="font-medium">{currentListing.listingNo}</span>
              </p>
              <p className="text-gray-600">
                Listed On:{" "}
                <span className="font-medium">
                  {formatTimestampToDate(currentListing.listingDate)}
                </span>
              </p>
              <p className="text-gray-600">
                Published On:{" "}
                <span className="font-medium">
                  {formatTimestampToDate(currentListing.publishDate)}
                </span>
              </p>
              <p className="text-gray-600">
                Expires On:{" "}
                <span className="font-medium">
                  {formatTimestampToDate(currentListing.expiryDate)}
                </span>
              </p>
              <p className="text-gray-600">
                Views:{" "}
                <span className="font-medium">{currentListing.viewCount}</span>
              </p>
              <p className="text-gray-600">
                Favorites:{" "}
                <span className="font-medium">
                  {currentListing.favoriteCount}
                </span>
              </p>
            </div>

            {currentListing.selectedEquipmentFeatures &&
              currentListing.selectedEquipmentFeatures.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Features & Equipment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentListing.selectedEquipmentFeatures.map(
                      (feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature.featureId.replace(/-/g, " ").toUpperCase()}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

<p>
  v2
</p>
            <FeatureBadges
              selectedEquipmentFeatures={
                currentListing.selectedEquipmentFeatures
              }
              equipmentGroups={equipmentGroups}
            />

            {currentListing.remove && (
              <div className="space-y-2 text-red-700 bg-red-50 p-4 rounded-md border border-red-200">
                <h3 className="text-xl font-semibold">Listing Removed</h3>
                <p>
                  Reason:{" "}
                  <span className="font-medium">
                    {currentListing.remove.reason}
                  </span>
                </p>
                <p>
                  By:{" "}
                  <span className="font-medium">
                    {currentListing.remove.byRole} (
                    {currentListing.remove.byUid})
                  </span>
                </p>
                <p>
                  At:{" "}
                  <span className="font-medium">
                    {formatTimestampToDate(currentListing.remove.at)}
                  </span>
                </p>
                {currentListing.remove.note && (
                  <p>
                    Note:{" "}
                    <span className="font-medium">
                      {currentListing.remove.note}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
