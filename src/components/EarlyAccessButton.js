import { useState } from "react";
import { StyledModal, StyledLoginContainer, StyledLoginButton } from "@/styles";
import { BACKEND_URI } from "@/app/home/utils";
import { RequestAccessLink } from "@/components"
import styled from "styled-components";

const ModalDescription = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 40%;
  margin: 1rem 2rem 0 2rem;
`;

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
            <p><b>Attention: Due to Spotify API changes, you must have been given early access to use this feature!</b></p>
          </center>
        </ModalDescription>
        <StyledLoginButton onClick={toggleModal} href={`${BACKEND_URI()}/login`}>
          I have early access
        </StyledLoginButton>
        <RequestAccessLink>Request early access here</RequestAccessLink>
        <button style={{margin:'1rem'}} onClick={toggleModal}>Close me</button>
      </StyledModal>
    </>
  )
}

export default EarlyAccessLoginButton;
