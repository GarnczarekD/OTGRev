import { FC } from "react";

import { Input } from "components/Forms/Input";
import { H3 } from "components/Typography";
import { PrimaryButton } from "components/Buttons/PrimaryButton";

import { messages } from "./messages";
import { useModalPrControl } from "./hook";
import { ModalPrControlProps } from "./types";
import * as S from "./styles";

export const ModalPrControl: FC<ModalPrControlProps> = ({
  onValidPin,
  onClose,
}) => {
  const {
    formatMessage,
    isError,
    onHandleSubmit,
    onInputChange,
    prControlCodeInput,
  } = useModalPrControl({ onValidPin });

  return (
    <S.Container>
      <S.StyledH2>{formatMessage(messages.title)}</S.StyledH2>
      <Input
        type="password"
        placeholder={formatMessage(messages.placeholder)}
        value={prControlCodeInput}
        onChange={onInputChange}
      />
      {isError && (
        <S.StyledText highlight sizeXSmall>
          {formatMessage(messages.error)}
        </S.StyledText>
      )}
      <S.ButtonContainer>
        <PrimaryButton variant="ghostWhite" onClick={onClose}>
          <H3> {formatMessage(messages.denyButton)}</H3>
        </PrimaryButton>
        <PrimaryButton
          variant="orange"
          onClick={onHandleSubmit}
          disabled={prControlCodeInput.length < 4}
        >
          <H3>{formatMessage(messages.submitButton)}</H3>
        </PrimaryButton>
      </S.ButtonContainer>
    </S.Container>
  );
};
