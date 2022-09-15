import { useCallback, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { useOutsideClick } from "hooks";
import { UserProfile } from "services/api/user";
import { useUserProfile, useUserSession } from "services/user";

export const useProfilePicker = () => {
  const { formatMessage } = useIntl();

  const { setActiveProfile, activeProfile } = useUserProfile();
  const { logout } = useUserSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<
    UserProfile | undefined
  >();

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => isOpen && setIsOpen(() => false));

  const handleCreateProfile = () => toggleIsPickerOpen();

  const closeModal = () => setIsModalOpen(false);

  const toggleIsPickerOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handlePickProfile = useCallback(
    (profile: UserProfile) => {
      const currentLvl =
        activeProfile && activeProfile?.isPrControlOn
          ? Number(activeProfile.prControlMaxLevel)
          : 4;
      const newLvl = profile.isPrControlOn
        ? Number(profile.prControlMaxLevel)
        : 4;

      if (
        profile.profileId === activeProfile?.profileId ||
        profile.prControlMaxLevel === "1" ||
        (currentLvl && currentLvl > newLvl)
      ) {
        setActiveProfile(profile.name);
        toggleIsPickerOpen();
        return;
      }

      setSelectedProfile(profile);
      setIsModalOpen(true);
    },
    [activeProfile, toggleIsPickerOpen, setActiveProfile]
  );

  const handlePrControl = () => {
    if (selectedProfile) setActiveProfile(selectedProfile.name);
    setIsModalOpen(false);
    setIsOpen(false);
  };

  return {
    toggleIsPickerOpen,
    formatMessage,
    handlePickProfile,
    handleCreateProfile,
    ref,
    isOpen,
    userLogout: logout,
    isModalOpen,
    closeModal,
    handlePrControl,
  };
};
