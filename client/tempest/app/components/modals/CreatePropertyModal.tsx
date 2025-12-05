import PropertyForm from "@/app/components/forms/PropertyForm";
import { Property } from "@/app/lib/definitions";

interface CreatePropertyModalProps {
  onSuccess?: () => void;
}

export default function CreatePropertyModal({
  onSuccess,
}: CreatePropertyModalProps) {
  return <PropertyForm mode="create" onSuccess={onSuccess} />;
}
