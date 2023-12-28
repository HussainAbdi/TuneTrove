"use client";

import styled from "styled-components";

const StyledLoginContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xxl) var(--spacing-lg);

  @media (max-width: 700px) {
    padding: var(--spacing-lg);
  }
`;

export default StyledLoginContainer;