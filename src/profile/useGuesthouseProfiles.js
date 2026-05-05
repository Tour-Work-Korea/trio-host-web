import { useMemo } from 'react';
import useUserStore from '@stores/userStore';

export const useGuesthouseProfiles = () => {
  const hostProfile = useUserStore(state => state.hostProfile);

  const guesthouseProfiles = useMemo(() => {
    if (!Array.isArray(hostProfile?.guesthouseProfiles)) return [];

    return hostProfile.guesthouseProfiles.map(item => {
      // item은 /host/my/application의 응답 객체 (applicationId = id)
      const isApproved = item?.status === '승인 완료' || item?.status === 'APPROVED' || item?.status === 'ACTIVE';

      return {
        id: String(item?.id || ""), // applicationId를 고유 식별자로 사용 (UI key 등)
        guesthouseId: item?.guesthouseId || null,
        applicationId: String(item?.id || ""),
        name: item?.guesthouseName || item?.businessName || item?.name || '이름 없음',
        photoUrl: item?.guesthouseProfileImageUrl || item?.imgUrl || item?.thumbnailImg || null,
        isApproved: isApproved,
        statusLabel: isApproved ? '운영자' : '등록 심사중', // UI에 띄워줄 라벨
        originalData: item // 원본 데이터 보존 (수정/삭제 시 용이함)
      };
    });
  }, [hostProfile?.guesthouseProfiles]);

  return { guesthouseProfiles };
};
