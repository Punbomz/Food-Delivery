"use client";

type Props = {
  modalRef: React.RefObject<HTMLDialogElement>;
  selectedType: number;
  setSelectedType: (v: number) => void;
  onConfirm: () => void;
};

export default function AddFoodSelect({
  modalRef,
  selectedType,
  setSelectedType,
  onConfirm,
}: Props) {
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-center">เพิ่มรายการ</h3>
        <div className="h-1 w-full bg-accent mt-5"></div>

        <div className="flex flex-col">
          <label className="m-5 flex justify-between cursor-pointer">
            <span>เพิ่มหมวดหมู่</span>
            <input
              type="radio"
              name="type"
              className="radio"
              value={1}
              checked={selectedType === 1}
              onChange={() => setSelectedType(1)}
            />
          </label>

          <label className="m-5 flex justify-between cursor-pointer">
            <span>เพิ่มอาหาร</span>
            <input
              type="radio"
              name="type"
              className="radio"
              value={2}
              checked={selectedType === 2}
              onChange={() => setSelectedType(2)}
            />
          </label>
        </div>

        <div className="modal-action justify-center gap-5">
          <button className="btn btn-accent" onClick={onConfirm}>
            ยืนยัน
          </button>
          <button
              className="btn"
              type="button"
              onClick={() => modalRef.current?.close()}
          >
              ยกเลิก
          </button>
        </div>
      </div>
    </dialog>
  );
}
