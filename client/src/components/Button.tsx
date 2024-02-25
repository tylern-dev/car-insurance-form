import { StyledButton } from './styled-components';

export type Props = {
    onClick?: () => void;
    name: string;
    type?: 'button' | 'submit' | 'reset';
    theme?: 'secondary';
};

const Button = ({ name, type, onClick, theme }: Props) => {
    return (
        <StyledButton name={name} type={type} onClick={onClick} theme={theme}>
            {name}
        </StyledButton>
    );
};

export default Button;
