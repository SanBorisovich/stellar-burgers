import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  selectConstructorItems
} from '../../services/burger-constructor/slice';
import { useNavigate } from 'react-router-dom';
import {
  resetOrderState,
  selectIsAuthenticated,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/user/slice';
import { createOrderThunk } from '../../services/user/actions';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const burgerIngredients = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(createOrderThunk(burgerIngredients)).finally(() => {
        dispatch(clearConstructor());
      });
    }
  };
  const closeOrderModal = () => {
    dispatch(resetOrderState());
    navigate('/', { replace: true });
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
