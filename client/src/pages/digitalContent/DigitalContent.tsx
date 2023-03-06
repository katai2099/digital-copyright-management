import { Accordion } from "../../components/accordion/Accordion";
import "./digitalContent.css";

export const DigitalContent = () => {
  return (
    <div className="home-wrapper">
      <div className="digital-content-wrapper">
        <div className="left-block">
          <div className="digital-content-image-wrapper">
            <img
              className="digital-content-image"
              src="../../img/blockchain.png"
            />
          </div>
        </div>
        <div className="right-block"></div>
        <div className="left-block">
          <Accordion title="Description">
            <div></div>
          </Accordion>
          <Accordion title="Pricing information">
            <div></div>
          </Accordion>
          <Accordion title="Detail">
            <div></div>
          </Accordion>
        </div>
        <div className="right-block">
          <Accordion title="Price History">
            <div></div>
          </Accordion>
        </div>
        <div className="full-block">
          <Accordion title="Activity">
            <div></div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
