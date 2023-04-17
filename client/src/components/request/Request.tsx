import { useEffect, useState } from "react";
import { EtherIcon } from "../common/Icon";
import "./request.css";
import { UseDcm } from "../../contexts/UseDcm";
import { Request, RequestType } from "../../model/Request";
import {
  approveRequest,
  getLicenserRequests,
  getLicensingRequests,
  rejectAgreement,
} from "../../controllers/request";
import { ContentPreviewComponent } from "../eventTable/EventTable";
import React from "react";
import { FilterBar } from "../filterBar/FilterBar";
import { agreementFiltersWithIcon } from "../../constant";
import { UserType } from "../../model/User";
import { fromWei, handleError } from "../../utils";
import { Modal } from "../common/Modal";
import { ApproveRequestBody, RejectRequestBody } from "../common/Common";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export const RequestComponent = () => {
  const { state, dispatch } = UseDcm();
  const [activeRowIndex, setActiveRowIndex] = useState(-1);
  const [licenserRequest, setLicenserRequest] = useState<Request[]>([]);
  const [licensingRequest, setLicensingRequest] = useState<Request[]>([]);
  const [contractBalance, setContractBalance] = useState<string>("");
  const [userType, setUserType] = useState<UserType>(UserType.LICENSER);
  const [showOption, setShowOption] = useState<string>("Pending");
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [processRequestIndex, setProcessRequestIndex] = useState<number>(0);
  const [processingRequestId, setProssessingRequestId] = useState<number>(0);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [errorTextArea, setErrorTextArea] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //pagination
  const [fetchingLicenser, setFetchingLicenser] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [endOfPage, setEndOfPage] = useState<boolean>(false);
  const [fetchMoreContent, setFetchMoreContent] = useState<boolean>(false);
  const [noRequest, setNoRequest] = useState<boolean>(false);

  const pageChangeHandler = () => {
    setFetchMoreContent(true);
    setPage((oldValue) => oldValue + 1);
  };

  const resetFilter = () => {
    setPage(1);
    setEndOfPage(false);
    setNoRequest(false);
    if (userType === UserType.LICENSER) {
      setLicenserRequest([]);
    } else {
      setLicensingRequest([]);
    }
  };

  useEffect(() => {
    if (userType === UserType.LICENSER) {
      if (page === 1) setFetchingLicenser(true);
      getLicenserRequests(state.web3State.account, page, showOption)
        .then((newRequests) => {
          setFetchingLicenser(false);
          if (page === 1 && newRequests.length === 0) {
            setNoRequest(true);
          }
          if (page !== 1) {
            setLicenserRequest((prevRequest) => [
              ...prevRequest,
              ...newRequests,
            ]);
          } else {
            setLicenserRequest(newRequests);
          }
          if (page !== 1 && newRequests.length === 0) {
            setEndOfPage(true);
          }
          setFetchMoreContent(false);
        })
        .catch((error) => {
          setFetchingLicenser(false);
          setFetchMoreContent(false);
          console.log(error);
        });
    }
  }, [page, showOption, state.web3State.account, userType]);

  useEffect(() => {
    if (userType === UserType.LICENSING) {
      if (page === 1) setFetchingLicenser(true);
      getLicensingRequests(state.web3State.account, page, showOption)
        .then((newRequests) => {
          setFetchingLicenser(false);
          if (page === 1 && newRequests.length === 0) {
            setNoRequest(true);
          }
          if (page !== 1) {
            setLicensingRequest((prevRequest) => [
              ...prevRequest,
              ...newRequests,
            ]);
          } else {
            setLicensingRequest(newRequests);
          }
          if (page !== 1 && newRequests.length === 0) {
            setEndOfPage(true);
          }
          setFetchMoreContent(false);
        })
        .catch((error) => {
          setFetchingLicenser(false);
          console.log(error);
        });
    }
  }, [page, showOption, state.web3State.account, userType]);

  useEffect(() => {
    state.web3State.contract?.methods
      .balances(state.web3State.account)
      .call()
      .then((res: any) => {
        setContractBalance(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, [state, state.web3State.account, state.web3State.contract?.methods]);

  const handlerUserTypeChange = (type: string) => {
    const newType = type as UserType;
    if (newType !== userType) {
      console.log(newType);
      setUserType(newType);
      resetFilter();
    }
    if (newType === UserType.LICENSER) {
      setShowOption("Pending");
      setLicensingRequest([]);
    } else {
      setShowOption("all");
      setLicenserRequest([]);
    }
  };

  const handleRowClick = (index: number) => {
    setActiveRowIndex(activeRowIndex === index ? -1 : index);
  };

  const approveRequestHandler = (requestId: number, currentIndex: number) => {
    setModalOpen(true);
    setProcessRequestIndex(currentIndex);
    setProssessingRequestId(requestId);
    setIsApprove(true);
  };

  const rejectRequestHandler = (requestId: number, currentIndex: number) => {
    setModalOpen(true);
    setProcessRequestIndex(currentIndex);
    setProssessingRequestId(requestId);
    setIsApprove(false);
  };

  const rejectHandler = () => {
    if (rejectReason === "") {
      setErrorTextArea(true);
      return;
    }
    setModalOpen(false);

    rejectAgreement(
      processingRequestId,
      rejectReason,
      state.web3State,
      dispatch
    )
      .then((req) => {
        toast.success("Reject successfully");
        licenserRequest[processRequestIndex].requestType = req.requestType;
        licenserRequest[processRequestIndex].rejectReason = req.rejectReason;
        setLicenserRequest(licenserRequest);
        setRejectReason("");
      })
      .catch((err) => {
        handleError(err);
        console.log(err);
      });
  };

  const approveHandler = () => {
    setModalOpen(false);

    approveRequest(processingRequestId, state.web3State, dispatch)
      .then((req) => {
        toast.success("Approve successfully");
        licenserRequest[processRequestIndex].requestType = req.requestType;
        setLicenserRequest(licenserRequest);
      })
      .catch((err) => {
        handleError(err);
        console.log(err);
      });
  };

  const isLicenser = userType === UserType.LICENSER;

  const filteredLicenserRequests =
    showOption === "all"
      ? licenserRequest
      : licenserRequest.filter((request) => request.requestType === showOption);
  const filteredLicensingRequests =
    showOption === "all"
      ? licensingRequest
      : licensingRequest.filter(
          (request) => request.requestType === showOption
        );

  return (
    state.web3State.web3 && (
      <div className="request-component">
        <div className="setting-header">Request</div>
        <Modal
          title={
            isApprove ? "You are about to Accept" : "You are about to Reject"
          }
          confirmTitle={"Understood"}
          onConfirm={isApprove ? approveHandler : rejectHandler}
          open={modalOpen}
          onClose={() => {
            setRejectReason("");
            setErrorTextArea(false);
            setModalOpen(false);
          }}
          extraZ={true}
        >
          {filteredLicenserRequests.length !== 0 &&
            (isApprove ? (
              <ApproveRequestBody
                price={fromWei(
                  filteredLicenserRequests[
                    processRequestIndex
                  ].price.toString(),
                  state
                )}
              />
            ) : (
              <RejectRequestBody
                price={fromWei(
                  filteredLicenserRequests[
                    processRequestIndex
                  ].price.toString(),
                  state
                )}
                onChanged={(text) => {
                  if (text !== "" && errorTextArea) {
                    setErrorTextArea(false);
                  }
                  setRejectReason(text);
                }}
                error={errorTextArea}
              />
            ))}
        </Modal>

        <FilterBar
          options={agreementFiltersWithIcon}
          inputName={"user-type"}
          onClicked={(type) => {
            handlerUserTypeChange(type);
          }}
        />
        <div className="request-header-section">
          <div
            onClick={() => {
              console.log(licenserRequest);
              console.log(licensingRequest);
            }}
          >
            Contract Balances:{" "}
          </div>
          <div className="ether-price-wrapper">
            <EtherIcon />{" "}
            <div className="ether-price">{fromWei(contractBalance, state)}</div>
          </div>
        </div>
        <div className="request-table-section">
          <table className="table-with-accordion">
            <thead>
              <tr>
                <th className="table-name" colSpan={2}>
                  Requests
                </th>
                <th colSpan={6}>
                  <div className="request-filter">
                    <div>Show</div>
                    <div className="col-sm-6">
                      <select
                        className="form-select"
                        onChange={(event) => {
                          setShowOption(event.currentTarget.value);
                          resetFilter();
                        }}
                        value={showOption}
                      >
                        <option value={"all"}>All Request</option>
                        <option value={"Pending"}>Pending</option>
                        <option value={"Rejected"}>Rejected</option>
                        <option value={"Approved"}>Approved</option>
                      </select>
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th>{isLicenser ? "From" : "To"}</th>
                <th>Content</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fetchingLicenser && (
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
                        <td colSpan={3}>
                          <Skeleton />
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {(isLicenser
                ? filteredLicenserRequests
                : filteredLicensingRequests
              ).map((request, idx) => {
                const content = request.content;
                const licensee = request.licensees;
                const disabledButton =
                  request.requestType !== RequestType.PENDING ||
                  (request.requestType === RequestType.PENDING &&
                    request.licensee === state.web3State.account);
                const fullname = isLicenser
                  ? `${licensee.firstname} ${licensee.lastname}`
                  : `${request.content.owner.firstname} ${request.content.owner.lastname}`;
                return (
                  <React.Fragment key={request.id}>
                    <tr key={idx} className="actived">
                      <td>{fullname}</td>
                      <td>
                        <ContentPreviewComponent content={content} />
                      </td>
                      <td>
                        <div className="ether-price-wrapper">
                          <EtherIcon />{" "}
                          <div className="ether-price">
                            {fromWei(content.price.toString(), state)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {new Date(
                            Number(request.timestamp) * 1000
                          ).toDateString()}
                        </div>
                        <div>
                          {new Date(
                            Number(request.timestamp) * 1000
                          ).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`request-status ${
                            request.requestType === RequestType.APPROVED
                              ? "accepted-status "
                              : request.requestType === RequestType.REJECTED
                              ? "rejected-status"
                              : "pending-status"
                          }`}
                        >
                          {request.requestType}
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <i
                            className="las la-ellipsis-v dropdown request-icon"
                            id="dropdownMenuLink"
                            data-bs-toggle="dropdown"
                            // aria-expanded="false"
                          ></i>
                          <div
                            className="dropdown-menu dropdown-menu-end ellipsis-options"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                approveRequestHandler(request.id, idx);
                              }}
                              disabled={disabledButton}
                            >
                              Approve
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                rejectRequestHandler(request.id, idx);
                              }}
                              disabled={disabledButton}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </td>

                      <td
                        className="accordion-toggle"
                        onClick={() => {
                          handleRowClick(idx);
                        }}
                      >
                        {activeRowIndex === idx ? (
                          <span>
                            <i className="las la-angle-up"></i>
                          </span>
                        ) : (
                          <span>
                            <i className="las la-angle-down"></i>
                          </span>
                        )}
                      </td>
                    </tr>
                    {activeRowIndex === idx && (
                      <tr className="">
                        <td colSpan={7} className="accordion-details">
                          <div className="actions-row">
                            <div>
                              <div>{`Reason of use: ${request.purposeOfUse}`}</div>
                              <div>{`Field of use: ${request.fieldOfUse}`}</div>
                              {request.requestType === RequestType.REJECTED && (
                                <div>{`Reject reason: ${request.rejectReason}`}</div>
                              )}
                            </div>
                            {request.requestType === RequestType.PENDING &&
                              state.web3State.account !== request.licensee && (
                                <div>
                                  <button
                                    className="btn  decision-btn reject-btn"
                                    onClick={() => {
                                      rejectRequestHandler(request.id, idx);
                                    }}
                                  >
                                    Reject
                                  </button>
                                  <button
                                    className="btn decision-btn"
                                    onClick={() => {
                                      approveRequestHandler(request.id, idx);
                                    }}
                                  >
                                    Approve
                                  </button>
                                </div>
                              )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {!fetchingLicenser && noRequest ? (
            <div className="no-contents">No requests</div>
          ) : (
            <div>
              <div className="btn-load-more-wrapper">
                {!endOfPage && !fetchMoreContent && !fetchingLicenser && (
                  <button
                    className="btn-explore btn-load-more"
                    onClick={pageChangeHandler}
                  >
                    Load more
                  </button>
                )}
              </div>
              {endOfPage && (
                <div className="end-of-contents-text">
                  You have reached the end
                </div>
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
      </div>
    )
  );
};
