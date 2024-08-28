import {
  ConstructorPage,
  NotFound404,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from '../../services/store';
import Protected from '../protected-route/protected-route';
import { checkUserAuth } from '../../services/user/actions';
import { getIngredientsThunk } from '../../services/ingredients/action';

const App = () => {
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<Protected onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/profile'
          element={<Protected component={<Profile />} />}
        />
        <Route
          path='/register'
          element={<Protected onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<Protected onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<Protected onlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile/orders'
          element={<Protected component={<ProfileOrders />} />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/feed/:number'
          element={<OrderInfo setOrderNumber={setOrderNumber} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<OrderInfo setOrderNumber={setOrderNumber} />}
        />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={`# ${orderNumber}`} onClose={handleClose}>
                <OrderInfo setOrderNumber={setOrderNumber} />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleClose}>
                <OrderInfo setOrderNumber={setOrderNumber} />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
