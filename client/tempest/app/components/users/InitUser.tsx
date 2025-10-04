"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { getCurrentUser } from "../../lib/features/users/userSlice";

export function InitUser() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return null;
}