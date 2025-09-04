import { BoxImage } from "@/components/BoxImage/BoxImage";
import blanketBeige from "@/public/images/blanket_beige_1.png";
import blanketBrown from "@/public/images/blanket_brown_1.png";
import blanketGray from "@/public/images/blanket_gray_1.png";
import blanketWhite from "@/public/images/blanket_white_1.png";
import blanketBlack from "@/public/images/blanket_black_1.png";
import blanketPattern from "@/public/images/blanket_pattern_1.png";
import blanketLightGray from "@/public/images/blanket_lightgray_1.png";
import React from "react";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Search() {
  const boxes = [
    [blanketBeige],
    [blanketBrown],
    [blanketGray],
    [blanketWhite],
    [blanketBlack],
    [blanketPattern],
    [blanketLightGray],
  ];

  return (
    <div className="mt-5 mb-5">
      <div className="mt-5 ml-7 text-left font-semibold">検 索</div>

      {/* テキスト */}
      <input
        type="text"
        className="bg-white p-3 border min-w-[430px] ml-6 mt-3 flex items-center justify-start rounded-xl"
        placeholder="テキストを入力"
      />

      <div className="mr-6 mt-2 flex justify-end">
        <div className="flex items-center gap-2 text-sm text-black">
          <FontAwesomeIcon
            icon={faList}
            size="lg"
            className="mt-3 cursor-pointer text-black"
          />
          <p className="mt-3">並べ替え：</p>
          <p className="mt-3">新着順 / 人気順</p>
        </div>
      </div>
      <div className="mt-2 flex justify-center">
        <div className="mt-2 space-y-4">
          {boxes.map((images, index) => (
            <SimpleBox
              key={index}
              className="h-40 flex flex-col justify-center items-center p-4 min-w-[430px]"
            >
              <div className="grid grid-cols-2 gap-2 w-full">
                {images.map((src, i) => (
                  <BoxImage
                    key={i}
                    src={src}
                    alt={`box${index + 1}-img${i + 1}`}
                  />
                ))}
              </div>
            </SimpleBox>
          ))}
        </div>
      </div>
    </div>
  );
}
