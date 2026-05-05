import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import guesthouseApi from "@api/guesthouseApi";

const useGuesthouseStore = create(
  persist(
    (set, get) => ({
      guesthouses: [],
      activeGuesthouseId: null,

      setGuesthouses: (list) => set({ guesthouses: list }),
      setActiveGuesthouseId: (id) => set({ activeGuesthouseId: id }),

      fetchGuesthouses: async () => {
        try {
          const res = await guesthouseApi.getMyGuesthousesWithRooms();
          // API 응답 구조에 따라 대응 (배열인지 확인 필요)
          let list = [];
          if (Array.isArray(res.data)) {
            list = res.data;
          } else if (res.data?.content && Array.isArray(res.data.content)) {
            list = res.data.content;
          }
          
          set({ guesthouses: list });

          const currentActive = get().activeGuesthouseId;
          // 만약 선택된 게하가 없고 가져온 리스트가 있다면 첫번째 값을 디폴트로 선택
          if (!currentActive && list.length > 0) {
            set({ activeGuesthouseId: list[0].guesthouseId || list[0].id });
          } else if (currentActive && !list.find(g => String(g.guesthouseId || g.id) === String(currentActive))) {
            set({ activeGuesthouseId: list.length > 0 ? (list[0].guesthouseId || list[0].id) : null });
          }
        } catch (error) {
          console.error("Failed to fetch guesthouses:", error);
        }
      },

      clearStore: () => set({ guesthouses: [], activeGuesthouseId: null }),
    }),
    {
      name: "guesthouse-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGuesthouseStore;
