"use client";

import { useEffect, useState } from "react";

export function PwaRegistrar(): React.JSX.Element | null {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then(() => setReady(true))
      .catch((error) => {
        console.error("Service worker registration failed", error);
      });
  }, []);

  if (!ready) {
    return null;
  }

  return <span className="sw-ready">الوضع غير المتصل مفعّل</span>;
}
