interface ButtonProps {
  onClick: () => void;
  buttonText: string;
  isBlack: boolean;
}

const LoginButton: React.FC<ButtonProps> = ({
  onClick,
  buttonText,
  isBlack,
}) => {
  return (
    <button
      onClick={onClick}
      className={
        "w-full rounded-lg p-3 text-center font-semibold" +
        (isBlack ? " bg-black text-white" : " border")
      }
    >
      {buttonText}
    </button>
  );
};

export default LoginButton;
