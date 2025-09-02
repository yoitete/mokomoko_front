import { BoxImage } from "@/components/BoxImage/BoxImage";
import blanketBeige from "@/public/images/blanket_beige_1.png";
import blanketBrown from "@/public/images/blanket_brown_1.png";
import blanketWhite from "@/public/images/blanket_white_1.png";
import blanketBlack from "@/public/images/blanket_black_1.png";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";

export default function favorite() {
  const boxes = [
    [blanketBeige],
    [blanketBrown],
    [blanketWhite],
    [blanketBlack],
  ];

  return (
    <div className="mt-10">
      <div className="mt-5 text-center text-2xl font-semibold">お気に入り</div>
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
