import { CopyrightImage } from "../../model/CopyrightImage";
import { ContentDetail } from "./ContentDetail";

interface ContentsProps {
  contents: CopyrightImage[];
}

export const Contents = (images: ContentsProps) => {
  const { contents } = images;

  let render = contents.map((image, idx) => {
    return <ContentDetail key={idx} copyrightImage={image} />;
  });

  return <div className="blocklist-container">{render}</div>;
};
