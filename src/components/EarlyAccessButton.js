import { useState } from "react";
import { StyledModal, StyledLoginContainer, StyledLoginButton } from "@/styles";
import { BACKEND_URI } from "@/app/home/utils";
import styled from "styled-components";

const ModalDescription = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 40%;
  margin: 0 1rem 0 1rem;
`;

const RequestAccessLink = styled.a`
  color: var(--green);
  text-decoration: underline;

  
  &:hover {
    color: var(--light-green);
  }
`;

const mailtoString = `mailto:hussain.abdi@uwaterloo.ca?\
subject=TuneTrove%3A%20request%20early%20access&\
body=I'm%20%5BYOUR_NAME%5D%20from%20%5BCOMPANY_NAME%2FHOW_I_KNOW_YOU%5D%20and%20\
I'd%20like%20to%20request%20early%20access%20to%20TuneTrove!`;

const EarlyAccessLoginButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  function toggleModal(e) {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <StyledLoginContainer>
        <StyledLoginButton onClick={toggleModal} >
          Log in with early access
        </StyledLoginButton>
      </StyledLoginContainer>
      <StyledModal
        isOpen={isOpen}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}>
        <ModalDescription>
          <center>
            <p><b>Attention: In order to use this feature you must have been given early access!</b></p>
          </center>
        </ModalDescription>
        <a onClick={toggleModal} href={`${BACKEND_URI()}/login`}>
          <StyledLoginButton>
            I have early access
          </StyledLoginButton>
        </a>
        <RequestAccessLink href={mailtoString}>Request early access here</RequestAccessLink>
        <button style={{margin:'1rem'}} onClick={toggleModal}>Close me</button>
      </StyledModal>
    </>
  )
}

export default EarlyAccessLoginButton;
