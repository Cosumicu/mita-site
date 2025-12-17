import React, { useEffect, useState } from "react";
import { Rate, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const { TextArea } = Input;

import {
  createPropertyReview,
  resetCreatePropertyReview,
} from "@/app/lib/features/properties/propertySlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { Review } from "@/app/lib/definitions";

interface CreatePropertyReviewModalProps {
  propertyId: string;
  onSuccess?: () => void;
}

const CreatePropertyReviewModal = ({
  propertyId,
  onSuccess,
}: CreatePropertyReviewModalProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { success, loading, error, message } = useAppSelector(
    (state) => state.property.createPropertyReview
  );

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    const formData = new FormData();

    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    dispatch(createPropertyReview({ propertyId, formData }));
  };

  useEffect(() => {
    if (success) {
      toast.success("Review submitted successfully.");
      dispatch(resetCreatePropertyReview());
      onSuccess?.();
    }
    if (error) {
      toast.error("Something went wrong. Please try again later.");
      dispatch(resetCreatePropertyReview());
    }
  }, [dispatch, success, error]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <p>Rating</p>
        <Rate value={rating} onChange={(value) => setRating(value)} />
        <p>Comment</p>
        <TextArea
          value={comment}
          rows={6}
          style={{ resize: "none" }}
          placeholder="Write a review"
          maxLength={256}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex ml-auto">
          {" "}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreatePropertyReviewModal;
