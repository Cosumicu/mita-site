import api from "../axiosInstance";
import { Property, Reservation } from "../../definitions";

const PROPERTY_BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}properties/`;

const GET_PROPERTY_LIST_URL = PROPERTY_BASE_URL;
const CREATE_PROPERTY_URL = `${PROPERTY_BASE_URL}create/`;
const LIST_CREATE_RESERVATION_URL = `${PROPERTY_BASE_URL}reservation/`;

const getPropertyList = async () => {
  const response = await api.get<Property[]>(GET_PROPERTY_LIST_URL);
  return response.data;
};

const getUserPropertyList = async (userId: string) => {
  const response = await api.get<Property[]>(GET_PROPERTY_LIST_URL, {
    params: { user: userId },
  });
  return response.data;
};

const getReservationList = async () => {
  const response = await api.get<Reservation[]>(LIST_CREATE_RESERVATION_URL);
  return response.data;
};

const getReservationPropertyList = async (propertyId: string) => {
  const response = await api.get<Reservation[]>(
    `${LIST_CREATE_RESERVATION_URL}p/${propertyId}`
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

const createReservation = async (formData: Reservation) => {
  const response = await api.post(LIST_CREATE_RESERVATION_URL, formData);
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
  createReservation,
  toggleFavorite,
};
export default propertyService;
