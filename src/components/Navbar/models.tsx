export interface INavList {
    label: string;
    href: string;
    subList?: {
        label: string;
        href: string;
    }[];
}

export const NavList: INavList[] = [
    { label: 'Browse Vehicles', href: '/new-vehicles-quincy-ma/' },
    { label: 'Sell/Trade ▼', href: '/sell-and-trade/' },
    { label: 'Financing', href: '/car-loans-in-quincy-ma' },
    { label: 'Schedule Service', href: 'https://service.yogaplugin.com/' },
    { label: 'Car Parts', href: 'https://quirkcarparts.com/' },
    {
        label: 'More ▼',
        href: '',
        subList: [
            { label: 'FAQ', href: '/faq/' },
            { label: 'About', href: '/about/' },
            { label: 'Careers', href: 'https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=FD8E2BBFB93430E1320C9B1A37535D27' },
            { label: 'Shop Accessories', href: 'https://quirkcarparts.com/accessories/index/' },
            { label: 'Quirk Warranty', href: '/quirk-warranty/' },
            { label: 'Commercial', href: 'https://quirktrucks.worktrucksolutions.com/' },
            { label: 'Our Dealership', href: '/about-quirk-cars-in-quincy-ma/' },
            { label: 'Meet Daniel J. Quirk', href: '/meet-daniel-j-quirk/' },
            { label: 'Blogs', href: '/blog/' }
        ]
    },
    { label: 'Contact', href: '/contact/' }
];

export const MobileNavList: INavList[] = [
    { label: "Browse Vehicles", href: "/new-vehicles-quincy-ma/" },
    { label: "Sell/Trade", href: "/sell-and-trade/" },
    { label: "Financing", href: "/car-loans-in-quincy-ma" },
    { label: "Schedule Service", href: "https://service.yogaplugin.com/" },
    { label: "Car Parts", href: "https://quirkcarparts.com/" },
    { label: "Shop Accessories", href: "https://quirkcarparts.com/accessories/index/" },
    { label: "FAQ", href: "/faq/" },
    { label: "About", href: "/about/" },
    { label: "Careers", href: "https://www.paycomonline.net/v4/ats/web.php/jobs?clientkey=FD8E2BBFB93430E1320C9B1A37535D27" },
    { label: "Quirk Warranty", href: "/quirk-warranty/" },
    { label: "Commercial", href: "https://quirktrucks.worktrucksolutions.com/" },
    { label: "Our Dealership", href: "/about-quirk-cars-in-quincy-ma/" },
    { label: "Meet Daniel J. Quirk", href: "/meet-daniel-j-quirk/" },
    { label: "Contact", href: "/contact/" },
    { label: "Blogs", href: "/blog/" }
];
