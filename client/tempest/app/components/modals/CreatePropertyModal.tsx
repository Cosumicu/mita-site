import PropertyForm from "@/app/components/forms/PropertyForm";

interface CreatePropertyModalProps {
  onSuccess?: () => void;
}

export default function CreatePropertyModal({
  onSuccess,
}: CreatePropertyModalProps) {
  return <PropertyForm mode="create" onSuccess={onSuccess} />;
}
