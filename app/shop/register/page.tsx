export default function LoginForm() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">

        {/* Login Card */}
        <fieldset className="bg-[#DAFFE4] w-full max-w-[540px] rounded-xl p-10 shadow-sm">
          
          <h1 className="text-2xl font-Inter text-black mb-6">
            เข้าสู่ระบบ
          </h1>

          {/* Username */}
          <label className="block text-sm text-black mb-1">
            username
          </label>
          <input
            type="text"
            className="
              w-full
              h-[46px]
              bg-[#D9D9D9]
              border-0
              rounded-none
              mb-5
              px-3
              text-base
              font-Inter
              focus:outline-none
            "
          />

          {/* Password */}
          <label className="block text-sm text-black mb-1">
            password
          </label>
          <input
            type="password"
            className="
              w-full
              h-[46px]
              bg-[#D9D9D9]
              border-0
              rounded-none
              mb-6
              px-3
              text-base
              font-Inter
              focus:outline-none
            "
          />

          {/* Login Button */}
          <button
            type="button"
            className="
              w-3/5
              h-[44px]
              bg-[#1EC067]
              text-black
              rounded-full
              text-base
              font-Inter
              mx-auto
              block
              mb-6
              hover:bg-[#19a95b]
              active:scale-95
              transition
            "
          >
            เข้าสู่ระบบ
          </button>

          {/* Footer Links */}
          <div className="h-[6px] bg-[#D8D8D8] my-6 -mx-10"></div>
          <div className="flex justify-between text-sm">
            <a href="#" className="underline text-black hover:text-gray-600">
              สมัครสมาชิก
            </a>
            <a href="#" className="underline text-black hover:text-gray-600">
              ลืมรหัสผ่าน
            </a>
          </div>

        </fieldset>
      </div>
  );
}
