import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '@api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '@ui';
import { selectIsLoading } from '../../services/user/slice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    registerUserApi({ name: userName, email, password })
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        setErrorText(err.message || 'Произошла неизвестная ошибка');
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
