type Props = {
    quote: string;
};
const Quote = ({ quote }: Props) => {
    return <h1>{`Congrats! Your price is $${quote}`}</h1>;
};

export default Quote;
