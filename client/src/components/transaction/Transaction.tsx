import { useEffect, useState } from "react";
import { GOERLI_TEST_NET_URL } from "../../constant";
import "./transaction.css";
import { Transaction } from "../../model/Transaction";
import { getTransactions } from "../../controllers/transction";
import { UseDcm } from "../../contexts/UseDcm";
import { EtherIcon } from "../common/Icon";
import { fromWei } from "../../utils";
import Skeleton from "react-loading-skeleton";
import { ClipLoader } from "react-spinners";

export const TransactionComponent = () => {
  const { state } = UseDcm();
  const [transactions, setTransaction] = useState<Transaction[]>([]);

  //pagination
  const [fetching, setFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [fetchMoreContent, setFetchMoreContent] = useState<boolean>(false);
  const [noTransaction, setNoTransaction] = useState<boolean>(false);

  const pageChangeHandler = () => {
    setFetchMoreContent(true);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page === 1) setFetching(true);
    getTransactions(state.web3State.account, page)
      .then((newTransaction) => {
        //page === 1
        if (page === 1) {
          if (newTransaction.length === 0) {
            setNoTransaction(true);
          } else {
            setTransaction(newTransaction);
          }
          setFetching(false);
        } else {
          //page > 1
          if (newTransaction.length === 0) {
            setEndOfPage(true);
          } else {
            setTransaction((prev) => [...prev, ...newTransaction]);
          }
          setFetchMoreContent(false);
        }
      })
      .catch((error) => {
        setFetching(false);
        console.log(error);
      });
  }, [page, state.web3State.account]);
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
                  <div>
                    {new Date(
                      Number(transaction.timestamp) * 1000
                    ).toDateString()}
                    <i className="las la-external-link-alt link-icon"></i>
                  </div>
                  <div>
                    {new Date(
                      Number(transaction.timestamp) * 1000
                    ).toLocaleTimeString()}
                  </div>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!fetching && noTransaction ? (
        <div className="no-contents">No requests</div>
      ) : (
        <div>
          <div className="btn-load-more-wrapper">
            {!endOfPage && !fetchMoreContent && !fetching && (
              <button
                className="btn-explore btn-load-more"
                onClick={pageChangeHandler}
              >
                Load more
              </button>
            )}
          </div>
          {endOfPage && (
            <div className="end-of-contents-text">You have reached the end</div>
          )}
        </div>
      )}
      {fetchMoreContent && (
        <div style={{ margin: "10px 0", textAlign: "center" }}>
          <ClipLoader
            color="#88a9ea"
            size={50}
            loading={true}
            speedMultiplier={0.9}
          />
        </div>
      )}
    </div>
  );
};
