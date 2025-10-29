import { useEffect, useState } from "react";
import { useRequestDraftStore } from "@/store/useRequestDraftStore";

// 훅으로 Hydration 상태를 외부에 노출
export const useDraftHydration = () => {
  const [isHydrated, setIsHydrated] = useState(useRequestDraftStore.persist.hasHydrated);

  useEffect(() => {
    if (!isHydrated) {
      const unsub = useRequestDraftStore.persist.onFinishHydration(() => {
        setIsHydrated(true);
        console.log("Zustand Draft Store Hydration Finished.");
      });

      return () => {
        unsub();
      };
    }
  }, [isHydrated]);

  return isHydrated;
};

// Provider는 단순히 children을 렌더링하고, Hydration 로직은 훅으로 분리
export function DraftProvider({ children }: { children: React.ReactNode }) {
  // 서버 환경에서는 Hydration이 이루어지지 않으므로, 이 컴포넌트는 항상 렌더링
  return <>{children}</>;
}
