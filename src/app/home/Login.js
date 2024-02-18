import styledComponents from 'styled-components';
import styles from '@/styles/page.module.css';
import Image from 'next/image';
import { BACKEND_URI } from './utils';
import { EarlyAccessLoginButton } from '@/components';
import { StyledLoginContainer, StyledLoginButton } from '@/styles';

const CenteredContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 700px) {
    height: 75vh;
  }

  @media (min-width: 700px) and (max-height: 425px) {
    flex-direction: row;
  }
`;

const Login = () => (
  <div className={styles.login_main}>
    <div className={styles.description}>
          <p>
            <code className={styles.code}>TuneTrove</code>
          </p>
          <div>
              <Image
                src="/ABDI-Green-2.svg"
                alt="ABDI Logo"
                width={80}
                height={65}
                priority
              />
          </div>
    </div>
    <CenteredContainer>
      <StyledLoginContainer>
        <StyledLoginButton href={`${BACKEND_URI()}/login?static_profile=true`} >
          Demo
        </StyledLoginButton>
      </StyledLoginContainer>
      OR
      <EarlyAccessLoginButton />
    </CenteredContainer>
  </div>
);

export default Login;