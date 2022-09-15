import { RawButton } from "components/Buttons/RawButton";
import { Text } from "components/Typography";
import { Modal } from "components/Modal";
import { ModalPrControl } from "components/ModalPrControl";

import { useProfilePicker } from "./hooks";
import { messages } from "./messages";
import { ProfilePickerProps } from "./types";
import * as S from "./styles";

export function ProfilePicker({
  profiles,
  activeProfile,
}: ProfilePickerProps): JSX.Element {
  const {
    toggleIsPickerOpen,
    formatMessage,
    handlePickProfile,
    handleCreateProfile,
    ref,
    isOpen,
    userLogout,
    isModalOpen,
    closeModal,
    onPinValid,
  } = useProfilePicker();

  const profilesRender = profiles.map((profile) => (
    <S.PickerAvatar
      key={profile.profileId}
      bgColor={profile.accentColor}
      active={profile.name === activeProfile?.name}
      label={profile.name}
      src={profile.avatarImagePath}
      alt={`${profile.name} avatar`}
      small
      onClick={() => {
        handlePickProfile(profile);
      }}
    />
  ));

  return (
    <>
      <S.Container>
        <S.PickerAvatar
          data-testid="picker-avatar"
          src={activeProfile?.avatarImagePath || ""}
          alt={"avatar-image"}
          bgColor={activeProfile?.accentColor}
          small
          onClick={toggleIsPickerOpen}
        />

        <S.PickerContainer
          isOpen={isOpen}
          data-testid="picker-container"
          ref={ref}
        >
          <S.PickerAvatar
            src={""}
            label={formatMessage(messages.createProfile)}
            small
            onClick={handleCreateProfile}
            isAddProfile
          />
          {profilesRender}
          <S.LogoutWrapper>
            <RawButton onClick={userLogout}>
              <Text primary sizeSmall>
                {formatMessage(messages.logout)}
              </Text>
            </RawButton>
          </S.LogoutWrapper>
        </S.PickerContainer>
      </S.Container>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalPrControl onClose={closeModal} onValidPin={onPinValid} />
        </Modal>
      )}
    </>
  );
}
