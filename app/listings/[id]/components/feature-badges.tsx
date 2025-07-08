import { Badge } from "@/components/ui/badge";

interface EquipmentGroup {
  id: string;
  groupName: string;
  features: EquipmentFeature[];
}

interface EquipmentFeature {
  id: string;
  name: string;
  description?: string | null;
  infoLink?: string | null;
}

interface SelectedFeature {
  featureId: string;
  groupId: string;
}

// Props örneği
type Props = {
  selectedEquipmentFeatures?: SelectedFeature[];
  equipmentGroups: EquipmentGroup[];
};

const FeatureBadges = ({
  selectedEquipmentFeatures,
  equipmentGroups,
}: Props) => {
  return (
    <>
      {selectedEquipmentFeatures && selectedEquipmentFeatures.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Features & Equipment</h3>
          <div className="flex flex-wrap gap-2">
            {selectedEquipmentFeatures.map(({ featureId, groupId }, index) => {
              const group = equipmentGroups.find((g) => g.id === groupId);
              const feature = group?.features.find((f) => f.id === featureId);

              return (
                <Badge key={index} variant="outline" title={feature?.description || ""}>
                  {feature?.name ?? featureId}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureBadges;
