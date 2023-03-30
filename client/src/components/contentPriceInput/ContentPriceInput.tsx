import { useState } from "react";
import "./contentPriceInput.css";

interface IContentPriceInputProps {
  onBlur: (price: number) => void;
  ethToUsd: number;
  usdToEth: number;
}

export const ContentPriceInput = (props: IContentPriceInputProps) => {
  //const [price, setPrice] = useState<number>(0);
  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const price = Number(event.currentTarget.value);
    //setPrice(price);
    props.onBlur(price);
  };
  //const priceInEther = price * props.usdToEth;
  return (
    <div className="content-price-input-wrapper">
      <div>
        <div className="price col-sm-8">
          <label className="input-label">Price</label>
          <div>1$ &asymp; {props.usdToEth}Eth</div>
        </div>
        <div>
          <input className="col-sm-8" onBlur={handleOnBlur} />
          <button>to ETH</button>
        </div>
      </div>
      <div>
        <div>
          <div className="price col-sm-8">
            <label className="input-label">Final Price (in Ether)</label>
            <div>1Eth &asymp; {props.ethToUsd}$</div>
          </div>
          <div className="col-sm-12">
            <input className="col-sm-8" />
            <button>to USD</button>
          </div>
        </div>
        <div>!!Note: the final price of the license will be in Ether</div>
      </div>
    </div>
  );
};
