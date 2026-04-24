import { useEffect, useState } from "react";

import { getErrorMessage } from "../../../shared/lib/getErrorMessage";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useAuthStatus, useDisconnect, useLogin, useVerifyOtp } from "./useAuth";

export const AUTH_STEP = {
  LOGIN: "login",
  OTP: "otp",
  DONE: "done",
};

export function useAuthFlow() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.AUTH);
  const closeModal = useUiStore((s) => s.closeModal);

  const [step, setStep] = useState(AUTH_STEP.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);

  const loginMutation = useLogin();
  const verifyMutation = useVerifyOtp();
  const disconnectMutation = useDisconnect();
  const { data: authStatus } = useAuthStatus();
  const isConnected = authStatus?.status === "connected";

  useEffect(() => {
    if (!isOpen) {
      setStep(AUTH_STEP.LOGIN);
      setEmail("");
      setPassword("");
      setOtp("");
      setSessionId(null);
      loginMutation.reset();
      verifyMutation.reset();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      if (res.status === "connected") {
        setStep(AUTH_STEP.DONE);
        setTimeout(closeModal, 800);
      } else if (res.status === "otp_required") {
        setSessionId(res.session_id);
        setStep(AUTH_STEP.OTP);
      }
    } catch {
      /* surface via loginError */
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    if (!sessionId) return;
    try {
      const res = await verifyMutation.mutateAsync({
        session_id: sessionId,
        otp_code: otp,
      });
      if (res.status === "connected") {
        setStep(AUTH_STEP.DONE);
        setTimeout(closeModal, 800);
      }
    } catch {
      /* surface via verifyError */
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectMutation.mutateAsync();
      closeModal();
    } catch {
      /* surface via disconnectError */
    }
  }

  return {
    isOpen,
    closeModal,
    step,
    setStep,
    isConnected,
    authStatus,

    email,
    setEmail,
    password,
    setPassword,
    otp,
    setOtp,

    loginMutation,
    verifyMutation,
    disconnectMutation,

    loginError: getErrorMessage(loginMutation),
    verifyError: getErrorMessage(verifyMutation),
    disconnectError: getErrorMessage(disconnectMutation),

    handleLogin,
    handleVerify,
    handleDisconnect,
  };
}
