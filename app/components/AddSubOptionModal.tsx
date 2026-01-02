"use client";

import { use, useState, useRef, useEffect } from "react";

type Props = {
  modalRef: React.RefObject<HTMLDialogElement>;
  id: number | null;
  data: [string, number];
  info: string;
  onSuccess: (result: [number , string, number]) => void;
};

export default function AddSubOption({ modalRef, id, data, info, onSuccess }: Props) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (id !== null) {
            setName(data[0]);
            setPrice(String(data[1]));
        } else {
            setName("");
            setPrice("");
        }
    }, [id, data]);

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        form.reset();
        setName("");
        setPrice("");
        if(id===null) {
            id = -1
        }
        onSuccess([id, formData.get("Name") as string, Number(formData.get("Price"))]);
        modalRef.current?.close();
    }

    const formRef = useRef<HTMLFormElement>(null);

    function handleClose() {
        setName("");
        setPrice("");
        formRef.current?.reset();
        modalRef.current?.close();
    }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-center">เพิ่มรายการ</h3>
        <div className="h-1 w-full bg-accent mt-5"></div>

        <form onSubmit={handleSave} ref={formRef}>
            <fieldset className="fieldset flex justify-center">
                <div className="flex-col">
                    <div className="w-xs">
                        <legend className="fieldset-legend">ชื่อตัวเลือก</legend>
                        <input name="Name" type="text" className="input" placeholder="ระบุตัวเลือก" required
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className="w-xs">
                        <legend className="fieldset-legend">ราคา</legend>
                        <input name="Price" type="number" className="input" placeholder="ระบุราคา" step="0.01" required
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}/>
                    </div>
                </div>
            </fieldset>

            <div className="modal-action justify-center gap-5">
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
            <button
                className={`btn`}
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
