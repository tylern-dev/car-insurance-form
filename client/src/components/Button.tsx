import { StyledButton } from './styled-components';

export type Props = {
    onClick?: () => void;
    name: string;
    type?: 'button' | 'submit' | 'reset';
    secondary?: boolean;
};

const Button = ({ name, type, onClick, secondary }: Props) => {
    return (
        <StyledButton name={name} type={type} onClick={onClick} secondary={secondary}>
            {name}
        </StyledButton>
    );
};

export default Button;
