import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return(
        <>
            <div className="flex-1/4 hidden lg:flex shadow-lg rounded-box p-10 text-center bg-white">
                <ul className="space-y-10 w-full">
                <li><Link href="/shop/order" className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop/order" ? "btn-active text-white btn-success" : "" }`}>คำสั่งซื้อ</Link></li>
                <li><Link href="/shop/menu" className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop/menu" ? "btn-active text-white btn-success" : "" }`}>รายการอาหาร</Link></li>
                <li><Link href="/shop" className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop" ? "btn-active text-white btn-success" : "" }`}>โปรไฟล์</Link></li>
                <li><Link href="/shop/report" className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop/report" ? "btn-active text-white btn-success" : "" }`}>ยอดขาย</Link></li>
                </ul>
            </div>
        </>
    );
}