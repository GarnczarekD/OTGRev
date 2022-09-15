import React, { useState } from "react";

import { getUserErrorType, useErrorScreen } from "services/error";
import { useLocalStorage } from "services/storage";
import { ModalPrControl } from "components/ModalPrControl";
import { UserProfile } from "services/api/user";
import { useUserProfile, useUserSession } from "services/user";

import {
  ConsentsView,
  FullLoginView,
  LoadingView,
  ProfilesView,
  QuickLoginView,
} from "./views";
import { LoginProcessProps, LoginProcessState } from "./types";

export const LoginProcess: React.FC<LoginProcessProps> = (props) => {
  const { onSuccess } = props;

  const { setActiveProfile } = useUserProfile();
  const { fullLogin, quickLogin } = useUserSession();

  const { showErrorModal } = useErrorScreen();

  const [selectedProfile, setSelectedProfile] = useState<
    UserProfile | undefined
  >();
  const [consentsAccepted, setConsentsAccepted] = useLocalStorage<
    boolean | null
  >("consentsAccepted", null);

  const consentsSaved = consentsAccepted !== null;

  const [state, setState] = useState<LoginProcessState>({
    type: "QUICK_LOGIN",
    error: false,
  });

  const chooseQuickLogin = async () => {
    setState({ type: "QUICK_LOGIN", error: false });
  };

  const chooseFullLogin = async () => {
    setState({ type: "FULL_LOGIN", error: false });
  };

  const submitQuickLogin = async (code: string, remember: boolean) => {
    if (state.type !== "QUICK_LOGIN") {
      throw new Error(`Invalid State: ${state}`);
    }

    try {
      setState({ ...state, error: false });

      await quickLogin(code, remember);

      setState({ type: consentsSaved ? "SELECT_PROFILE" : "ACCEPT_CONSENTS" });
    } catch (error: unknown) {
      setState({ ...state, error: true });
      showErrorModal(getUserErrorType(error));
    }
  };

  const submitFullLogin = async (
    username: string,
    code: string,
    remember: boolean
  ) => {
    if (state.type !== "FULL_LOGIN") {
      throw new Error(`Invalid State: ${state}`);
    }

    try {
      setState({ ...state, error: false });

      await fullLogin(username, code, remember);

      setState({ type: consentsSaved ? "SELECT_PROFILE" : "ACCEPT_CONSENTS" });
    } catch (error: unknown) {
      setState({ ...state, error: true });
      showErrorModal(getUserErrorType(error));
    }
  };

  const submitConsents = async (accepted: boolean) => {
    if (state.type !== "ACCEPT_CONSENTS") {
      throw new Error(`Invalid State: ${state}`);
    }

    setState({ type: "LOADING" });

    // TODO: api requests for this?
    setConsentsAccepted(accepted);

    setState({ type: "SELECT_PROFILE" });
  };

  const selectProfile = async (
    profile: UserProfile,
    isPrControlActive: boolean
  ) => {
    if (state.type !== "SELECT_PROFILE") {
      throw new Error(`Invalid State: ${state}`);
    }

    if (!isPrControlActive || profile.prControlMaxLevel === "1") {
      setActiveProfile(profile.name);
      handleSuccessLogin();
      return;
    }

    setSelectedProfile(profile);
    setState({ type: "PR_CONTROL" });
  };

  const handlePrControl = () => {
    handleSuccessLogin();
    if (selectedProfile) setActiveProfile(selectedProfile.name);
  };

  const handleBackToProfile = () => setState({ type: "SELECT_PROFILE" });

  const handleSuccessLogin = () => {
    setState({ type: "LOGIN_SUCCESS" });
    onSuccess();
  };

  switch (state.type) {
    case "LOADING":
      return <LoadingView />;
    case "QUICK_LOGIN":
      return (
        <QuickLoginView
          onLogin={submitQuickLogin}
          onFullLoginSelect={chooseFullLogin}
          error={state.error}
        />
      );
    case "FULL_LOGIN":
      return (
        <FullLoginView
          onLogin={submitFullLogin}
          onQuickLoginSelect={chooseQuickLogin}
          error={state.error}
        />
      );
    case "ACCEPT_CONSENTS":
      return <ConsentsView onAccept={submitConsents} />;
    case "SELECT_PROFILE":
      return (
        <ProfilesView
          onProfileSelect={selectProfile}
          onCreateProfile={handleSuccessLogin}
        />
      );
    case "PR_CONTROL":
      return (
        <ModalPrControl
          handlePrControl={handlePrControl}
          onClose={handleBackToProfile}
        />
      );
    default:
      return null;
  }
};
