import { FcGoogle } from "react-icons/fc";
import { SiAuth0 } from "react-icons/si";

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
        "flex w-full flex-row items-center justify-center gap-5 rounded-lg p-3 text-center font-semibold" +
        (isBlack ? " bg-black text-white" : " border-2 border-gray-300")
      }
    >
      {isBlack ? (
        <FcGoogle className="h-8 w-8" />
      ) : (
        <SiAuth0 className="h-8 w-8" />
      )}
      {buttonText}
    </button>
  );
};

export default LoginButton;
