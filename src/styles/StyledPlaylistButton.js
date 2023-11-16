import styled from "styled-components";

const StyledPlaylistButton = styled.div`
  position: absolute;
  
  button{
    background-color: var(--green);

    &:hover,
    &:focus {
      background-color: var(--light-green);
    }
  }

  @media (min-width: 1000px) {
    top: 0;
    left: 40%;
  }

  @media (min-width: 768px) {
    top: 0;
    right: var(--spacing-xxl);
  }

  @media (max-width:767px) {
    top: 0;
    left: 250px;
  }
`;

export default StyledPlaylistButton;