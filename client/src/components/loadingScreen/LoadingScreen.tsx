import { ScaleLoader } from "react-spinners";

interface ILoadingScreenProps {
  title: string;
}

export const LoadingScreen = ({ title }: ILoadingScreenProps) => {
  return (
    <div className="backdrop" style={{ zIndex: 1000 }}>
      <div className="loading-wrapper">
        <div className="loading-animation">
          <ScaleLoader color="#36d7b7" height={60} />
        </div>
        <div className="loading-title">{title}</div>
      </div>
    </div>
  );
};
