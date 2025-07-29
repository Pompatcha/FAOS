"use client";

import { FC } from "react";

const Marquee: FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-blue-100 py-2 border-2 border-blue-300">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-sm text-blue-800 font-medium px-4">
          Dear customer, we are acceptable an order via Line official and
          What&apos;s app (add) me +6689 693 1668; Payment Online development is
          on process. acceptable by credit card. Click Here
        </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export { Marquee };
