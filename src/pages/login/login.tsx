import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectError,
  selectIsAuthenticated,
  selectIsLoading
} from '../../services/user/slice';
import { loginUserThunk } from '../../services/user/actions';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loginError = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const { state } = location;
  const prevPath = state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUserThunk({ email, password }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to={prevPath} replace />;
  }

  return (
    <LoginUI
      errorText={loginError as string}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
