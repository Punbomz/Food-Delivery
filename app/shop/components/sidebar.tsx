import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return(
        <>
            <div className="flex-1/4 hidden lg:flex shadow-lg rounded-box p-10 text-center bg-white">
                <ul className="space-y-10">
                <li className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop/order" ? "btn-active text-white btn-success" : "" }`}><Link href="/shop/order">คำสั่งซื้อ</Link></li>
                <li className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop/menu" ? "btn-active text-white btn-success" : "" }`}><Link href="/shop/menu">รายการอาหาร</Link></li>
                <li className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop" ? "btn-active text-white btn-success" : "" }`}><Link href="/shop">โปรไฟล์</Link></li>
                <li className={`rounded-box btn btn-ghost btn-block btn-lg w-full ${pathname === "/shop/report" ? "btn-active text-white btn-success" : "" }`}><Link href="/shop/report">ยอดขาย</Link></li>
                </ul>
            </div>
        </>
    );
}