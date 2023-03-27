import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion } from "../accordion/Accordion";
import { IContentTypeProps } from "../contents/Contents";
import "./events.css";
export const Events = ({ contentType }: IContentTypeProps) => {
  const type = contentType;
  return (
    <div className="row">
      <div className="col-sm-3">
        <Accordion title="Event Type">
          <div className="event-type">
            <label htmlFor="event">Create</label>
            <input type="checkbox" name="event" />
          </div>
          <div className="event-type">
            <label htmlFor="event">Agreement</label>
            <input type="checkbox" name="event" />
          </div>
          <div className="event-type">
            <label htmlFor="event">Update</label>
            <input type="checkbox" name="event" />
          </div>
        </Accordion>
      </div>
      <div className="col-sm-9">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Item</th>
              <th>Price</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="no-wrap">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </i>
                Create
              </td>
              <td className="no-wrap">
                <div className="content-img-wrapper">
                  <img
                    className="content-img"
                    src="./img/blockchain.png"
                    width="56px"
                    height="56px"
                  />
                </div>
                <div className="content-name">this is my pic</div>
              </td>
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <i>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="eth-cur-icon"
                      >
                        <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                      </svg>
                    </i>{" "}
                    <div className="ether-price">0.01</div>
                  </div>
                  <div className="fiat-price">($10.00)</div>
                </div>
              </td>
              <td className="no-wrap">
                <a href="#">phommach</a>
              </td>
              <td className="no-wrap">
                <a href="#">cookie</a>
              </td>
              <td className="no-wrap">
                {" "}
                <a href="#">
                  {" "}
                  3 days ago{" "}
                  <i>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </i>
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="icon"
                  >
                    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm54.2 253.8c-6.1 20.3-24.8 34.2-46 34.2H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h8.2c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.7 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 349l-9.8 32.8z" />
                  </svg>
                </i>
                Agreement
              </td>
              <td>
                <a href="#">
                  <div className="content-img-wrapper">
                    <img
                      className="content-img"
                      src="./img/blockchain.png"
                      width="56px"
                      height="56px"
                    />
                  </div>
                  <div className="content-name">
                    this is my pic asdfasdklfjasd;flhasdfk;
                  </div>
                </a>
              </td>
              <td>12eth</td>
              <td>phommach</td>
              <td>cookie</td>
              <td>3 days ago</td>
            </tr>
            <tr>
              <td>
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </i>
                Update
              </td>
              <td>
                <div className="content-img-wrapper">
                  <img
                    className="content-img"
                    src="./img/blockchain.png"
                    width="56px"
                    height="56px"
                  />
                </div>
                <div className="content-name">this is my pic</div>
              </td>
              <td>12eth</td>
              <td>phommach</td>
              <td>cookie</td>
              <td>3 days ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
