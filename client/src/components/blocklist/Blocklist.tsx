import { useEffect, useState } from "react";
import { UseEth } from "../../contexts/UseEth";
import { CopyrightImage } from "../../model/CopyrightImage";
import { Contents } from "./Contents";

export const Blocklist = () => {
  const state = UseEth();
  const [images, setImages] = useState<any>([]);
  async function getBlockDetail() {
    const imageCount = await state.state.contract!.methods.imageCount().call();
    let tmpImages = [];
    for (let i = 0; i < imageCount; i++) {
      const imageDetail: CopyrightImage = await state.state
        .contract!.methods.images(i)
        .call();
      // console.log(imageDetail);
      tmpImages.push(imageDetail);
    }
    // console.log(tmpImages.length, " length of get request")
    setImages(tmpImages);
  }
  useEffect(() => {
    getBlockDetail();
  }, []);
  return (
    <div className="container">
      <Contents contents={images} />
    </div>
  );
};
