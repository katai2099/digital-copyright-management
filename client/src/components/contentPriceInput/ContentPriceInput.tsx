import { useState } from "react";
import "./contentPriceInput.css";

interface IContentPriceInputProps {
  onChange: (price: number) => void;
  onConvert: (price: number) => void;
  ethToUsd: number;
  usdToEth: number;
  isModal?: boolean;
}

export const ContentPriceInput = (props: IContentPriceInputProps) => {
  const [eth, setEth] = useState<number>(0);
  const [usd, setUsd] = useState<number>(0);

  const convertEthToUsd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const value = Number(eth);
    const finalValue = Number((value * props.ethToUsd).toFixed(2));
    props.onConvert(finalValue);
    setUsd(finalValue);
  };

  const convertUsdToEth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const value = Number(usd);
    const finalValue = Number((value * props.usdToEth).toFixed(2));
    props.onConvert(value);
    setEth(finalValue);
  };

  const etherChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseFloat(event.currentTarget.value))) {
      setEth(0);
      props.onChange(0);
    } else {
      const value = parseFloat(event.currentTarget.value);
      const finalValue = Number((value * props.ethToUsd).toFixed(2));
      setEth(value);
      props.onChange(finalValue);
    }
  };

  const usdChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseFloat(event.currentTarget.value))) {
      setUsd(0);
      props.onChange(0);
    } else {
      setUsd(parseFloat(event.currentTarget.value));
      props.onChange(parseFloat(event.currentTarget.value));
    }
  };

  return (
    <div className="content-price-input-wrapper">
      <div>
        <div className={`price col-sm-${props.isModal ? 12 : 7}`}>
          <label className="input-label">Price</label>
          <div>1$ &asymp; {props.usdToEth}Eth</div>
        </div>
        <div className={`col-sm-${props.isModal ? 12 : 7}`}>
          <div className="input-group mb-1">
            <input
              type="number"
              className="form-control"
              placeholder="Price in Usd"
              value={usd}
              onChange={usdChangeHandler}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={convertUsdToEth}
              >
                to ETH
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className={`price col-sm-${props.isModal ? 12 : 7}`}>
            <label className="input-label">Final Price (in Ether)</label>
            <div>1Eth &asymp; {props.ethToUsd}$</div>
          </div>
          <div className={`col-sm-${props.isModal ? 12 : 7}`}>
            <div className="input-group mb-1">
              <input
                type="number"
                className="form-control"
                placeholder="Price in Ether"
                value={eth}
                onChange={etherChangeHandler}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={convertEthToUsd}
                >
                  to USD
                </button>
              </div>
            </div>
          </div>
        </div>
        <small>
          !!Note: the Final price of the license will be in Ether. <br /> Price
          in USD is going to be considered in a final conversion
        </small>
      </div>
    </div>
  );
};
