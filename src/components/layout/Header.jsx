import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

import ButtonOrange from "@components/ButtonOrange";
import useUserStore from "@stores/userStore";

import WaLogo from "@assets/images/wa_logo.svg";
import { logout } from "@utils/authFlow";

export default function Header() {
  const navigate = useNavigate();
  const accessToken = useUserStore((s) => s.accessToken);
  const isLoggedIn = !!accessToken;

  const onLogout = useCallback(async () => {
    try {
      await logout();
    } catch (_) {
      // 서버 에러여도 클라이언트 상태는 정리
    } finally {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  return (
    <header className="w-full flex bg-white py-4 px-6 justify-between items-center">
      <img src={WaLogo} alt="WorkAway" className="h-10 w-auto" />
      <div>
        {isLoggedIn ? (
          <ButtonOrange title="로그아웃" onPress={onLogout} />
        ) : (
          <ButtonOrange title="로그인" to="/login" />
        )}
      </div>
    </header>
  );
}
