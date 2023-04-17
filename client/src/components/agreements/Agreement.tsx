import "./agreement.css";
import { EtherIcon } from "../common/Icon";
import { Link } from "react-router-dom";
import { AgreementOption } from "../../model/Common";
import { useEffect, useState } from "react";
import { getAgreements } from "../../controllers/agreement";
import { Agreement } from "../../model/Agreement";
import { FilterBar } from "../filterBar/FilterBar";
import { agreementFiltersWithIcon } from "../../constant";
import { ContentPreviewComponent } from "../eventTable/EventTable";
import { UseDcm } from "../../contexts/UseDcm";
import { fromWei } from "../../utils";
import Skeleton from "react-loading-skeleton";

interface IAgreement {
  walletAddress: string;
}

export const AgreementComponent = ({ walletAddress }: IAgreement) => {
  const { state } = UseDcm();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [option, setOption] = useState<AgreementOption>(
    AgreementOption.LICENSER
  );
  const [fetching, setFetching] = useState<boolean>(false);
  useEffect(() => {
    setFetching(true);
    getAgreements(walletAddress)
      .then((agreements) => {
        console.log(agreements);
        setAgreements(agreements);
        setFetching(false);
      })
      .catch((error) => {
        setFetching(false);
        console.log(error);
      });
  }, [walletAddress]);

  const onFilterChangeHandler = (selected: string) => {
    const selectedOption = selected as AgreementOption;
    if (option !== selectedOption) {
      setOption(selectedOption);
    }
  };

  const isLicenser = option === AgreementOption.LICENSER;

  const licensing = agreements.filter(
    (agreement) => agreement.licensee === walletAddress
  );
  const licenser = agreements.filter(
    (agreement) => agreement.licenser === walletAddress
  );

  return (
    <div className="agreement-component">
      <div className="setting-header">Agreement</div>
      <FilterBar
        options={agreementFiltersWithIcon}
        inputName={"agreement"}
        onClicked={onFilterChangeHandler}
      />
      <table>
        <thead>
          <tr>
            <th>Content</th>
            <th>Price</th>
            {/* To or From */}
            <th>{isLicenser ? "From" : "To"}</th>
            <th>Reason</th>
            <th>Date</th>
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
                    <td>
                      <Skeleton />
                    </td>
                  </tr>
                ))}
            </>
          )}
          {(isLicenser ? licenser : licensing).map((agreement) => (
            <tr>
              <td className="no-wrap">
                <ContentPreviewComponent content={agreement.content} />
              </td>
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <EtherIcon />{" "}
                    <div className="ether-price">
                      {fromWei(agreement.price.toString(), state)}
                    </div>
                  </div>
                  <div className="fiat-price">{`($${(
                    Number(fromWei(agreement.price.toString(), state)) *
                    state.coinRate.ETHToUSD
                  ).toFixed(2)})`}</div>
                </div>
              </td>
              <td className="no-wrap">
                {isLicenser ? (
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
    </div>
  );
};
