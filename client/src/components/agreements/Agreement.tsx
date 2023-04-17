import "./agreement.css";
import { EtherIcon } from "../common/Icon";
import { Link } from "react-router-dom";
import { AgreementOption } from "../../model/Common";
import { useEffect, useState } from "react";
import {
  getLicenserAgreements,
  getLicensingAgreements,
} from "../../controllers/agreement";
import { Agreement } from "../../model/Agreement";
import { FilterBar } from "../filterBar/FilterBar";
import { agreementFiltersWithIcon } from "../../constant";
import { ContentPreviewComponent } from "../eventTable/EventTable";
import { UseDcm } from "../../contexts/UseDcm";
import { fromWei } from "../../utils";
import Skeleton from "react-loading-skeleton";
import { DcmState } from "../../contexts/state";
import { ClipLoader } from "react-spinners";

interface IAgreement {
  walletAddress: string;
}

interface IAgreementTable {
  agreements: Agreement[];
  endOfpage: boolean;
  noContent: boolean;
  fetchMoreContent: boolean;
  fetching: boolean;
  isLicenser: boolean;
  state: DcmState;
  pageChangeHandler: () => void;
}

export const AgreementComponent = ({ walletAddress }: IAgreement) => {
  const { state } = UseDcm();
  const [option, setOption] = useState<AgreementOption>(
    AgreementOption.LICENSER
  );

  //licenser
  const [licenserAgreements, setLicenserAgreements] = useState<Agreement[]>([]);
  const [fetchingLicenser, setFetchingLicenser] = useState<boolean>(false);
  const [licenserPage, setLicenserPage] = useState<number>(1);
  const [licenserEndOfPage, setLicenserEndOfPage] = useState<boolean>(false);
  const [noLicenserAgreement, setNoLicenserAgreement] =
    useState<boolean>(false);
  const [fetchMoreLicenserAgreement, setFetchMoreLicenserAgreement] =
    useState<boolean>(false);
  const showMoreLicenserAgreementHandler = () => {
    setLicenserPage((prev) => prev + 1);
    setFetchMoreLicenserAgreement(true);
  };

  //licensing
  const [licensingAgreements, setLicensingAgreements] = useState<Agreement[]>(
    []
  );
  const [fetchingLicensing, setFetchingLicensing] = useState<boolean>(false);
  const [licensingFetching, setLicensingFetching] = useState<boolean>(false);
  const [licensingPage, setLicensingPage] = useState<number>(1);
  const [licensingEndOfPage, setLicensingEndOfPage] = useState<boolean>(false);
  const [noLicensingAgreement, setNoLicensingAgreement] =
    useState<boolean>(false);
  const [fetchMoreLicensingAgreement, setFetchMoreLicensingAgreement] =
    useState<boolean>(false);
  const showMoreLicensingAgreementHandler = () => {
    setLicensingPage((prev) => prev + 1);
    setFetchMoreLicensingAgreement(true);
  };

  //licenser
  useEffect(() => {
    if (licenserPage === 1) setFetchingLicenser(true);
    getLicenserAgreements(walletAddress, licenserPage)
      .then((newAgreement) => {
        if (licenserPage === 1) {
          if (newAgreement.length === 0) {
            setNoLicenserAgreement(true);
          } else {
            setLicenserAgreements(newAgreement);
          }
          setFetchingLicenser(false);
        } else {
          //page > 1
          if (newAgreement.length === 0) {
            setLicenserEndOfPage(true);
          } else {
            setLicenserAgreements((prev) => [...prev, ...newAgreement]);
          }
          setFetchMoreLicenserAgreement(false);
        }
      })
      .catch((err) => {
        setFetchMoreLicenserAgreement(false);
        setFetchingLicenser(false);
      });
  }, [licenserPage, walletAddress]);

  //licensing
  useEffect(() => {
    if (licensingPage === 1) setFetchingLicensing(true);
    getLicensingAgreements(walletAddress, licensingPage)
      .then((newAgreement) => {
        if (licensingPage === 1) {
          if (newAgreement.length === 0) {
            setNoLicensingAgreement(true);
          } else {
            setLicensingAgreements(newAgreement);
          }
          setFetchingLicensing(false);
        } else {
          //page > 1
          if (newAgreement.length === 0) {
            setLicensingEndOfPage(true);
          } else {
            setLicensingAgreements((prev) => [...prev, ...newAgreement]);
          }
          setFetchMoreLicensingAgreement(false);
        }
      })
      .catch((error) => {
        setFetchingLicensing(false);
        setFetchMoreLicensingAgreement(false);

        console.log(error);
      });
  }, [walletAddress, licensingPage]);

  const onFilterChangeHandler = (selected: string) => {
    const selectedOption = selected as AgreementOption;
    if (option !== selectedOption) {
      setOption(selectedOption);
    }
  };

  const isLicenser = option === AgreementOption.LICENSER;

  return (
    <div className="agreement-component">
      <div className="setting-header">Agreement</div>
      <FilterBar
        options={agreementFiltersWithIcon}
        inputName={"agreement"}
        onClicked={onFilterChangeHandler}
      />
      {isLicenser && (
        <AgreementTable
          agreements={licenserAgreements}
          endOfpage={licenserEndOfPage}
          noContent={noLicenserAgreement}
          fetchMoreContent={fetchMoreLicenserAgreement}
          fetching={fetchingLicenser}
          isLicenser={isLicenser}
          state={state}
          pageChangeHandler={showMoreLicenserAgreementHandler}
        />
      )}
      {!isLicenser && (
        <AgreementTable
          agreements={licensingAgreements}
          endOfpage={licensingEndOfPage}
          noContent={noLicensingAgreement}
          fetchMoreContent={fetchMoreLicensingAgreement}
          fetching={fetchingLicensing}
          isLicenser={isLicenser}
          state={state}
          pageChangeHandler={showMoreLicensingAgreementHandler}
        />
      )}
    </div>
  );
};

