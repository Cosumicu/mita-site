import React from "react";
import { Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  deleteProperty,
  getPropertyDetail,
} from "@/app/lib/features/properties/propertySlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";

interface DeletePropertyConfirmationModalProps {
  propertyId: string;
  onSuccess?: () => void;
}

const DeletePropertyConfirmationModal = ({
  propertyId,
  onSuccess,
}: DeletePropertyConfirmationModalProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // TODO: add delete property states

  const handleDelete = () => {
    dispatch(deleteProperty(propertyId));
    if (onSuccess) onSuccess();
    router.push("/");
  };

  return (
    <>
      <Space wrap style={{ justifyContent: "center", display: "flex" }}>
        <Button type="primary" onClick={onSuccess}>
          Not Yet
        </Button>
        <Button type="primary" danger onClick={handleDelete}>
          Delete
        </Button>
      </Space>
    </>
  );
};

export default DeletePropertyConfirmationModal;
