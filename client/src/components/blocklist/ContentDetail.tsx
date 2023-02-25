import { CopyrightImage } from "../../model/CopyrightImage";

interface ContentDetailProps {
  copyrightImage: CopyrightImage;
  displayButton?: boolean;
}

export const ContentDetail = (props: ContentDetailProps) => {
  const { copyrightImage, displayButton = false } = props;
  return (
    <div className="content-detail card">
      <div className="img-container">
      <img
        className="card-img-top"
        // src={`https://ipfs.io/ipfs/${copyrightImage.IPFSAddress}`}
        src="./img/icons8-cubes-64.png"
        alt="content"
        />
        </div>
      <div className="card-body">
        <h4 className="card-title">{"copyrightImage.imageTitle"}</h4>
        <h5>owner name</h5>
        <p>{"copyrightImage.ownerName"}</p>
        <h5>owner email</h5>
        <p>{"copyrightImage.ownerEmail"}</p>
        <h5>owner ETH address</h5>
        <p>{"copyrightImage.ownerAddress"}</p>
        {displayButton && <button className="btn btn-primary">Download</button>}
      </div>
    </div>
  );
};
