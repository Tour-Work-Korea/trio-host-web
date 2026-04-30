import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import authApi from "@api/authApi";
import useUserStore from "@stores/userStore";
import { bootstrapSession } from "@utils/authFlow";
import { router } from "./router/router";

const HEARTBEAT_INTERVAL_MS = 60_000;

function App() {
  const sessionReady = useUserStore((state) => state.sessionReady);
  const authenticated = useUserStore((state) => state.authenticated);

  useEffect(() => {
    if (sessionReady) {
      return;
    }
    void bootstrapSession();
  }, [sessionReady]);

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    const sendHeartbeat = () => {
      void authApi.heartbeat().catch(() => undefined);
    };

    sendHeartbeat();
    const intervalId = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sessionReady, authenticated]);

  return <RouterProvider router={router} />;
}

export default App;
