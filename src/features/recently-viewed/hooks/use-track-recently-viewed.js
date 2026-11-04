import { useEffect, useRef } from "react";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { useRecordRecentlyViewed } from "@/features/recently-viewed/hooks/use-recently-viewed-mutations";

function useTrackRecentlyViewed(productId) {
  const user = useAuthStore((state) => state.user);

  const userId = user?.id ?? null;

  const isCustomer = Boolean(user) && user.role === "customer";

  const { mutate: recordRecentlyViewed } = useRecordRecentlyViewed();

  const recordedKeyRef = useRef(null);

  useEffect(() => {
    if (!isCustomer || !userId || !productId) {
      return;
    }

    const recordKey = `${userId}:${productId}`;

    if (recordedKeyRef.current === recordKey) {
      return;
    }

    /*
     * Set before the request so React
     * development effect checks do not
     * accidentally record twice.
     */
    recordedKeyRef.current = recordKey;

    recordRecentlyViewed(
      {
        productId,
      },
      {
        onError: () => {
          /*
           * Allow a future retry if the
           * background record request failed.
           */
          if (recordedKeyRef.current === recordKey) {
            recordedKeyRef.current = null;
          }
        },
      },
    );
  }, [isCustomer, productId, recordRecentlyViewed, userId]);
}

export { useTrackRecentlyViewed };
