"use client";

import { use, useEffect, useState, useRef } from "react";
import AddSubOption from "@/app/components/AddSubOptionModal";

type Props = {
  modalRef: React.RefObject<HTMLDialogElement>;
  id: number | null;
  onSuccess: () => void;
  onClose: () => void;
  onRequestDelete: (id: number) => void;
};

interface SubOption {
    name: string;
    price: number;
}

interface Option {
  name: string;
  price: number;
}

export default function AddOption({ modalRef, id, onSuccess, onClose, onRequestDelete }: Props) {

    const [loading, setLoading] = useState(false);
    const [errorShow, setError] = useState("");
    const [Preview, setPreview] = useState<string | null>(null);
    const [options, setOption] = useState<Option[]>([]);
    const [subOption, setSubOption] = useState<SubOption[]>([]);
    const [editId, setEdit] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [force, setForce] = useState(true);
    const [multiple, setMultiple] = useState(false);

    const suboptionRef = useRef<HTMLDialogElement>(null) as React.RefObject<HTMLDialogElement>;

    useEffect(() => {
        suboptionRef.current?.close();
    }, []);

    useEffect(() => {
        if (id === null) {
            setName("");
            setForce(true);
            setMultiple(false);
            setSubOption([]);
            return;
        }

        getData();
    }, [id]);

    const getData = async () => {
        try {
        const res = await fetch("/api/getdata/shop/food/option/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
            })
        })

        if (res.ok) {
            const data = await res.json();
            setName(data.ogName);
            setForce(data.ogForce);
            setMultiple(data.ogMultiple);
            setSubOption(
                data.options.map((op: any) => ({
                    name: op.opName,
                    price: op.opPrice,
                }))
            );
        }
        } catch(error) {
            console.error("Fetch option failed:", error);
        }
    }

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.append("subOptions", JSON.stringify(subOption))

        if(!id) {
            const res = await fetch("/api/shop/menu/option/add", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                formRef.current?.reset();
                setError("");
                setLoading(false);
                setSubOption([]);
                setName("");
                setForce(true);
                setMultiple(false);
                setEdit(null);
                setPreview(null);
                onSuccess();
                modalRef.current?.close();
            } else {
                setError("เพิ่มตัวเลือกเสริมผิดพลาด! กรุณาลองใหม่อีกครั้ง");
            }
        } else {
            formData.append("id", String(id));
            const res = await fetch("/api/shop/menu/option/edit", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                formRef.current?.reset();
                setError("");
                setLoading(false);
                setSubOption([]);
                setName("");
                setForce(true);
                setMultiple(false);
                setEdit(null);
                setPreview(null);
                onSuccess();
                modalRef.current?.close();
            } else {
                setError("บันทึกข้อมูลผิดพลาด! กรุณาลองใหม่อีกครั้ง");
            }
        }
        setLoading(false);
    }

    const formRef = useRef<HTMLFormElement>(null);

    function handleClose() {
        setSubOption([]);
        setName("");
        setForce(true);
        setMultiple(false);
        setPreview(null);
        formRef.current?.reset();
        modalRef.current?.close();
        onClose();
    }

    const handleDelete = async () => {
        if (id !== null) {
            modalRef.current?.close();
            onRequestDelete(id);
        }
    }

  return (

    <>
        <AddSubOption
            modalRef={suboptionRef}
            info=""
            id={editId}
            data={
                editId !== null && subOption[editId]
                ? [subOption[editId].name, subOption[editId].price]
                : ["", 0]
            }
            onSuccess={(result) => {
                const [id, name, price] = result;
                setEdit(null);

                if (id !== -1) {
                setSubOption(prev =>
                    prev.map((item, index) =>
                    index === id ? { name, price } : item
                    )
                );
                } else {
                setSubOption(prev => [...prev, { name, price }]);
                }
            }}
        />

        <dialog ref={modalRef} className="modal">
        <div className="modal-box">
            <h3 className="text-lg font-bold text-center">เพิ่มตัวเลือกเสริม</h3>
            <div className="h-1 w-full bg-accent mt-5"></div>

            <form onSubmit={handleSave} ref={formRef}>
                <fieldset className="fieldset flex justify-center">
                    <div className="flex-col">
                        <div className="w-xs">
                            <legend className="fieldset-legend">ชื่อตัวเลือกเสริม</legend>
                            <input name="Name" type="text" className="input" placeholder="ระบุตัวเลือกเสริม" required value={ name }
                            onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>
                        
                        <div className="w-xs border border-accent rounded bg-base-200 p-2 mt-3">
                            <p className="font-bold">ตัวเลือก</p>
                            <p className="text-[#8E8E8E]">เช่น เยลลี่,ขนาดใหญ่,น้ำตาลน้อย</p>
                        </div>

                        <div className="w-xs mt-3">
                            <button type="button" className="font-bold text-base hover:cursor-pointer"
                            onClick={() => suboptionRef.current?.showModal()}
                            >เพิ่มตัวเลือกย่อย</button>
                            {subOption.length > 0 && (
                                <div className="pt-3">
                                        { subOption.map((option: Option, index: number) => (
                                        <div
                                            key={index}
                                            className="w-full rounded-box items-center bg-accent-content flex justify-between p-3 text-black mb-3"
                                        >
                                            <div className="flex gap-2 items-center pl-2">
                                                <button>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:cursor-pointer"
                                                    onClick={ () => {
                                                        setEdit(index);
                                                        suboptionRef.current?.showModal();
                                                    }}>
                                                        <path d="M10 2.50019H4.16667C3.72464 2.50019 3.30072 2.67578 2.98816 2.98834C2.67559 3.3009 2.5 3.72483 2.5 4.16686V15.8335C2.5 16.2756 2.67559 16.6995 2.98816 17.012C3.30072 17.3246 3.72464 17.5002 4.16667 17.5002H15.8333C16.2754 17.5002 16.6993 17.3246 17.0118 17.012C17.3244 16.6995 17.5 16.2756 17.5 15.8335V10.0002M15.3125 2.18769C15.644 1.85617 16.0937 1.66992 16.5625 1.66992C17.0313 1.66992 17.481 1.85617 17.8125 2.18769C18.144 2.51921 18.3303 2.96885 18.3303 3.43769C18.3303 3.90653 18.144 4.35617 17.8125 4.68769L10.3017 12.1994C10.1038 12.3971 9.85934 12.5418 9.59083 12.6202L7.19667 13.3202C7.12496 13.3411 7.04895 13.3424 6.97659 13.3238C6.90423 13.3053 6.83819 13.2676 6.78537 13.2148C6.73256 13.162 6.69491 13.096 6.67637 13.0236C6.65783 12.9512 6.65909 12.8752 6.68 12.8035L7.38 10.4094C7.45877 10.1411 7.60378 9.8969 7.80167 9.69936L15.3125 2.18769Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                                {option.name}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                ฿ {option.price.toFixed(2)}
                                                <button type="button">
                                                    <i className="far hover:cursor-pointer text-lg" onClick={ () => setSubOption(prev => prev.filter((_, i) => i !== index))}>&#xf2ed;</i>
                                                </button>
                                            </div>
                                        </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        <div className="w-xs border border-accent rounded bg-base-200 p-2 mt-3">
                            <p className="font-bold">รายละเอียดตัวเลือก</p>
                            <p className="text-[#8E8E8E]">เช่น ต้องเลือกอย่างน้อย 1 อย่าง, ไม่บังคับ</p>
                        </div>

                        <div className="w-xs mt-3">
                            <legend className="fieldset-legend">ลูกค้าจำเป็นต้องเลือกตัวเลือกนี้หรือไม่?</legend>
                            <div className="flex gap-3 mb-2 items-center">
                                <input type="radio" name="Force" className="radio" value={"true"} checked={ force }
                                onChange={(e) => setForce(true) }/> จำเป็น
                            </div>
                            <div className="flex gap-3 mb-2 items-center">
                                <input type="radio" name="Force" className="radio" value={"false"} checked={ !force }
                                onChange={(e) => setForce(false) }/> ไม่จำเป็น
                            </div>
                        </div>

                        <div className="w-xs mt-3">
                            <legend className="fieldset-legend">ลูกค้าสามารถเลือกได้กี่ตัวเลือก?</legend>
                            <div className="flex gap-3 mb-2 items-center">
                                <input type="radio" name="Multiple" className="radio" value={"false"} checked={ !multiple }
                                onChange={(e) => setMultiple(false) }/> 1 อย่าง
                            </div>
                            <div className="flex gap-3 mb-2 items-center">
                                <input type="radio" name="Multiple" className="radio" value={"true"} checked={ multiple }
                                onChange={(e) => setMultiple(true) }/> หลายตัวเลือก
                            </div>
                        </div>
                    </div>
                </fieldset>
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
                    value={ id===null ? ("เพิ่มรายการ") : ("บันทึก")}
                    />
                )}
                { id && (
                    <button
                        className={`btn btn-error ${loading && ("disabled")}`}
                        type="button"
                        onClick={() => handleDelete()}
                    >
                        ลบ
                    </button>
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
    </>

    );
}
