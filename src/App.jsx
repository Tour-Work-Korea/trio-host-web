import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import useUserStore from "@stores/userStore";
import { bootstrapSession } from "@utils/authFlow";
import { router } from "./router/router";

function App() {
  const sessionReady = useUserStore((state) => state.sessionReady);

  useEffect(() => {
    if (sessionReady) {
      return;
    }
    void bootstrapSession();
  }, [sessionReady]);

  return <RouterProvider router={router} />;
}

export default App;
