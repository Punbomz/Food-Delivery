"use client";

import { use, useState, useRef } from "react";

type Props = {
  modalRef: React.RefObject<HTMLDialogElement>;
  onSuccess: () => void;
};

export default function AddGenre({ modalRef, onSuccess }: Props) {

    const [loading, setLoading] = useState(false);
    const [errorShow, setError] = useState("");

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        const res = await fetch("/api/shop/menu/genre/add", {
            method: "POST",
            body: formData,
        });

        if (res.status === 409) {
            setError("ชื่อหมวดหมู่ซ้ำ!");
        } else if (res.ok) {
            form.reset();
            setError("");
            setLoading(false);
            onSuccess();
            modalRef.current?.close();
        } else {
            setError("เพิ่มหมวดหมู่ผิดพลาด! กรุณาลองใหม่อีกครั้ง");
        }
        setLoading(false);
    }

    const formRef = useRef<HTMLFormElement>(null);

    function handleClose() {
        formRef.current?.reset();
        modalRef.current?.close();
    }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-center">เพิ่มหมวดหมู่</h3>
        <div className="h-1 w-full bg-accent mt-5"></div>

        <form onSubmit={handleSave} ref={formRef}>
            <input
            name="Name"
            className="input input-bordered w-full mt-5"
            placeholder="ชื่อหมวดหมู่"
            required
            />
            <p className={`text-red-500 m-2 text-xs ${ errorShow !== "" ? ("block") : ("hidden") }`}>{errorShow}</p>

            <div className="modal-action justify-center gap-5">
            { loading ? (
                <button
                type="button"
                className="
                    btn
                    btn-success
                    text-base
                    font-Inter
                    block
                    hover:bg-[#19a95b]
                    active:scale-95
                    transition
                "
                >
                <span className="loading loading-spinner loading-sm"></span>
                </button>
            ) : (
                <input
                type="submit"
                className="
                    btn
                    btn-success
                    text-base
                    font-Inter
                    block
                    hover:bg-[#19a95b]
                    active:scale-95
                    transition
                "
                value="บันทึก"
                />
            )}
            <button
                className={`btn ${loading && ("disabled")}`}
                type="button"
                onClick={() => handleClose()}
            >
                ยกเลิก
            </button>
            </div>
        </form>
      </div>
    </dialog>
  );
}
