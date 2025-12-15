import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <div className="bg-red-500 text-white p-4">
  Tailwind works
</div>

<button className="btn btn-soft btn-error">
  DaisyUI works
</button>

<div className="p-10">
      <button className="btn btn-primary">
        Hello daisyUI
      </button>
    </div>

      </main>
    </div>
  );
}
