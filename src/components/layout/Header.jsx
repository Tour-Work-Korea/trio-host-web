import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

import ButtonOrange from "@components/ButtonOrange";

import ButtonWhite from "@components/ButtonWhite";
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
    <header className="w-full flex bg-white py-4 px-4 sm:px-12 justify-between items-center">
      <img
        src={WaLogo}
        alt="WorkAway"
        className="h-12 w-auto  cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div>
        {isLoggedIn ? (
          <div className="flex gap-2">
            <div className="w-40">
              <ButtonOrange
                title="사장님 페이지"
                onPress={() => navigate("/guesthouse/my")}
              />
            </div>
            <div>
              <ButtonWhite title="로그아웃" onPress={onLogout} />
            </div>
          </div>
        ) : (
          <div>
            <ButtonOrange title="로그인" to="/login" />
          </div>
        )}
      </div>
    </header>
  );
}
