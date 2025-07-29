import { Header } from "@/components/Header";
import { HeaderImageSlider } from "@/components/HeaderImageSlider";
import { Marquee } from "@/components/Marquee";
import { Menu } from "@/components/Menu";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 bg-[#dda700]">
      <div className="flex flex-col">
        <Header />
        <Menu />
      </div>

      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-[#f9e6b3] to-[#f3d27a] border-4 border-[#f3d27a] p-5 rounded-lg flex flex-col gap-2.5 max-w-[80%] text-center">
          <span className="italic text-xl text-[#4a2c00]">
            Olive oil and honey 🐝 are the gold of nature—pure, natural, and
            filled with life-enhancing properties.
          </span>

          <span className="text-2xl text-red-800 font-bold">
            Pure Organic Product ECO-System 100% (Healthy Living) (Medical Food
            care yours)
          </span>

          <span className="italic text-xl text-[#4a2c00]">
            (Medical Food care yours)
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <HeaderImageSlider />
      </div>

      <Marquee />
    </div>
  );
}
