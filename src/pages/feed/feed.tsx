import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectOrders } from '../../services/feeds/slice';
import { getFeedsThunk } from '../../services/feeds/action';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
