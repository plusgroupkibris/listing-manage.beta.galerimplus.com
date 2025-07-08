"use client";

import * as Tabs from "@radix-ui/react-tabs";

const imageLabels: Record<string, string> = {
  Front: "Ön",
  Rear: "Arka",
  Side: "Yan",
  Interior: "İç Mekan",
  Engine: "Motor",
  Console: "Konsol",
  Other: "Diğer",
};

const ImageTabs = ({ images }: { images: Record<string, string[]> }) => {
  const categories = Object.keys(imageLabels);

  return (
    <Tabs.Root defaultValue={categories[0]} className="w-full mt-4">
      <Tabs.List className="flex gap-2 border-b pb-2 overflow-x-auto">
        {categories.map((category) => {
          const count = images[category]?.length ?? 0;
          return (
            <Tabs.Trigger
              key={category}
              value={category}
              className="px-4 py-2 rounded-md text-sm data-[state=active]:bg-gray-100"
            >
              {imageLabels[category]} ({count})
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {categories.map((category) => (
        <Tabs.Content key={category} value={category} className="mt-4">
          {images[category] && images[category].length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {images[category].map((img, index) => (
                <img
                  key={index}
                  src={img || "/placeholder.svg?height=100&width=150&query=car-thumbnail"}
                  alt={`${category} image ${index + 1}`}
                  width={150}
                  height={100}
                  className="rounded-md object-cover aspect-[3/2] cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Görsel bulunamadı.
            </div>
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default ImageTabs;
