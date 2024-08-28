import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/user/slice';
import { getUserOrdersThunk } from '../../services/user/actions';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectUserOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
