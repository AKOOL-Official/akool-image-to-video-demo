import type { AuthState } from "@/contaxt/AuthProvider";
import { ApiClient } from "@/services/apiService";
import { useMemo } from "react";

export function useAkool(auth: AuthState | null) {
  return useMemo(() => {
    if (!auth) return { apiV3: null, apiV4: null };
    return {
      apiV3: new ApiClient(auth, "v3"),
      apiV4: new ApiClient(auth, "v4"),
    };
  }, [auth]);
}
