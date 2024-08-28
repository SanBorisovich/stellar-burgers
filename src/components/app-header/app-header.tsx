import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/user/slice';

export const AppHeader: FC = () => {
  const data = useSelector(selectUser);

  return <AppHeaderUI userName={data?.name || ''} />;
};
