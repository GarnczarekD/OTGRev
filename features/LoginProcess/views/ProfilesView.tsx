import React from "react";
import { useIntl } from "react-intl";

import { LoadingView } from "features/LoginProcess/views/LoadingView";
import { Avatar } from "components/Avatar";
import { useProfilesQuery } from "services/api/user";
import { useAuthenticationStatus } from "services/user";

import * as S from "./styles";
import { messages } from "./messages";
import { ProfilesViewProps } from "./types";

export const ProfilesView: React.FC<ProfilesViewProps> = (props) => {
  const { onProfileSelect, onCreateProfile } = props;

  const { isAuthenticated } = useAuthenticationStatus();
  const { data, isFetching } = useProfilesQuery(isAuthenticated);
  const { formatMessage } = useIntl();

  if (isFetching) {
    return <LoadingView />;
  }

  return (
    <S.ProfilesContainer>
      {data?.map((profile) => (
        <Avatar
          key={profile.profileId}
          src={profile.avatarImagePath}
          bgColor={profile.accentColor}
          label={profile.name}
          large
          onClick={onProfileSelect}
        />
      ))}
      <Avatar
        src={""}
        label={formatMessage(messages.form.button.profile)}
        large
        onClick={onCreateProfile}
        isAddProfile
      />
    </S.ProfilesContainer>
  );
};
