import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import propertyService from "./propertyService";
import { Property, Reservation } from "../../definitions";

type AsyncState<T> = {
  data: T;
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
};

type PropertyState = {
  // GET
  propertyList: AsyncState<Property[]>;
  userPropertyList: AsyncState<Property[]>;
  reservationList: AsyncState<Reservation[]>;
  reservationPropertyList: AsyncState<Reservation[]>;
  propertyDetail: AsyncState<Property | null>;

  // POST
  createProperty: AsyncState<Property | null>;
  createReservation: AsyncState<Reservation | null>;
};

const initialAsyncState = <T>(data: T): AsyncState<T> => ({
  data,
  loading: false,
  success: false,
  error: false,
  message: "",
});

const initialState: PropertyState = {
  propertyList: initialAsyncState([]),
  userPropertyList: initialAsyncState([]),
  reservationList: initialAsyncState([]),
  reservationPropertyList: initialAsyncState([]),
  propertyDetail: initialAsyncState(null),

  createProperty: initialAsyncState(null),
  createReservation: initialAsyncState(null),
};

export const getPropertyList = createAsyncThunk<
  Property[],
  void,
  { rejectValue: string }
>("property/getPropertyList", async (_, thunkAPI) => {
  try {
    const response = await propertyService.getPropertyList();
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getUserPropertyList = createAsyncThunk<
  Property[],
  string,
  { rejectValue: string }
>("property/getUserPropertyList", async (userId, thunkAPI) => {
  try {
    const response = await propertyService.getUserPropertyList(userId);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const createProperty = createAsyncThunk<
  Property,
  Property,
  { rejectValue: string }
>("property/createProperty", async (formData, thunkAPI) => {
  try {
    const response = await propertyService.createProperty(formData);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getPropertyDetail = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("property/getPropertyDetail", async (propertyId, thunkAPI) => {
  try {
    const response = await propertyService.getPropertyDetail(propertyId);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const createReservation = createAsyncThunk<
  Reservation,
  Reservation,
  { rejectValue: string }
>("property/createReservation", async (formData, thunkAPI) => {
  try {
    const response = await propertyService.createReservation(formData);
    thunkAPI.dispatch(getReservationPropertyList(formData.property_id));
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getReservationList = createAsyncThunk<
  Reservation[],
  void,
  { rejectValue: string }
>("property/getReservationList", async (_, thunkAPI) => {
  try {
    const response = await propertyService.getReservationList();
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const getReservationPropertyList = createAsyncThunk<
  Reservation[],
  string,
  { rejectValue: string }
>("property/getReservationPropertyList", async (propertyId, thunkAPI) => {
  try {
    console.log("workingasdasdasd");
    const response = await propertyService.getReservationPropertyList(
      propertyId
    );
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const toggleFavorite = createAsyncThunk<
  { propertyId: string },
  string,
  { rejectValue: string }
>("property/toggleFavorite", async (propertyId, thunkAPI) => {
  try {
    await propertyService.toggleFavorite(propertyId);
    // return the ID so the reducer knows which property to flip
    return { propertyId };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// propertyList: initialAsyncState([]),
// userPropertyList: initialAsyncState([]),
// reservationList: initialAsyncState([]),
// reservationPropertyList: initialAsyncState([]),
// propertyDetail: initialAsyncState(null),

// createProperty: initialAsyncState(null),
// createReservation: initialAsyncState(null)

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetPropertyList: (state) => {
      state.propertyList = initialAsyncState([]);
    },
    resetUserPropertyList: (state) => {
      state.userPropertyList = initialAsyncState([]);
    },
    resetReservationList: (state) => {
      state.reservationList = initialAsyncState([]);
    },
    resetReservationPropertyList: (state) => {
      state.reservationPropertyList = initialAsyncState([]);
    },
    resetPropertyDetail: (state) => {
      state.propertyDetail = initialAsyncState(null);
    },
    resetCreateProperty: (state) => {
      state.createProperty = initialAsyncState(null);
    },
    resetCreateReservation: (state) => {
      state.createReservation = initialAsyncState(null);
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROPERTY LIST
      .addCase(getPropertyList.pending, (state) => {
        state.propertyList.loading = true;
      })
      .addCase(
        getPropertyList.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.propertyList.loading = false;
          state.propertyList.success = true;
          state.propertyList.data = action.payload;
        }
      )
      .addCase(getPropertyList.rejected, (state, action) => {
        state.propertyList.loading = false;
        state.propertyList.error = true;
        state.propertyList.message = action.payload as string;
      })
      // GET USER PROPERTY LIST
      .addCase(getUserPropertyList.pending, (state) => {
        state.userPropertyList.loading = true;
      })
      .addCase(
        getUserPropertyList.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.userPropertyList.loading = false;
          state.userPropertyList.success = true;
          state.userPropertyList.data = action.payload;
        }
      )
      .addCase(getUserPropertyList.rejected, (state, action) => {
        state.userPropertyList.loading = false;
        state.userPropertyList.error = true;
        state.userPropertyList.message = action.payload as string;
      })
      // CREATE PROPERTY
      .addCase(createProperty.pending, (state) => {
        state.createProperty.loading = true;
      })
      .addCase(
        createProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.createProperty.loading = false;
          state.createProperty.success = true;
          state.createProperty.data = action.payload;
        }
      )
      .addCase(createProperty.rejected, (state, action) => {
        state.createProperty.loading = false;
        state.createProperty.error = true;
        state.createProperty.message = action.payload as string;
      })
      // GET PROPERTY DETAIL
      .addCase(getPropertyDetail.pending, (state) => {
        state.propertyDetail.loading = true;
      })
      .addCase(
        getPropertyDetail.fulfilled,
        (state, action: PayloadAction<Property>) => {
          state.propertyDetail.loading = false;
          state.propertyDetail.success = true;
          state.propertyDetail.data = action.payload;
        }
      )
      .addCase(getPropertyDetail.rejected, (state, action) => {
        state.propertyDetail.loading = false;
        state.propertyDetail.error = true;
        state.propertyDetail.message = action.payload as string;
      })
      // CREATE RESERVATION
      .addCase(createReservation.pending, (state) => {
        state.createReservation.loading = true;
      })
      .addCase(
        createReservation.fulfilled,
        (state, action: PayloadAction<Reservation>) => {
          state.createReservation.loading = false;
          state.createReservation.success = true;
          state.createReservation.data = action.payload;
        }
      )
      .addCase(createReservation.rejected, (state, action) => {
        state.createReservation.loading = false;
        state.createReservation.error = true;
        state.createReservation.message = action.payload as string;
      })
      // GET RESERVATION LIST
      .addCase(getReservationList.pending, (state) => {
        state.reservationList.loading = true;
      })
      .addCase(
        getReservationList.fulfilled,
        (state, action: PayloadAction<Reservation[]>) => {
          state.reservationList.loading = false;
          state.reservationList.success = true;
          state.reservationList.data = action.payload;
        }
      )
      .addCase(getReservationList.rejected, (state, action) => {
        state.reservationList.loading = false;
        state.reservationList.error = true;
        state.reservationList.message = action.payload as string;
      })
      // GET RESERVATION PROPERTY LIST
      .addCase(getReservationPropertyList.pending, (state) => {
        state.reservationPropertyList.loading = true;
      })
      .addCase(
        getReservationPropertyList.fulfilled,
        (state, action: PayloadAction<Reservation[]>) => {
          state.reservationPropertyList.loading = false;
          state.reservationPropertyList.success = true;
          state.reservationPropertyList.data = action.payload;
        }
      )
      .addCase(getReservationPropertyList.rejected, (state, action) => {
        state.reservationPropertyList.loading = false;
        state.reservationPropertyList.error = true;
        state.reservationPropertyList.message = action.payload as string;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { propertyId } = action.payload;

        const property = state.propertyList.data.find(
          (p) => p.id === propertyId
        );
        if (property) property.liked = !property.liked;

        const userProperty = state.userPropertyList.data.find(
          (p) => p.id === propertyId
        );
        if (userProperty) userProperty.liked = !userProperty.liked;

        if (state.propertyDetail.data?.id === propertyId) {
          state.propertyDetail.data.liked = !state.propertyDetail.data.liked;
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.propertyList.error = true;
        state.propertyList.message = action.payload as string;
      });
  },
});

export const {
  resetPropertyList,
  resetUserPropertyList,
  resetReservationList,
  resetReservationPropertyList,
  resetPropertyDetail,
  resetCreateProperty,
  resetCreateReservation,
} = propertySlice.actions;

export default propertySlice.reducer;
