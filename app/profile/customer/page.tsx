"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Profile = {
  customerPic: string | null;
  customerFname: string;
  customerLname: string;
  customerEmail: string;
  customerPhone: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/customer")
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
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-sm bg-base-100 border border-base-300 rounded-box shadow-lg p-8">
        <div className="flex flex-col items-center gap-5">
          
          {/* Profile Image */}
          <div className="avatar">
            <div className="ring ring-primary ring-offset-base-100 w-28 rounded-full ring-offset-2">
              <Image
                src={profile.customerPic || "/avatar.png"}
                alt="Profile"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-xl font-semibold text-base-content">
            {profile.customerFname} {profile.customerLname}
          </h2>

          {/* Info */}
          <div className="w-full border-t border-base-300 pt-4 text-sm text-base-content space-y-3">
            <div className="flex justify-between">
              <span className="opacity-70">หมายเลขโทรศัพท์</span>
              <span>{profile.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">อีเมลมหาวิทยาลัย</span>
              <span className="truncate">{profile.customerEmail}</span>
            </div>
          </div>

          {/* Footer Links */}
              <div className="flex justify-center gap-5 text-sm p-5 w-xs mx-auto">
                <p>แก้ไขข้อมูล</p>
              </div>
        </div>
      </div>
    </div>
  );
}