const AgreementTable = (props: IAgreementTable) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Content</th>
            <th>Price</th>
            {/* To or From */}
            <th>{props.isLicenser ? "From" : "To"}</th>

            <th>Reason</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {props.fetching && (
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
                    <td>
                      <Skeleton />
                    </td>
                  </tr>
                ))}
            </>
          )}
          {props.agreements.map((agreement) => (
            <tr>
              <td className="no-wrap">
                <ContentPreviewComponent content={agreement.content} />
              </td>
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <EtherIcon />{" "}
                    <div className="ether-price">
                      {fromWei(agreement.price.toString(), props.state)}
                    </div>
                  </div>
                  <div className="fiat-price">{`($${(
                    Number(fromWei(agreement.price.toString(), props.state)) *
                    props.state.coinRate.ETHToUSD
                  ).toFixed(2)})`}</div>
                </div>
              </td>
              <td className="no-wrap">
                {props.isLicenser ? (
                  <Link to={`/profile/${agreement.licensee}`}>
                    {agreement.licensees.firstname +
                      " " +
                      agreement.licensees.lastname}
                  </Link>
                ) : (
                  <Link to={`/profile/${agreement.licenser}`}>
                    {agreement.licensers.firstname +
                      " " +
                      agreement.licensers.lastname}
                  </Link>
                )}
              </td>
              <td className="">
                <div>{agreement.purposeOfUse}</div>
              </td>
              <td className="no-wrap">
                <Link to="#">
                  <div>
                    {new Date(
                      Number(agreement.timestamp) * 1000
                    ).toDateString()}
                    <i className="las la-external-link-alt link-icon"></i>
                  </div>
                  <div>
                    {new Date(
                      Number(agreement.timestamp) * 1000
                    ).toLocaleTimeString()}
                  </div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationComponent
        fetching={props.fetching}
        noContent={props.noContent}
        noContentTitle={"No Agreement"}
        endOfPage={props.endOfpage}
        fetchMoreContent={props.fetchMoreContent}
        pageChangeHandler={props.pageChangeHandler}
      />
    </>
  );
};

interface IPaginationProps {
  fetching: boolean;
  noContent: boolean;
  noContentTitle: string;
  endOfPage: boolean;
  fetchMoreContent: boolean;
  pageChangeHandler: () => void;
}

const PaginationComponent = (props: IPaginationProps) => {
  return (
    <div>
      {!props.fetching && props.noContent ? (
        <div className="no-contents">{props.noContentTitle}</div>
      ) : (
        <div>
          <div className="btn-load-more-wrapper">
            {!props.endOfPage && !props.fetchMoreContent && !props.fetching && (
              <button
                className="btn-explore btn-load-more"
                onClick={props.pageChangeHandler}
              >
                Load more
              </button>
            )}
          </div>
          {props.endOfPage && (
            <div className="end-of-contents-text">You have reached the end</div>
          )}
        </div>
      )}
      {props.fetchMoreContent && (
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
