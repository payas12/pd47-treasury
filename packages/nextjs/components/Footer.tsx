import React from "react";
import Link from "next/link";
import { useFetchNativeCurrencyPrice } from "@scaffold-ui/hooks";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Site footer
 */
export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const { price: nativeCurrencyPrice } = useFetchNativeCurrencyPrice();

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 bg-white">
      <div>
        {/* --- FLOATING TOOLS (KEEPING THESE FOR TESTING) --- */}
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto border-black rounded-none">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal gap-1 border-black rounded-none">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
          {/* We hide the switch theme button since we forced white mode, but keep the space if needed */}
          <div className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`}></div>
        </div>
      </div>

      {/* --- LUXURY BRANDING SECTION (REPLACED THE FORK ME TEXT) --- */}
      <div className="w-full border-t border-black mt-8 pt-6 pb-2">
        <ul className="menu menu-horizontal w-full p-0">
          <div className="flex flex-col justify-center items-center gap-1 text-sm w-full">
            
            {/* BRAND NAME */}
            <span className="font-serif text-2xl font-bold uppercase tracking-[0.2em] text-black">
              PD 47
            </span>
            
            {/* TAGLINE */}
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-1">
              MNEE Genesis Collection
            </span>

            {/* COPYRIGHT */}
            <p className="m-0 text-[10px] uppercase tracking-wider text-gray-400 mt-4">
               © 2026 PD 47 Atelier. All Rights Reserved.
            </p>
          </div>
        </ul>
      </div>
    </div>
  );
};