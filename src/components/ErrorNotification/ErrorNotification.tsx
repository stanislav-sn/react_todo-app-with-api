import { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../enums/ErrorMessages';

const ERROR_DURATION = 3000;

interface ErrorNotificationProps {
  errorMessage: ErrorMessages | null;
  onHideError: () => void;
}

export const ErrorNotification: FC<ErrorNotificationProps> = ({
  errorMessage,
  onHideError,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevMessageRef = useRef<ErrorMessages | null>(null);

  useEffect(() => {
    if (!errorMessage || errorMessage === prevMessageRef.current) {
      return;
    }

    prevMessageRef.current = errorMessage;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onHideError();
    }, ERROR_DURATION);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [errorMessage, onHideError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {errorMessage}
    </div>
  );
};
