import { create } from "zustand"; // zustand에서 create로 store 생성
import { persist, createJSONStorage } from "zustand/middleware"; // 스토어 상태를 localStorage나 AsyncStorage에 저장할 수 있음

const useUserStore = create(
  persist(
    (set) => ({
      // 초기 상태값
      accessToken: null,
      profile: {
        name: "",
        photoUrl: null,
        phone: "",
        email: "",
        businessNum: "",
      },

      // 토큰 저장 함수
      setTokens: ({ accessToken }) => set({ accessToken }),

      //사장 프로필 저장 함수
      setProfile: (profile) => set({ profile: profile }),

      // 전체 초기화 (로그아웃 시 사용)
      clearUser: () =>
        set({
          accessToken: null,
          refreshToken: null,
          profile: {
            name: "",
            photoUrl: null,
            phone: "",
            email: "",
            businessNum: "",
          },
        }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
