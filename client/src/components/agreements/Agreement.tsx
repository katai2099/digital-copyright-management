import moment from "moment";
import { getImageSrc } from "../../utils";
import { EtherIcon } from "../common/Icon";
import { Link } from "react-router-dom";
import { AgreementOption } from "../../model/Common";
import { useEffect, useState } from "react";
import { getAgreements } from "../../controllers/agreement";
import { Agreement } from "../../model/Agreement";
import { FilterBar } from "../filterBar/FilterBar";
import { agreementFiltersWithIcon } from "../../constant";

interface IAgreement {
  walletAddress: string;
}

export const AgreementComponent = ({ walletAddress }: IAgreement) => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [option, setOption] = useState<AgreementOption>(
    AgreementOption.LICENSER
  );
  useEffect(() => {
    getAgreements(walletAddress)
      .then((agreements) => {
        console.log(agreements);
        setAgreements(agreements);
      })
      .catch((error) => {
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
    <div>
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
          {(isLicenser ? licenser : licensing).map((agreement) => (
            <tr>
              <td className="no-wrap">
                <div className="content-img-wrapper">
                  <img
                    className="content-img"
                    src={getImageSrc(agreement.content)}
                    width="56px"
                    height="56px"
                    alt=""
                  />
                </div>
                <div className="content-name">{agreement.content.desc}</div>
              </td>
              <td>
                <div>
                  <div className="ether-price-wrapper">
                    <EtherIcon />{" "}
                    <div className="ether-price">{agreement.content.price}</div>
                  </div>
                  <div className="fiat-price">($10.00)</div>
                </div>
              </td>
              <td className="no-wrap">
                <a href={`/profile/${agreement.licensee}`}>
                  {agreement.licensees.firstname +
                    " " +
                    agreement.licensees.lastname}
                </a>
              </td>
              <td className="no-wrap">
                <div>{agreement.purposeOfUse}</div>
              </td>
              <td className="no-wrap">
                <Link to="#">
                  {moment(
                    new Date(Number(agreement.timestamp) * 1000)
                  ).fromNow()}
                  <i className="las la-external-link-alt"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
