import React from "react";
import Image from "next/image";
import blanketBlack from "@/public/images/blanket_black_1.png";
import blanketBeige from "@/public/images/blanket_beige_1.png";
import { SlideBox } from "@/components/SlideBox/SlideBox";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";

export default function Home() {
  return (
    <div>
      <div className="mt-5 text-center">新着情報</div>
      <div className="flex justify-end mt-5">
        <SlideBox>
          <div className="flex gap-4">
            <Image src={blanketBlack} alt="black1" />
            <Image src={blanketBeige} alt="beige1" />
            <Image src={blanketBlack} alt="black2" />
            <Image src={blanketBeige} alt="beige2" />
            <Image src={blanketBlack} alt="black3" />
            <Image src={blanketBeige} alt="beige3" />
          </div>
        </SlideBox>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        人気ランキング
      </div>
      <div style={{ textAlign: "left", marginTop: "20px" }}></div>
      <SlideBox>{}</SlideBox>
      <SlideBox>{}</SlideBox>
      <div style={{ textAlign: "center", marginTop: "20px" }}>特集</div>
      <SlideBox>{}</SlideBox>
      <div style={{ textAlign: "center", marginTop: "20px" }}></div>
      <SimpleBox>{}受験応援！あったか毛布あったか毛布特集</SimpleBox>
    </div>
  );
}
