import { BeatLoader } from "react-spinners";

export enum DeploymentStep {
  HASH,
  DEPLOY
}

interface BlockchainDeploymentLoadingProp {
  step : DeploymentStep
}

export const BlockchainDeploymentLoading = (props : BlockchainDeploymentLoadingProp) => {
  const {step} = props;
  console.log(step.toString())
  return (
      <div className="modal-box">
        <p style={{ color: "white" }}>Please wait!</p>
        <p style={{ marginBottom: "64px", color: "white" }}>
          {step === DeploymentStep.HASH ? "Image Hashing" : "Blockchain Deployment"} in progress
        </p>
        <BeatLoader
          loading={true}
          // color="#17564c"
          color="#36d7b7"
          size={45}
          speedMultiplier={0.4}
        />
      </div>
    
  );
};

// check hashing loading dialog
