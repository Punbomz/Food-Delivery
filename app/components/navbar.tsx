"use client"

import Link from 'next/link';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import AlertModal from "../components/AlertModal";
import { useAlertModal } from "../hooks/useAlertModal";
import ConfirmModal from './ConfirmModal';
import { useConfirmModal } from "../hooks/useConfirmModal";

interface User {
    name: string;
    role: string;
    pic: string;
    [key: string]: any;
}

export function Navbar() {
    const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

    const { 
        isOpen: isConfirmOpen, 
        message: confirmMessage,
        title: confirmTitle,
        confirmText,
        cancelText,
        showConfirm, 
        handleConfirm, 
        handleCancel 
    } = useConfirmModal();

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch("/api/auth/check", {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setRole(data.user.role);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        showConfirm(
        "ยืนยันการออกจากระบบ?",
        async () => {
            setLoading(true);
            try {
            const res = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                setUser(null);
                showAlert("ออกจากระบบสำเร็จ!", "/");
            }
            } catch (error) {
            console.error("Logout failed:", error);
            showAlert("เกิดข้อผิดพลาดในการออกจากระบบ");
            }

            setLoading(false);
        },
        {
            title: "ออกจากระบบ",
            confirmText: "ยืนยัน",
            cancelText: "ยกเลิก"
        }
        );
    };

    return (
        <>
        
        <AlertModal
            isOpen={isOpen}
            message={message}
            navigateTo={navigateTo}
            onClose={closeAlert}
        />

        <ConfirmModal
            isOpen={isConfirmOpen}
            title={confirmTitle}
            message={confirmMessage}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
        
        <div className="drawer fixed top-0 z-50 lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle lg:hidden" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-[#9EFFAA] w-full pl-10 pr-10 shadow-sm flex">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                        </label>
                    </div>
                    
                    <div className="flex flex-1 items-center gap-3">
                        { user ? (
                            <Link href="/" className="mx-2 px-2 whitespace-nowrap md:hidden">
                                <img src="/RMUTK_Logo.png" className='w-20' />
                            </Link>
                        ) : (
                            <Link href="/" className="mx-2 px-2 whitespace-nowrap">
                                <img src="/RMUTK_Logo.png" className='w-20' />
                            </Link>
                        )}
                        { !user ? (
                            <>
                                <label className="hidden sm:flex input items-center gap-2 flex-none">
                                    <svg
                                    className="h-[1em] opacity-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    >
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </g>
                                    </svg>

                                    <input type="search" required placeholder="Search" />
                                </label>
                            </>
                        ) : role === "shop" && (
                            <>
                            <div className='hidden md:flex items-center gap-3'>
                                <Link href="/shop" className="avatar p-2">
                                    <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                                        <img src={ user.pic !== "" ? (user.pic) : ("/profile.jpg")} />
                                    </div>
                                </Link>
                                <div className='bg-white rounded-full flex text-xl p-2'>{user.name}</div>
                            </div>
                            </>
                        )}
                    </div>
                    <div className="hidden flex-none lg:block">
                        <ul className="menu menu-horizontal px-5 gap-5">
                            { !user && (
                                <>
                                    <li><Link href="/" >หน้าหลัก</Link></li>
                                    <li><Link href="/">สั่งอาหาร</Link></li>
                                    <li><Link href="/login/shop">สำหรับร้านค้า</Link></li>
                                </>
                            )}
                            { loading ? (
                                <li className="w-20 flex justify-center">
                                    <span className="loading loading-spinner loading-sm"></span>
                                </li>
                                ) : user ? (
                                <li className="btn btn-error rounded-full w-20">
                                    <div
                                    onClick={handleLogout}
                                    className="flex justify-center cursor-pointer"
                                    >
                                    Logout
                                    </div>
                                </li>
                                ) : (
                                <li className="btn bg-[#ADF38D] rounded-full w-20">
                                    <Link href="/customer/login" className="flex justify-center">
                                    Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="drawer-side lg:hidden h-full">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4 gap-5">
                {/* Sidebar */}
                    { !user && (
                        <>
                            <li><Link href="/" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left ${pathname==="/" ? "btn-active" : ""}`}>
                                <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M29.375 35.8752V22.2085C29.375 21.7554 29.1687 21.3209 28.8014 21.0005C28.4342 20.6802 27.936 20.5002 27.4167 20.5002H19.5833C19.064 20.5002 18.5658 20.6802 18.1986 21.0005C17.8313 21.3209 17.625 21.7554 17.625 22.2085V35.8752M5.875 17.0835C5.87486 16.5865 5.99903 16.0954 6.23883 15.6446C6.47864 15.1938 6.82831 14.794 7.26346 14.4732L20.9718 4.22317C21.6787 3.70197 22.5744 3.41602 23.5 3.41602C24.4256 3.41602 25.3213 3.70197 26.0282 4.22317L39.7365 14.4732C40.1717 14.794 40.5214 15.1938 40.7612 15.6446C41.001 16.0954 41.1251 16.5865 41.125 17.0835V32.4585C41.125 33.3647 40.7124 34.2337 39.9778 34.8744C39.2433 35.5152 38.2471 35.8752 37.2083 35.8752H9.79167C8.7529 35.8752 7.75668 35.5152 7.02217 34.8744C6.28765 34.2337 5.875 33.3647 5.875 32.4585V17.0835Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                หน้าหลัก</Link></li>
                            <li><Link href="/" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left`}>
                                <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M5.875 3.41699V15.3753C5.875 17.2545 7.6375 18.792 9.79167 18.792H17.625C18.6638 18.792 19.66 18.432 20.3945 17.7913C21.129 17.1505 21.5417 16.2815 21.5417 15.3753V3.41699M13.7083 3.41699V37.5837M41.125 25.6253V3.41699C38.5281 3.41699 36.0375 4.31692 34.2012 5.91879C32.365 7.52066 31.3333 9.69327 31.3333 11.9587V22.2087C31.3333 24.0878 33.0958 25.6253 35.25 25.6253H41.125ZM41.125 25.6253V37.5837" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                สั่งอาหาร</Link>
                            </li>
                            <li><Link href="/login/shop" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left`}>
                                <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M29.3749 35.8753V27.3337C29.3749 26.8806 29.1686 26.4461 28.8014 26.1257C28.4341 25.8053 27.936 25.6253 27.4166 25.6253H19.5833C19.0639 25.6253 18.5658 25.8053 18.1985 26.1257C17.8313 26.4461 17.6249 26.8806 17.6249 27.3337V35.8753M34.8074 17.6132C34.3991 17.2723 33.8558 17.082 33.2906 17.082C32.7255 17.082 32.1821 17.2723 31.7739 17.6132C30.8633 18.3709 29.6532 18.7936 28.3948 18.7936C27.1364 18.7936 25.9263 18.3709 25.0157 17.6132C24.6076 17.2728 24.0646 17.0828 23.4999 17.0828C22.9353 17.0828 22.3923 17.2728 21.9842 17.6132C21.0735 18.3714 19.863 18.7944 18.6041 18.7944C17.3452 18.7944 16.1347 18.3714 15.224 17.6132C14.8158 17.2723 14.2725 17.082 13.7073 17.082C13.1422 17.082 12.5988 17.2723 12.1906 17.6132C11.311 18.3455 10.1505 18.766 8.93509 18.7929C7.71966 18.8199 6.53621 18.4514 5.61509 17.7591C4.69397 17.0668 4.10108 16.1003 3.95183 15.0477C3.80259 13.9951 4.10765 12.9318 4.80766 12.0646L10.4653 4.91691C10.8243 4.45482 11.3075 4.0765 11.8729 3.81503C12.4382 3.55355 13.0684 3.41689 13.7083 3.41699H33.2916C33.9296 3.41678 34.558 3.55253 35.1222 3.81245C35.6864 4.07237 36.1692 4.44858 36.5287 4.90837L42.1981 12.0697C42.8983 12.9376 43.203 14.0018 43.0528 15.0549C42.9026 16.108 42.3083 17.0747 41.3857 17.7665C40.4632 18.4582 39.2784 18.8256 38.0623 18.797C36.8461 18.7683 35.6858 18.3457 34.8074 17.6115M7.83328 18.7066V32.4587C7.83328 33.3648 8.24593 34.2339 8.98045 34.8746C9.71496 35.5154 10.7112 35.8753 11.7499 35.8753H35.2499C36.2887 35.8753 37.2849 35.5154 38.0194 34.8746C38.754 34.2339 39.1666 33.3648 39.1666 32.4587V18.7066" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                สำหรับร้านค้า</Link>
                            </li>
                        </>
                    )}
                    { role === "shop" && (
                        <>
                            <li><Link href="/shop/order" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left ${pathname==="/shop/order" ? "btn-active" : ""}`}>
                                <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M29.375 35.8752V22.2085C29.375 21.7554 29.1687 21.3209 28.8014 21.0005C28.4342 20.6802 27.936 20.5002 27.4167 20.5002H19.5833C19.064 20.5002 18.5658 20.6802 18.1986 21.0005C17.8313 21.3209 17.625 21.7554 17.625 22.2085V35.8752M5.875 17.0835C5.87486 16.5865 5.99903 16.0954 6.23883 15.6446C6.47864 15.1938 6.82831 14.794 7.26346 14.4732L20.9718 4.22317C21.6787 3.70197 22.5744 3.41602 23.5 3.41602C24.4256 3.41602 25.3213 3.70197 26.0282 4.22317L39.7365 14.4732C40.1717 14.794 40.5214 15.1938 40.7612 15.6446C41.001 16.0954 41.1251 16.5865 41.125 17.0835V32.4585C41.125 33.3647 40.7124 34.2337 39.9778 34.8744C39.2433 35.5152 38.2471 35.8752 37.2083 35.8752H9.79167C8.7529 35.8752 7.75668 35.5152 7.02217 34.8744C6.28765 34.2337 5.875 33.3647 5.875 32.4585V17.0835Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                คำสั่งซื้อ</Link>
                            </li>
                            <li><Link href="/shop/menu" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left ${pathname==="/shop/menu" ? "btn-active" : ""}`}>
                                <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M5.875 3.41699V15.3753C5.875 17.2545 7.6375 18.792 9.79167 18.792H17.625C18.6638 18.792 19.66 18.432 20.3945 17.7913C21.129 17.1505 21.5417 16.2815 21.5417 15.3753V3.41699M13.7083 3.41699V37.5837M41.125 25.6253V3.41699C38.5281 3.41699 36.0375 4.31692 34.2012 5.91879C32.365 7.52066 31.3333 9.69327 31.3333 11.9587V22.2087C31.3333 24.0878 33.0958 25.6253 35.25 25.6253H41.125ZM41.125 25.6253V37.5837" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                รายการอาหาร</Link>
                            </li>
                             <li><Link href="/shop" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left ${pathname==="/shop" ? "btn-active" : ""}`}>
                                <svg width="30" height="30" viewBox="0 0 47 41" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M29.3749 35.8753V27.3337C29.3749 26.8806 29.1686 26.4461 28.8014 26.1257C28.4341 25.8053 27.936 25.6253 27.4166 25.6253H19.5833C19.0639 25.6253 18.5658 25.8053 18.1985 26.1257C17.8313 26.4461 17.6249 26.8806 17.6249 27.3337V35.8753M34.8074 17.6132C34.3991 17.2723 33.8558 17.082 33.2906 17.082C32.7255 17.082 32.1821 17.2723 31.7739 17.6132C30.8633 18.3709 29.6532 18.7936 28.3948 18.7936C27.1364 18.7936 25.9263 18.3709 25.0157 17.6132C24.6076 17.2728 24.0646 17.0828 23.4999 17.0828C22.9353 17.0828 22.3923 17.2728 21.9842 17.6132C21.0735 18.3714 19.863 18.7944 18.6041 18.7944C17.3452 18.7944 16.1347 18.3714 15.224 17.6132C14.8158 17.2723 14.2725 17.082 13.7073 17.082C13.1422 17.082 12.5988 17.2723 12.1906 17.6132C11.311 18.3455 10.1505 18.766 8.93509 18.7929C7.71966 18.8199 6.53621 18.4514 5.61509 17.7591C4.69397 17.0668 4.10108 16.1003 3.95183 15.0477C3.80259 13.9951 4.10765 12.9318 4.80766 12.0646L10.4653 4.91691C10.8243 4.45482 11.3075 4.0765 11.8729 3.81503C12.4382 3.55355 13.0684 3.41689 13.7083 3.41699H33.2916C33.9296 3.41678 34.558 3.55253 35.1222 3.81245C35.6864 4.07237 36.1692 4.44858 36.5287 4.90837L42.1981 12.0697C42.8983 12.9376 43.203 14.0018 43.0528 15.0549C42.9026 16.108 42.3083 17.0747 41.3857 17.7665C40.4632 18.4582 39.2784 18.8256 38.0623 18.797C36.8461 18.7683 35.6858 18.3457 34.8074 17.6115M7.83328 18.7066V32.4587C7.83328 33.3648 8.24593 34.2339 8.98045 34.8746C9.71496 35.5154 10.7112 35.8753 11.7499 35.8753H35.2499C36.2887 35.8753 37.2849 35.5154 38.0194 34.8746C38.754 34.2339 39.1666 33.3648 39.1666 32.4587V18.7066" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                โปรไฟล์</Link>
                            </li>
                            <li><Link href="/shop/report" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left ${pathname==="/shop/report" ? "btn-active" : ""}`}>
                                <svg width="25" height="25" viewBox="0 0 407 407" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <rect width="407" height="407" fill="url(#pattern0_1164_85)"/>
                                    <defs>
                                    <pattern id="pattern0_1164_85" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlinkHref="#image0_1164_85" transform="scale(0.00195312)"/>
                                    </pattern>
                                    <image id="image0_1164_85" width="512" height="512" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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gqryDAzAQix+NKvqIUm+Zup7kM9I8s+mvgQAZ2bxAZDkyVNfgGP8uwBYiDUEgI+lnY8vrSo/cAlgAc6e+gK7qKr7J/mCPTzUh5N8fA+PM6azktx95Mc4O8nXxmcDAMzeogMgyZNGPPt12Xyq4O+31v5sxMfZm4Mf5/vwbP65jfV6/ZMiAABmb+kvATx2hDP/Lsl3JHlMa+3KtYx/krTW3tNa+7XW2lOz+Wf31yM8zFdWVY1wLgADWnoAfMYIZz6ttfaTrbU2wtmz0Vp7dZKvzPAvbZyb5G4DnwnAwJYeAOcPfN4vtdZeOvCZs9Va+5Mkzx3h6KH/vQAwsMUGQFWdl83Pph/SCwY+bwn+Y5KPDnymAACYucUGQIYfmRuTvH3gM2evtXZTkrcMfKwAAJg5AXCza1prnxr4zKV488DnCQCAmVtyAAz9ufMfHvi8JRn69+5nAgDM3JIDAADYkgAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADokAAAgA4JAADoULXWhjus6oIkj01yaZKHJbk4ybmDPQAA9OPGJNckuSrJ1Ule1Vq7bqjDBwuAqnp6kh9JcudBDgQAjvfRJM9qrf3XIQ7bOQAO/tR/RZKvGuJCAMApvTLJ03Z9NmCnAKiqO2Tz1MSDdrkEAHAkf5TkYa21T2x7wK5vAnxBjD8A7NuDstngrW39DEBVfUmS343vJACAKdyU5JGttTds88W7jPdzdvx6AGB7t8tmi7f+4m1dusPXAgC723qLtwqAqrowyb23fVAAYBD3PtjkI9v2GQB/+geAedhqk72GDwAd2jYArh70FgDAtrba5F2+DfD6eB8AAEzp3a2187f5wl1eAvAsAABMa+st3iUAXpTNhxAAAPt3UzZbvJWtA+Dgk4d+aNuvBwB28kPbfgpg4ocBAcASTfvDgA4e+HHZ/GhCAGB8r0zyuF3GPxngcwBaa9e11i5P8owkH931PADghD6a5Bmttctba9ftethOLwHc5rCqC5I8NptPJXpYkouTnDvYAwBAP25Mck02L7VfneRVQwz/of8PImA/9Q6zWY0AAAAASUVORK5CYII="/>
                                    </defs>
                                </svg>
                                ยอดขาย</Link>
                            </li>
                        </>
                    )}
                    { user ? (
                        <li>
                            { !loading ? (
                                <div onClick={handleLogout} className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left`}>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M11.2083 21.4167L18.5 14.125M18.5 14.125L11.2083 6.83333M18.5 14.125H1M18.5 1H24.3333C25.1069 1 25.8487 1.30729 26.3957 1.85427C26.9427 2.40125 27.25 3.14312 27.25 3.91667V24.3333C27.25 25.1069 26.9427 25.8487 26.3957 26.3957C25.8487 26.9427 25.1069 27.25 24.3333 27.25H18.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Logout</div>
                            ) : (
                                <div className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left`}>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="httwww.w3.org/2000/svg">
                                    <path d="M11.2083 21.4167L18.5 14.125M18.5 14.125L11.2083 6.83333M18.5 14.125H1M18.5 1H24.3333C25.1069 1 25.8487 1.30729 26.3957 1.85427C26.9427 2.40125 27.25 3.14312 27.25 3.91667V24.3333C27.25 25.1069 26.9427 25.8487 26.3957 26.3957C25.8487 26.9427 25.1069 27.25 24.3333 27.25H18.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="loading loading-spinner loading-sm"></span></div>
                            )}
                        </li>
                    ) : (
                        <li>
                            <Link href="/customer/login" className={`btn btn-ghost w-full flex items-center justify-start gap-3 text-left`}>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="httwww.w3.org/2000/svg">
                                <path d="M11.2083 21.4167L18.5 14.125M18.5 14.125L11.2083 6.83333M18.5 14.125H1M18.5 1H24.3333C25.1069 1 25.8487 1.30729 26.3957 1.85427C26.9427 2.40125 27.25 3.14312 27.25 3.91667V24.3333C27.25 25.1069 26.9427 25.8487 26.3957 26.3957C25.8487 26.9427 25.1069 27.25 24.3333 27.25H18.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
        </>
    )
}