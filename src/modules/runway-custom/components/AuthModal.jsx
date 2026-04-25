import ModalShell from "../../../shared/ui/ModalShell";
import { AUTH_STEP, useAuthFlow } from "../hooks/useAuthFlow";
import ConnectedStep from "./auth/ConnectedStep";
import DoneStep from "./auth/DoneStep";
import LoginStep from "./auth/LoginStep";
import OtpStep from "./auth/OtpStep";

export default function AuthModal() {
  const flow = useAuthFlow();

  return (
    <ModalShell
      open={flow.isOpen}
      title="Connect Runway"
      onClose={flow.closeModal}
    >
      {flow.step === AUTH_STEP.LOGIN && flow.isConnected && (
        <ConnectedStep
          email={flow.authStatus?.email}
          onClose={flow.closeModal}
          onDisconnect={flow.handleDisconnect}
          isDisconnecting={flow.disconnectMutation.isPending}
          error={flow.disconnectError}
        />
      )}

      {flow.step === AUTH_STEP.LOGIN && !flow.isConnected && (
        <LoginStep
          email={flow.email}
          password={flow.password}
          onEmailChange={flow.setEmail}
          onPasswordChange={flow.setPassword}
          onSubmit={flow.handleLogin}
          onCancel={flow.closeModal}
          isPending={flow.loginMutation.isPending}
          error={flow.loginError}
        />
      )}

      {flow.step === AUTH_STEP.OTP && (
        <OtpStep
          otp={flow.otp}
          onOtpChange={flow.setOtp}
          onSubmit={flow.handleVerify}
          onBack={() => flow.setStep(AUTH_STEP.LOGIN)}
          isPending={flow.verifyMutation.isPending}
          error={flow.verifyError}
        />
      )}

      {flow.step === AUTH_STEP.DONE && <DoneStep />}
    </ModalShell>
  );
}
