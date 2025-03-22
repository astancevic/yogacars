import React, { useState } from "react";
import { NavList, MobileNavList} from "./models.tsx";
import type { INavList } from "./models.tsx";
import logo from "@/assets/images/svg/QuirkLogo.svg?url";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative mx-auto w-full">
            <nav className="mx-auto flex items-center gap-12 px-5">
                <a href="/" aria-label="yoga-cars" className="mr-10 w-1/2 sm:w-fit lg:mr-20">
                    <img src={logo} alt="Yoga Cars Logo" className="h-10" />
                </a>
                <div className="hidden w-full items-center justify-between xl:flex">
                    <Listing NavData={NavList} sliceStart={0} sliceEnd={5} />
                    <div className="flex items-center gap-12">
                        <Listing NavData={NavList} sliceStart={5} />
                    </div>
                </div>
                <button className="ml-auto h-10 w-10 xl:hidden text-2xl" onClick={() => setOpen(!open)}>
                    ☰
                </button>
            </nav>
            {open && (
                <div className="fixed right-0 top-0 z-50 h-screen w-full bg-gray-400 xl:hidden">
                    <div className="w-full overflow-y-auto xl:hidden">
                        <div className="flex items-center justify-between px-5 pt-5">
                            <a href="/" aria-label="yoga-cars" className="mr-10 w-1/2 sm:w-fit lg:mr-20">
                                <img src='/assets/images/svg/QuirkLogo.svg' alt="Yoga Cars Logo" className="h-10" />
                            </a>
                            <button className="ml-auto h-10 w-10 text-2xl" onClick={() => setOpen(!open)}>
                                ✖
                            </button>
                        </div>
                        <Listing setOpen={setOpen} NavData={MobileNavList} />
                    </div>
                </div>
            )}
        </div>
    );
}

interface ListingProps {
    NavData: INavList[];
    sliceStart?: number;
    sliceEnd?: number;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Listing({ sliceStart, sliceEnd, setOpen, NavData }: ListingProps) {
    return (
        <div className="mt-10 flex flex-col gap-x-12 px-5 xl:mt-0 xl:flex-row xl:gap-y-5 xl:px-0">
            {NavData.slice(sliceStart, sliceEnd).map((item, index) => (
                <div key={index} className="group relative">
                    <div className={`min-w-12 hover:text-primary`}>
                        <a
                            href={item.href}
                            className="flex py-1 pr-12 text-base xl:py-0 xl:pr-0 xl:text-base"
                            onClick={() => item.href !== "" && setOpen && setOpen(false)}
                        >
                            {item.label}
                        </a>
                        {item.subList && (
                            <div className="absolute z-50 hidden w-44 animate-dropDownAnimation flex-col rounded-lg border bg-white p-2 drop-shadow-md group-hover:flex">
                                {item.subList.map((subItem, subIndex) => (
                                    <a
                                        key={subIndex}
                                        className="my-2 px-4 hover:text-primary"
                                        href={subItem.href}
                                        onClick={() => subItem.href !== "" && setOpen && setOpen(false)}
                                    >
                                        {subItem.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
