import React, { FC, useEffect, useState } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const [isActiveBurger, setIsActiveBurger] = useState(false);
  const [isActiveList, setIsActiveList] = useState(false);
  const [isActiveProfile, setIsActiveProfile] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) => {
              useEffect(() => {
                setIsActiveBurger(isActive);
              }, [isActive]);
              return isActive ? styles.link_active : styles.link;
            }}
          >
            <BurgerIcon type={isActiveBurger ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) => {
              useEffect(() => {
                setIsActiveList(isActive);
              }, [isActive]);
              return isActive ? styles.link_active : styles.link;
            }}
          >
            <ListIcon type={isActiveList ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to={'/'}>
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            data-cy='login-btn'
            to='/profile'
            className={({ isActive }) => {
              useEffect(() => {
                setIsActiveProfile(isActive);
              }, [isActive]);
              return isActive ? styles.link_active : styles.link;
            }}
          >
            <ProfileIcon type={isActiveProfile ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
