import styled from "styled-components";

const RequestAccess = styled.a`
  color: var(--green);
  text-decoration: underline;
  margin-top: 1rem;

  &:hover {
    color: var(--light-green);
  }
`;

const mailtoString = `mailto:hussain.abdi@uwaterloo.ca?\
subject=TuneTrove%3A%20request%20early%20access&\
body=I'm%20%5BYOUR_NAME%5D%20from%20%5BCOMPANY_NAME%2FHOW_I_KNOW_YOU%5D%20and%20\
I'd%20like%20to%20request%20early%20access%20to%20TuneTrove!`;

const RequestAccessLink = ({children}) => (
  <RequestAccess href={mailtoString}>{children}</RequestAccess>
);

export default RequestAccessLink;