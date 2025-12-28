"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = {
  adminUsername: string;
  adminEmail: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/admin")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <div className="w-full max-w-xl">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box md:w-xl sm:w-2xl border p-10 shadow-md">

          <h1 className="text-2xl font-Inter text-black text-center mb-6">
            ข้อมูลผู้ดูแลระบบ
          </h1>

          <div className="space-y-4 w-xs mx-auto text-sm">
            <div>
              <label className="label opacity-70">Username</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default">
                {profile.adminUsername}
              </div>
            </div>

            <div>
              <label className="label opacity-70">อีเมล</label>
              <div className="input input-bordered w-full bg-base-100 cursor-default truncate">
                {profile.adminEmail}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-center gap-6 text-sm mt-8">
            <Link
              href="/editProfile/admin"
              className="underline text-black hover:text-gray-600"
            >
              แก้ไขข้อมูล
            </Link>
          </div>

        </fieldset>
      </div>
    </div>
  );
}
