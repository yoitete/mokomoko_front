import React from "react";
import Image from "next/image";
import blanketBlack from "@/public/images/blanket_black_1.png";
import blanketBeige from "@/public/images/blanket_beige_1.png";
import blanketGray from "@/public/images/blanket_gray_1.png";
import blanketPattern from "@/public/images/blanket_pattern_1.png";
import blanketLightGray from "@/public/images/blanket_lightgray_1.png";
import blanketBrown from "@/public/images/blanket_brown_1.png";
import blanketWhite2 from "@/public/images/blanket_white2_1.png";
import blanketWhite from "@/public/images/blanket_white_1.png";
import { SlideBox } from "@/components/SlideBox/SlideBox";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { BoxImage } from "@/components/BoxImage/BoxImage";

export default function Home() {
  return (
    <div>
      <div className="mt-10">
        <div className="mt-5 text-center text-2xl font-semibold">新着情報</div>
        <div className="flex justify-end mt-5">
          <SlideBox>
            <div className="flex flex-col gap-2">
              <p className="text-left text-lg font-semibold text-orange-600">
                New
              </p>

              <div className="flex gap-4">
                <Image
                  src={blanketBlack}
                  alt="black1"
                  height={118}
                  width={160}
                />
                <Image
                  src={blanketBeige}
                  alt="beige1"
                  height={118}
                  width={160}
                />
                <Image
                  src={blanketBlack}
                  alt="black2"
                  height={118}
                  width={160}
                />
                <Image src={blanketBeige} alt="beige2" />
                <Image src={blanketBlack} alt="black3" />
                <Image src={blanketBeige} alt="beige3" />
              </div>
            </div>
          </SlideBox>
        </div>
      </div>

      <div className="mt-8 text-center text-2xl font-semibold">
        人気ランキング
      </div>
      <div className="mt-5 ml-4 text-left font-semibold">春・夏☘️</div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="flex gap-4">
            <Image src={blanketGray} alt="gray1" height={118} width={160} />
            <Image
              src={blanketPattern}
              alt="pattern"
              height={118}
              width={160}
            />
            <Image src={blanketBeige} alt="beige3" height={118} width={160} />
            <Image
              src={blanketLightGray}
              alt="lightgray1"
              height={118}
              width={160}
            />
          </div>
        </SlideBox>
      </div>

      <div className="mt-5 ml-4 text-left font-semibold">秋・冬🍁</div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="flex gap-4">
            <Image src={blanketBlack} alt="black1" height={118} width={160} />
            <Image src={blanketBrown} alt="brown1" height={118} width={160} />
            <Image src={blanketWhite2} alt="White2" height={118} width={160} />
            <Image src={blanketWhite} alt="White" height={118} width={160} />
          </div>
        </SlideBox>
      </div>
      {/* https://tailwindcss.com/docs/font-size */}
      <div className="mt-10"></div>
      <div className="mt-5 mb-10 text-center text-2xl font-semibold">特集</div>
      <div className="mx-4 mb-5">
        <SimpleBox className="h-110 flex flex-col justify-start items-center p-4">
          <p className="text-center text-lg font-semibold mb-4">
            クリスマス特集
          </p>

          <div className="grid grid-cols-2 gap-2 w-full">
            <BoxImage src={blanketBeige} alt="beige1" />
            <BoxImage src={blanketBrown} alt="brown1" />
            <BoxImage src={blanketGray} alt="gray1" />
            <BoxImage src={blanketWhite} alt="navy1" />
          </div>
        </SimpleBox>
      </div>

      <div className="mx-4 mb-4">
        <SimpleBox className="h-110 flex flex-col justify-start items-center p-4">
          <div className="text-center font-semibold mb-4">
            <p>受験応援！</p>
            <p>あったか毛布特集</p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <BoxImage src={blanketBeige} alt="beige1" />
            <BoxImage src={blanketBrown} alt="brown1" />
            <BoxImage src={blanketGray} alt="gray1" />
            <BoxImage src={blanketWhite} alt="navy1" />
          </div>
        </SimpleBox>
      </div>
    </div>
  );
}
