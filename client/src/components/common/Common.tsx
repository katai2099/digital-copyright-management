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
        className={error ? "textarea-error" : ""}
        required
        rows={3}
        onChange={(event) => onChanged!(event.currentTarget.value)}
      />
      {error && <div className="error-text">Please enter rejection reason</div>}
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

interface IEtherPriceWrapperProps {
  ether: string;
  fiat: string;
  horizontal?: boolean;
}

export const EthereumPriceWrapper = ({
  ether,
  fiat,
  horizontal,
}: IEtherPriceWrapperProps) => {
  return (
    <div
      style={
        horizontal ? { display: "flex", alignItems: "center", gap: "10px" } : {}
      }
    >
      <div className="ether-price-wrapper">
        <EtherIcon /> <div className="ether-price">{ether}</div>
      </div>
      <div className="fiat-price">{`(${fiat}$)`}</div>
    </div>
  );
};
