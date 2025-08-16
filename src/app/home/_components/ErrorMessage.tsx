interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/20 p-4">
      <p className="text-red-200">{message}</p>
    </div>
  );
};
