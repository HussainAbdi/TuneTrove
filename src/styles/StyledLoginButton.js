"use client";

import styled from "styled-components";

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: var(--spacing-sm) var(--spacing-xl);
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

export default StyledLoginButton;