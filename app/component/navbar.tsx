"use client";

import Link from 'next/link';

export function Navbar() {
    return (
        <div className="drawer fixed top-0 z-50 lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle lg:hidden" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-[#9EFFAA] w-full pl-10 pr-10 shadow-sm">
                    <Link href="/" className="mx-2 flex-1 px-2"> RMUTK </Link>
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg width="43" height="50" viewBox="0 0 43 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.375 10.417H5.39292M5.375 25.0003H5.39292M5.375 39.5837H5.39292M14.3333 10.417H37.625M14.3333 25.0003H37.625M14.3333 39.5837H37.625" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </label>
                    </div>
                    <div className="hidden flex-none lg:block">
                        <ul className="menu menu-horizontal px-5 gap-5">
                            <li><Link href="/">หน้าหลัก</Link></li>
                            <li><Link href="/">สั่งอาหาร</Link></li>
                            <li><Link href="/shop/login">สำหรับร้านค้า</Link></li>
                            <li className="bg-[#ADF38D] rounded-full w-20"><Link href="/customer/login" className="flex justify-center">Login</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="drawer-side lg:hidden">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4 gap-5">
                {/* Sidebar */}
                    <li><Link href="/">
                        <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                            <path d="M29.375 35.8752V22.2085C29.375 21.7554 29.1687 21.3209 28.8014 21.0005C28.4342 20.6802 27.936 20.5002 27.4167 20.5002H19.5833C19.064 20.5002 18.5658 20.6802 18.1986 21.0005C17.8313 21.3209 17.625 21.7554 17.625 22.2085V35.8752M5.875 17.0835C5.87486 16.5865 5.99903 16.0954 6.23883 15.6446C6.47864 15.1938 6.82831 14.794 7.26346 14.4732L20.9718 4.22317C21.6787 3.70197 22.5744 3.41602 23.5 3.41602C24.4256 3.41602 25.3213 3.70197 26.0282 4.22317L39.7365 14.4732C40.1717 14.794 40.5214 15.1938 40.7612 15.6446C41.001 16.0954 41.1251 16.5865 41.125 17.0835V32.4585C41.125 33.3647 40.7124 34.2337 39.9778 34.8744C39.2433 35.5152 38.2471 35.8752 37.2083 35.8752H9.79167C8.7529 35.8752 7.75668 35.5152 7.02217 34.8744C6.28765 34.2337 5.875 33.3647 5.875 32.4585V17.0835Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        หน้าหลัก</Link></li>
                    <li><Link href="/">
                        <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                            <path d="M5.875 3.41699V15.3753C5.875 17.2545 7.6375 18.792 9.79167 18.792H17.625C18.6638 18.792 19.66 18.432 20.3945 17.7913C21.129 17.1505 21.5417 16.2815 21.5417 15.3753V3.41699M13.7083 3.41699V37.5837M41.125 25.6253V3.41699C38.5281 3.41699 36.0375 4.31692 34.2012 5.91879C32.365 7.52066 31.3333 9.69327 31.3333 11.9587V22.2087C31.3333 24.0878 33.0958 25.6253 35.25 25.6253H41.125ZM41.125 25.6253V37.5837" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        สั่งอาหาร</Link>
                    </li>
                    <li><Link href="/shop/login">
                        <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                            <path d="M29.3749 35.8753V27.3337C29.3749 26.8806 29.1686 26.4461 28.8014 26.1257C28.4341 25.8053 27.936 25.6253 27.4166 25.6253H19.5833C19.0639 25.6253 18.5658 25.8053 18.1985 26.1257C17.8313 26.4461 17.6249 26.8806 17.6249 27.3337V35.8753M34.8074 17.6132C34.3991 17.2723 33.8558 17.082 33.2906 17.082C32.7255 17.082 32.1821 17.2723 31.7739 17.6132C30.8633 18.3709 29.6532 18.7936 28.3948 18.7936C27.1364 18.7936 25.9263 18.3709 25.0157 17.6132C24.6076 17.2728 24.0646 17.0828 23.4999 17.0828C22.9353 17.0828 22.3923 17.2728 21.9842 17.6132C21.0735 18.3714 19.863 18.7944 18.6041 18.7944C17.3452 18.7944 16.1347 18.3714 15.224 17.6132C14.8158 17.2723 14.2725 17.082 13.7073 17.082C13.1422 17.082 12.5988 17.2723 12.1906 17.6132C11.311 18.3455 10.1505 18.766 8.93509 18.7929C7.71966 18.8199 6.53621 18.4514 5.61509 17.7591C4.69397 17.0668 4.10108 16.1003 3.95183 15.0477C3.80259 13.9951 4.10765 12.9318 4.80766 12.0646L10.4653 4.91691C10.8243 4.45482 11.3075 4.0765 11.8729 3.81503C12.4382 3.55355 13.0684 3.41689 13.7083 3.41699H33.2916C33.9296 3.41678 34.558 3.55253 35.1222 3.81245C35.6864 4.07237 36.1692 4.44858 36.5287 4.90837L42.1981 12.0697C42.8983 12.9376 43.203 14.0018 43.0528 15.0549C42.9026 16.108 42.3083 17.0747 41.3857 17.7665C40.4632 18.4582 39.2784 18.8256 38.0623 18.797C36.8461 18.7683 35.6858 18.3457 34.8074 17.6115M7.83328 18.7066V32.4587C7.83328 33.3648 8.24593 34.2339 8.98045 34.8746C9.71496 35.5154 10.7112 35.8753 11.7499 35.8753H35.2499C36.2887 35.8753 37.2849 35.5154 38.0194 34.8746C38.754 34.2339 39.1666 33.3648 39.1666 32.4587V18.7066" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        สำหรับร้านค้า</Link>
                    </li>
                    <li>
                        <Link href="/customer/login">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="httwww.w3.org/2000/svg">
                            <path d="M11.2083 21.4167L18.5 14.125M18.5 14.125L11.2083 6.83333M18.5 14.125H1M18.5 1H24.3333C25.1069 1 25.8487 1.30729 26.3957 1.85427C26.9427 2.40125 27.25 3.14312 27.25 3.91667V24.3333C27.25 25.1069 26.9427 25.8487 26.3957 26.3957C25.8487 26.9427 25.1069 27.25 24.3333 27.25H18.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Login</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}