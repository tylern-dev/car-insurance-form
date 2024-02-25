import styled from 'styled-components';
import type { Props } from '../Button';

export const Container = styled.div`
    max-width: 980px;
    margin: 0 auto;
    padding: 0 120px;
`;

export const StyledButton = styled.button<Props>`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    background-color: ${(props) => (props.theme === 'secondary' ? '#3498db' : '#4caf50')};
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2);
    }
`;

export const StyledColumn = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;
`;

export const StyledSection = styled.div`
    margin-bottom: 24px;
`;

export const FormField = styled.div`
    margin-bottom: 1rem;
`;

export const Label = styled.label`
    font-size: 1rem;
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
`;

export const Input = styled.input`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

export const StyledSelect = styled.select`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    width: 100%;
`;
