import { useEffect, useState } from "react";
import { GOERLI_TEST_NET_URL, agreementFiltersWithIcon } from "../../constant";
import "./transaction.css";
import { AgreementOption } from "../../model/Common";
import { FilterBar } from "../filterBar/FilterBar";
import { Transaction } from "../../model/Transaction";
import { getTransactions } from "../../controllers/transction";
import { UseDcm } from "../../contexts/UseDcm";
import { EtherIcon } from "../common/Icon";
import { fromWei } from "../../utils";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

export const TransactionComponent = () => {
  const { state } = UseDcm();
  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  useEffect(() => {
    setFetching(true);
    getTransactions(state.web3State.account)
      .then((res) => {
        setTransaction(res);
        setFetching(false);
      })
      .catch((error) => {
        setFetching(false);
        console.log(error);
      });
  }, [state.web3State.account]);
  return (
    <div className="transaction-component">
      <div className="setting-header">Transaction</div>
      <table style={{ maxWidth: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ maxWidth: "10%" }}>Price</th>
            <th style={{ maxWidth: "30%" }}>From</th>
            <th style={{ maxWidth: "30%" }}>To</th>
            <th style={{ maxWidth: "25%" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {fetching && (
            <>
              {Array(9)
                .fill(0)
                .map(() => (
                  <tr>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                  </tr>
                ))}
            </>
          )}
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <EtherIcon />{" "}
                    <div className="ether-price">
                      {fromWei(transaction.price.toString(), state)}
                    </div>
                  </div>
                  <div className="fiat-price">{`($${(
                    Number(fromWei(transaction.price.toString(), state)) *
                    state.coinRate.ETHToUSD
                  ).toFixed(2)})`}</div>
                </div>
              </td>
              <td className="no-wrap">
                <div className="participant">
                  <a
                    href={`${GOERLI_TEST_NET_URL}/${transaction.from}`}
                    target="blank"
                  >
                    {transaction.from}
                  </a>
                </div>
              </td>
              <td className="no-wrap w-100">
                <div className="participant">
                  <a
                    href={`${GOERLI_TEST_NET_URL}/${transaction.to}`}
                    target="blank"
                  >
                    {transaction.to}
                  </a>
                </div>
              </td>
              <td className="no-wrap w-100">
                <a
                  href={`${GOERLI_TEST_NET_URL}/${transaction.transactionHash}`}
                  target="blank"
                >
                  {moment(
                    new Date(Number(transaction.timestamp) * 1000)
                  ).fromNow()}
                  <i className="las la-external-link-alt link-icon"></i>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
