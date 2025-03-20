import React from 'react';
// Import SVGs correctly for React in Astro
// Option 1: Import as URL
import ReactLogoUrl from '/public/assets/images/svg/QuirkLogo.svg?url';
import FbIconUrl from '/public/assets/images/svg/Facebook.svg?url';
import InstagramIconUrl from '/public/assets/images/svg/Instagram.svg?url';
import TwitterIconUrl from '/public/assets/images/svg/Twitter.svg?url';

// OR Option 2: If you configured SVGR in your astro.config.mjs
// import ReactLogo from '/assets/images/svg/QuirkLogo.svg?react';
// import FbIcon from '/assets/images/svg/Facebook.svg?react';
// import InstagramIcon from '/assets/images/svg/Instagram.svg?react';
// import TwitterIcon from '/assets/images/svg/Twitter.svg?react';

const exploreList = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/new-vehicles-quincy-ma/' },
  { label: 'Sell/Trade', href: '/sell-and-trade/' }
  // { label: 'Dealer Tools', href: '' }
];

function Footer() {
  return (
      <div className="container mx-auto px-8 pt-11 lg:px-20">
        <div className="flex w-full flex-col items-start justify-between pb-6 md:flex-row">
          <div className="w-full basis-2/5 pb-6 md:pb-0">
            {/* Option 1: Use URL imports with <img> */}
            <img src={ReactLogoUrl} alt="Logo" />

            {/* OR Option 2: If using SVGR
          <ReactLogo />
          */}

            <p className="mt-7 w-full text-justify text-sm leading-7  md:text-base 2xl:w-5/6">
              QuirkCars is the fastest auto website providing fast and reliable search to consumers
              and customized software solutions for auto dealers.
            </p>
            <div className="mt-6  flex items-center">
              <a
                  aria-label="facebook"
                  href="https://www.facebook.com/QuirkCars/"
                  target="_blank"
                  rel="noreferrer"
              >
                <img src={FbIconUrl} alt="Facebook" />
                {/* OR Option 2: <FbIcon /> */}
              </a>
              <a
                  aria-label="instagram"
                  href="https://www.instagram.com/quirk_auto_dealers/"
                  target="_blank"
                  rel="noreferrer"
              >
                <img src={InstagramIconUrl} alt="Instagram" />
                {/* OR Option 2: <InstagramIcon /> */}
              </a>
              <a
                  aria-label="twitter"
                  href="https://twitter.com/QuirkCars"
                  target="_blank"
                  rel="noreferrer"
              >
                <img src={TwitterIconUrl} alt="Twitter" />
                {/* OR Option 2: <TwitterIcon /> */}
              </a>
            </div>
          </div>
          <div className="w-full basis-1/4 pb-6 md:pb-0">
            <h2 className="text-xl font-semibold md:text-3xl">Explore</h2>
            <ul className="text-sm md:text-base">
              {exploreList.map((item, index) => (
                  <li key={index} className="h-12 min-w-12">
                    <a
                        aria-label={item.label}
                        href={item.href}
                        className="block w-full py-5 hover:text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
              ))}
            </ul>
          </div>
          <div className="w-full basis-1/4 pb-6 md:pb-0">
            <h2 className="mb-5 text-xl font-semibold md:text-3xl">Contact Us</h2>
            <a
                aria-label="address"
                href="https://maps.app.goo.gl/KoRsv7DNbruP8MMu5"
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:text-primary md:text-base"
            >
              444 Quincy Ave, Braintree, MA 02184
            </a>
            {/* <a href="mailto:name@email.com" className="mt-3 text-sm hover:text-primary md:text-base">
            quirkcar@gmail.com
          </a> */}
            {/* <input
            placeholder="Enter Email Address"
            className="mt-8 w-5/6 rounded-md border-none bg-[#0000003d] py-2 text-center outline-0 placeholder:text-center placeholder:text-[#1e1e1e3d]"
            type="text"
          />
          <button
            className="mt-2 w-5/6 rounded bg-[#00B543] px-7 py-2 pt-2 text-base font-semibold text-white outline-none"
          >
            Subscribe
          </button> */}
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full border-[1px] border-solid border-b-black"></div>
          <p className="pb-8 pt-5 text-center text-sm font-normal md:text-base">
            Copyright © 2022. All rights reserved. Privacy Policy
          </p>
        </div>
      </div>
  );
}

export default Footer;