"use client"; // Specifying that this is a client component

import { Suspense, useEffect, useState } from 'react';
import { accessToken, logout } from './spotify';
import styles from '@/styles/page.module.css';
import { Login } from '@/app/home';
import styled from 'styled-components';

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

export default function HomeLayout({children}) {
  const [token, setToken] = useState(null);

  useEffect(()=>{
    setToken(accessToken);
  }, [])

  return (
    <div>
      {!token ? (
        <Login />
      ) : (
        <>
          <StyledLogoutButton className={styles.card} onClick={logout}> 
                Log Out <span>-&gt;</span>
          </StyledLogoutButton>
          {children}
        </>
      )}
    </div>
  )
}

