import { useState } from "react";
import { EtherIcon } from "../common/Icon";
import "./withdraw.css";
import { withdrawEther } from "../../controllers/web3";
import { UseDcm } from "../../contexts/UseDcm";

export const Withdraw = () => {
  const { state } = UseDcm();
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  const handleRowClick = (index: number) => {
    setActiveRowIndex(index);
  };

  const withdrawHandler = () => {
    withdrawEther(state.web3State)
      .then((res) => {
        alert("Withdraw successful");
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="withdraw-header-section">
        <div className="ether-price-wrapper">
          <EtherIcon /> <div className="ether-price">{"123124124"}</div>
        </div>
        <button onClick={withdrawHandler}>Withdraw</button>
      </div>
      <div className="withdraw-record">
        <table className="table-with-accordion">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>No. Item</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="actived" onClick={() => handleRowClick(0)}>
              <td>{new Date().toDateString()}</td>
              <td>{23123}</td>
              <td>{2}</td>
              <td className="accordion-toggle">
                {activeRowIndex === 0 ? (
                  <span>
                    <i className="las la-angle-up"></i> Hide Details
                  </span>
                ) : (
                  <span>
                    <i className="las la-angle-down"></i> View Details
                  </span>
                )}
              </td>
            </tr>
            {activeRowIndex === 0 && (
              <tr>
                <td colSpan={4} className="accordion-details">
                  <ul>
                    <li>Email:</li>
                    <li>Phone: </li>
                    <li>Address: </li>
                  </ul>
                </td>
              </tr>
            )}
            <tr onClick={() => handleRowClick(1)}>
              <td>{new Date().toDateString()}</td>
              <td>{23123}</td>
              <td>{2}</td>
              <td>
                {activeRowIndex === 0 ? "[-] Hide Details" : "[+] View Details"}
              </td>
            </tr>
            {activeRowIndex === 0 && (
              <tr>
                <td colSpan={4}>
                  <ul>
                    <li>Email:</li>
                    <li>Phone: </li>
                    <li>Address: </li>
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
