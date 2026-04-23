import { create } from "zustand";

const createEmptyProfile = () => ({
  name: "",
  photoUrl: null,
  phone: "",
  email: "",
  businessNum: "",
});

const useUserStore = create((set) => ({
  authenticated: false,
  sessionReady: false,
  profile: createEmptyProfile(),

  setAuthenticated: (authenticated) => set({ authenticated }),
  setSessionReady: (sessionReady) => set({ sessionReady }),
  setProfile: (profile) =>
    set({
      authenticated: true,
      sessionReady: true,
      profile,
    }),
  clearUser: () =>
    set({
      authenticated: false,
      sessionReady: true,
      profile: createEmptyProfile(),
    }),
}));

export default useUserStore;
