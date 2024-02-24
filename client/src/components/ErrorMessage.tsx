import styled from 'styled-components';

const Error = styled.div`
    color: #ff0000;
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

const ErrorMessage = ({ message }: { message: string }) => {
    return <Error>{message}</Error>;
};

export default ErrorMessage;
