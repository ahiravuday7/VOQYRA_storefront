import { useMutation } from "@tanstack/react-query";

import { register } from "@/features/auth/api/auth-api";

function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

export { useRegister };
