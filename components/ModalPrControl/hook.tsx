import { ChangeEvent, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useParentalPinCode } from "services/api/user";

const MAX_LENGTH_PIN = 4;

export const useModalPrControl = ({
  onValidPin,
}: {
  onValidPin: () => void;
}) => {
  const { formatMessage } = useIntl();

  const { data } = useParentalPinCode();
  const [prControlCodeInput, setPrControlCodeInput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const onHandleSubmit = () => {
    setIsError(false);

    if (data && data?.prControlPinCode === prControlCodeInput) onValidPin();
    else setIsError(true);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length <= MAX_LENGTH_PIN) setPrControlCodeInput(e.target.value);
  };

  useEffect(() => {
    return setPrControlCodeInput("");
  }, []);

  return {
    formatMessage,
    isError,
    onHandleSubmit,
    onInputChange,
    prControlCodeInput,
  };
};
