import styledComponents from 'styled-components';
import styles from '@/styles/page.module.css';
import Image from 'next/image';
import { BACKEND_URI } from './utils';

const StyledLoginContainer = styledComponents.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledLoginButton = styledComponents.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: var(--spacing-sm) var(--spacing-xl);
  white-space: nowrap;

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

const CenteredContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh; /* Full viewport height */

  @media (max-width: 700px) {
    height: 75vh;
  }
`;

const Login = () => (
  <div className={styles.login_main}>
    <div className={styles.description}>
          <p>
            <code className={styles.code}>TuneTrove</code>
          </p>
          <div className={styles.ABDIlogo}>
              <Image
                src="/ABDI-Green-2.svg"
                alt="Vercel Logo"
                width={80}
                height={65}
                priority
              />
          </div>
    </div>
    <CenteredContainer>
      <StyledLoginContainer>
        <StyledLoginButton href={`${BACKEND_URI()}/login`} >
          Log in to Spotify
        </StyledLoginButton>
      </StyledLoginContainer>
    </CenteredContainer>
  </div>
);

export default Login;