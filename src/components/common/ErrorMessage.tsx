interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-error text-center">{message}</p>
);

export default ErrorMessage;