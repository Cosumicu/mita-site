import api from "../axiosInstance";
import { Property, Reservation, Paginated } from "../../definitions";

const PROPERTY_BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}properties/`;

const GET_PROPERTY_LIST_URL = PROPERTY_BASE_URL;
const CREATE_PROPERTY_URL = `${PROPERTY_BASE_URL}create/`;
const LIST_CREATE_RESERVATION_URL = `${PROPERTY_BASE_URL}reservation/`;
const GET_USER_LIKES_URL = `${PROPERTY_BASE_URL}likes/`;
const GET_RESERVATION_REQUESTS_LIST_URL = `${PROPERTY_BASE_URL}reservation/requests/`;

const getPropertyList = async (filters?: {
  location?: string;
  start_date?: string;
  end_date?: string;
  guests?: string;
}) => {
  const response = await api.get<Property[]>(GET_PROPERTY_LIST_URL, {
    params: filters,
  });
  return response.data;
};

const getUserPropertyList = async (userId: string) => {
  const response = await api.get<Property[]>(GET_PROPERTY_LIST_URL, {
    params: { user: userId },
  });
  return response.data;
};

const getReservationList = async ({ page = 1, pageSize = 10 } = {}) => {
  const response = await api.get<Paginated<Reservation>>(
    LIST_CREATE_RESERVATION_URL,
    {
      params: { page, page_size: pageSize }, // pass as query params
    }
  );
  return response.data;
};

const getReservationPropertyList = async (propertyId: string) => {
  const response = await api.get<Reservation[]>(
    `${LIST_CREATE_RESERVATION_URL}p/${propertyId}`
  );
  return response.data;
};

const getReservationRequestsList = async () => {
  const response = await api.get<Reservation[]>(
    `${GET_RESERVATION_REQUESTS_LIST_URL}`
  );
  return response.data;
};

const approveReservation = async (reservationId: string) => {
  const response = await api.post(
    `${PROPERTY_BASE_URL}reservation/${reservationId}/approve/`
  );
  return response.data;
};

const declineReservation = async (reservationId: string) => {
  const response = await api.post(
    `${PROPERTY_BASE_URL}reservation/${reservationId}/decline/`
  );
  return response.data;
};

const createProperty = async (formData: Property) => {
  const response = await api.post(CREATE_PROPERTY_URL, formData);
  return response.data;
};

const getPropertyDetail = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}${propertyId}/`
  );
  return response.data;
};

const updateProperty = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}${propertyId}/update/`
  );
  return response.data;
};

const deleteProperty = async (propertyId: string) => {
  const response = await api.get<Property>(
    `${PROPERTY_BASE_URL}${propertyId}/delete/`
  );
  return response.data;
};

const createReservation = async (formData: Reservation) => {
  const response = await api.post(LIST_CREATE_RESERVATION_URL, formData);
  return response.data;
};

const getUserLikesList = async () => {
  const response = await api.get<Property[]>(GET_USER_LIKES_URL);
  return response.data;
};

const toggleFavorite = async (propertyId: string) => {
  const response = await api.post(
    `${PROPERTY_BASE_URL}${propertyId}/toggle-favorite/`
  );
  return response.data;
};

const propertyService = {
  getReservationList,
  getReservationPropertyList,
  getUserPropertyList,
  getPropertyList,
  createProperty,
  getPropertyDetail,
  updateProperty,
  deleteProperty,
  createReservation,
  getReservationRequestsList,
  approveReservation,
  declineReservation,
  getUserLikesList,
  toggleFavorite,
};
export default propertyService;
