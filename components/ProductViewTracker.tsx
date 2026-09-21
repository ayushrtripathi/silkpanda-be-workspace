"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface ProductViewTrackerProps {
  productId: string;
  shopId: string;
}

export function ProductViewTracker({ productId, shopId }: ProductViewTrackerProps) {
  useEffect(() => {
    void trackEvent("view", productId, shopId);
  }, [productId, shopId]);

  return null;
}
