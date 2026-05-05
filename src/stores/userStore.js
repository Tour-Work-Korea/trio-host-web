import { create } from "zustand";

const createEmptyProfile = () => ({
  id: null,
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
  hostProfile: null,

  setAuthenticated: (authenticated) => set({ authenticated }),
  setSessionReady: (sessionReady) => set({ sessionReady }),
  setProfile: (profile, hostProfile = null) =>
    set({
      authenticated: true,
      sessionReady: true,
      profile,
      hostProfile: hostProfile || profile,
    }),
  clearUser: () =>
    set({
      authenticated: false,
      sessionReady: true,
      profile: createEmptyProfile(),
      hostProfile: null,
    }),
}));

export default useUserStore;
