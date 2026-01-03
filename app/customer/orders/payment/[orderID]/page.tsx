"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AlertModal from "@/app/components/AlertModal";
import { useAlertModal } from "@/app/hooks/useAlertModal";

export default function PaymentPage() {
    const [QRCode, setQRCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { orderID } = useParams<{ orderID: string }>();
    const [preview, setPreview] = useState<string | null>(null);
    const { isOpen, message, navigateTo, showAlert, closeAlert } = useAlertModal();

    useEffect(() => {
        async function fetchQRCode() {
            try {
                const response = await fetch(`/api/getdata/shop//qrcode/${orderID}`);
                const data = await response.json();
                console.log("Fetched QR Code data:", data);
                setQRCode(data.qrCodeUrl);
            } catch (error) {
                console.error("Error fetching QR code:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchQRCode();
    }, [orderID]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    const handleDownload = async () => {
        if (!QRCode) return;
        
        try {
            const response = await fetch(QRCode);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${orderID}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append("OrderID", orderID);

        const res = await fetch("/api/customer/upload-slip", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            showAlert("อัพโหลดสลิปการชำระเงินสำเร็จ!", "/customer/orders");
        } else {
            showAlert("เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง");
        }
        setLoading(false);
    }

    return (
        <>
            <AlertModal
                isOpen={isOpen}
                message={message}
                navigateTo={navigateTo}
                onClose={closeAlert}
            />


            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="flex flex-col gap-3 items-center p-20 w-lg text-center shadow-md rounded-md bg-base-200">
                    <span className="font-bold text-xl">กรุณาชำระค่าอาหาร</span>
                    <div className="flex gap-2 items-center">
                        <svg width="30" height="30" viewBox="0 0 61 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.625 6.33398V28.5006C7.625 31.984 9.9125 34.834 12.7083 34.834H22.875C24.2232 34.834 25.5161 34.1667 26.4695 32.979C27.4228 31.7913 27.9583 30.1804 27.9583 28.5006V6.33398M17.7917 6.33398V69.6673M53.375 47.5006V6.33398C50.0045 6.33398 46.7721 8.00213 44.3889 10.9715C42.0056 13.9408 40.6667 17.9681 40.6667 22.1673V41.1673C40.6667 44.6506 42.9542 47.5006 45.75 47.5006H53.375ZM53.375 47.5006V69.6673" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="block mt-2 text-sm lg:text-lg">กรุณารออาหาร 10-15 นาที</span>
                        <svg width="30" height="30" viewBox="0 0 61 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.625 6.33398V28.5006C7.625 31.984 9.9125 34.834 12.7083 34.834H22.875C24.2232 34.834 25.5161 34.1667 26.4695 32.979C27.4228 31.7913 27.9583 30.1804 27.9583 28.5006V6.33398M17.7917 6.33398V69.6673M53.375 47.5006V6.33398C50.0045 6.33398 46.7721 8.00213 44.3889 10.9715C42.0056 13.9408 40.6667 17.9681 40.6667 22.1673V41.1673C40.6667 44.6506 42.9542 47.5006 45.75 47.5006H53.375ZM53.375 47.5006V69.6673" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center gap-5 mt-5">
                        {QRCode ? (
                            <img
                                src={QRCode}
                                alt="QR Code"
                                className="w-80 h-auto object-contain rounded-md"
                            /> ) : (<div>ไม่พบ QR Code</div>
                        )}

                        { QRCode && <button className="btn btn-warning mx-auto" onClick={handleDownload}>บันทึกคิวอาร์โค้ด</button>}
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-10">
                    { QRCode && (
                        <form className="flex flex-col gap-3" onSubmit={handleUpload}>
                            { preview && (
                                <img src={preview} alt="Slip Preview" className="w-60 h-auto mx-auto rounded-md" />
                            )}
                            <label className="btn btn-accent mx-auto">
                                <input name="Slip" type="file" accept="image/*" className="hidden" required
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                />
                                อัพโหลดสลิปการชำระเงิน
                            </label>
                            <button type="submit" className="btn btn-success mx-auto">ยืนยันการชำระเงิน</button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
