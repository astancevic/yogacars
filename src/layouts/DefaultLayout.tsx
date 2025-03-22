import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import {type PropsWithChildren, useState} from "react";

export default function DefaultLayout(props: PropsWithChildren) {
    const [isNavbar, setIsNavbar] = useState(false);

    return (
        <div className="w-full" onClick={() => isNavbar && setIsNavbar(false)}>
            {/* Give the navbar a high z-index and relative position */}
            <div className={`mx-auto w-full bg-pure-gray-400 py-5 relative z-50`}>
                <Navbar />
            </div>
            <div className={`m-auto max-w-[2560px]`}>
                {props.children}
            </div>
            <div className={`mt-10 w-full bg-[#F2F5FB] pt-10 shadow-[rgba(0,_0,_0,_0.2)_2px_0px_4px]`}>
                <Footer />
            </div>
        </div>
    );
}