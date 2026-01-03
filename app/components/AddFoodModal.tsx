"use client";

import { use, useEffect, useState, useRef } from "react";

type Props = {
  modalRef: React.RefObject<HTMLDialogElement>;
  id: number | null;
  onSuccess: () => void;
  onClose: () => void;
  onRequestDelete: (id: number) => void;
};

interface Genre {
  fGenreID: number;
  fGenreName: string;
  [key: string]: any;
}

interface OptionData {
  ogID: number;
  ogName: string;
  ogFood: number;
  ogItem: any;
}

export default function AddFood({ modalRef, id, onSuccess, onClose, onRequestDelete }: Props) {

    const [loading, setLoading] = useState(false);
    const [errorShow, setError] = useState("");
    const [Preview, setPreview] = useState<string | null>(null);
    const [genres, setGenre] = useState<Genre[]>([]);
    const [optionData, setOptionData] = useState<OptionData[]>([]);
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [type, setType] = useState<number | null>(null);
    const [price, setPrice] = useState("");
    const [options, setOptions] = useState<number[]>([]);
    const [isEditing, setEditing] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (id === null) {
            resetValue();
            return;
        }

        getData();
    }, [id]);

    const getData = async () => {
        try {
            const res = await fetch("/api/getdata/shop/food/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                }),
            })

            if (res.ok) {
                const data = await res.json();
                if(data.food) {
                    setEditing(true);
                }
                setName(data.food.foodName);
                setPrice(data.food.foodPrice);
                setDetails(data.food.foodDetails);
                setType(data.food.foodGenreID);
                setOptions(data.options);
                setPreview(data.food.foodPic);
            }
        } catch(error) {
            console.error("Fetch genre failed:", error);
        }

        // Genre
        try {
        const res = await fetch("/api/getdata/shop/food/genre", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            const data = await res.json();
            setGenre(data.fgenre)
        }
        } catch(error) {
            console.error("Fetch genre failed:", error);
        }

        // Options
        try {
        const res = await fetch("/api/getdata/shop/food/option", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            const data = await res.json();
            setOptionData(data);
        }
        } catch(error) {
        console.error("Fetch options data failed:", error);
        }
    }

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const form = event.currentTarget;
        const formData = new FormData(form);
        formData.append("Options", JSON.stringify(options));

        if(!id) {
            const res = await fetch("/api/shop/menu/food/add", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                form.reset();
                resetValue();
                onSuccess();
                modalRef.current?.close();
            } else {
                setError("เพิ่มเมนูผิดพลาด! กรุณาลองใหม่อีกครั้ง");
            }
        } else {
            formData.append("id", String(id));
            const res = await fetch("/api/shop/menu/food/edit", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                form.reset();
                resetValue();
                onSuccess();
                modalRef.current?.close();
            } else {
                setError("บันทึกรายการอาหารผิดพลาด! กรุณาลองใหม่อีกครั้ง");
            }
        }
        setEditing(false);
        setLoading(false);
    }

    const formRef = useRef<HTMLFormElement>(null);

    function handleClose() {
        resetValue();
        formRef.current?.reset();
        modalRef.current?.close();
        onClose();
    }

    function resetValue() {
        setError("");
        setLoading(false);
        setName("");
        setPrice("");
        setDetails("");
        setType(null);
        setOptions([]);
        setPreview(null);
    }

    const handleDelete = async () => {
        if (id !== null) {
            modalRef.current?.close();
            onRequestDelete(id);
        }
    }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-center">เพิ่มรายการอาหาร</h3>
        <div className="h-1 w-full bg-accent mt-5"></div>

        <form onSubmit={handleSave} ref={formRef}>
            <div className="text-center mt-3">
                {Preview && (
                <div className="avatar m-3">
                    <div className="w-24 rounded">
                    <img src={Preview} alt="preview"/>
                    </div>
                </div>
                )}
                <div>  
                <input name="Pic" type="file" accept="image/*" className="file-input w-xs"
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setPreview(URL.createObjectURL(file));
                    }
                    }}
                    required = { !isEditing }
                />
                <label className="block text-sm text-black mt-3">
                รูปอาหาร
                </label>
                </div>
            </div>
            <fieldset className="fieldset flex justify-center">
                <div className="flex-col">
                    <div className="w-xs">
                        <legend className="fieldset-legend">ชื่อเมนู</legend>
                        <input name="Name" type="text" className="input" placeholder="ระบุชื่อเมนู" required value={name} onChange={(e) => { setName(e.target.value) }} />
                    </div>
                    
                    <div className="w-xs">
                        <legend className="fieldset-legend">คำอธิบาย</legend>
                        <textarea name="Details" className="textarea" placeholder="ระบุคำอธิบาย" maxLength={300} value={details} onChange={(e) => { setDetails(e.target.value) }}></textarea>
                    </div>

                    <div className="w-xs">
                        <legend className="fieldset-legend">หมวดหมู่</legend>
                        {genres.length > 0 && (
                            <select
                                name="Genre"
                                value={String(type)}
                                onChange={(e) => setType(Number(e.target.value))}
                                className="select"
                                required
                                >
                                {genres.map((genre) => (
                                    <option
                                    key={genre.fGenreID}
                                    value={String(genre.fGenreID)}
                                    >
                                    {genre.fGenreName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="w-xs">
                        <legend className="fieldset-legend">ราคา</legend>
                        <label className="input">
                            ฿
                            <input name="Price" type="number" placeholder="ระบุราคา" required
                            min={1}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}/>
                        </label>
                    </div>

                    <div className="w-xs">
                        <div className="flex justify-between items-center mt-3">
                            <legend className="fieldset-legend">ตัวเลือกเสริม</legend>
                            <div>เลือกแล้ว {options.length}</div>
                        </div>
                        { optionData.length === 0 ? (
                            <div className="text-center">ยังไม่มีตัวเลือกเสริม</div>
                        ) : (
                            optionData.map((option: OptionData, index: number) => (
                                option.ogItem.length > 0 && (
                                    <label
                                        key={option.ogID}
                                        className="w-full rounded-box items-center bg-accent-content flex p-3 text-black mb-2 gap-2 cursor-pointer"
                                        >
                                        <input
                                            name="options"
                                            value={option.ogID}
                                            type="checkbox"
                                            className="checkbox"
                                            checked={options.includes(option.ogID)}
                                            onChange={() => {
                                                setOptions(prev =>
                                                prev.includes(option.ogID)
                                                    ? prev.filter(id => id !== option.ogID)
                                                    : [...prev, option.ogID]
                                                );
                                            }}
                                        />
                                            <h1 className="text-sm lg:text-lg">{option.ogName}</h1>
                                    </label>
                                )
                            ))
                        )}
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
  );
}
