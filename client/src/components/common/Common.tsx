import { EtherIcon } from "./Icon";
import "./common.css";

interface IRequestModalBodyProps {
  price: string;
  onChanged?: (text: string) => void;
  error?: boolean;
}

export const RejectRequestBody = ({
  price,
  onChanged,
  error,
}: IRequestModalBodyProps) => {
  return (
    <div className="request-body">
      <label>Please provide reason for rejection:</label>
      <textarea
        style={error ? { borderColor: "red" } : {}}
        required
        rows={3}
        onChange={(event) => onChanged!(event.currentTarget.value)}
      />
      {error && <div>Please enter rejection reason</div>}
      <small>
        !Note:{" "}
        <strong>
          <EtherIcon />
          {price}
        </strong>{" "}
        will be returned back to licensee wallet
      </small>
    </div>
  );
};

export const ApproveRequestBody = ({ price }: IRequestModalBodyProps) => {
  return (
    <div className="request-body">
      <div>
        !Note:{" "}
        <strong>
          <EtherIcon /> {price}{" "}
        </strong>{" "}
        will be transfered to your wallet
      </div>
    </div>
  );
};
