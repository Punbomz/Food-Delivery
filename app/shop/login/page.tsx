export default function LoginForm() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-6">
        <img 
          src="/rmutk-logo.png" 
          className="h-14 w-auto"
        />
      </div>

      {/* Login Form */}
      <fieldset className="fieldset bg-green-50 border-0 rounded-lg w-full max-w-sm p-6 shadow-sm">
        <legend className="fieldset-legend text-base font-normal text-gray-800 px-0 mb-4">
          เข้าสู่ระบบ
        </legend>
        
        <label className="label text-xs text-gray-700 mb-1 block">username</label>
        <input 
          type="text" 
          className="input w-full bg-gray-300 border-0 rounded mb-3 px-3 py-2 text-sm" 
        />
        
        <label className="label text-xs text-gray-700 mb-1 block">password</label>
        <input 
          type="password" 
          className="input w-full bg-gray-300 border-0 rounded mb-4 px-3 py-2 text-sm" 
        />
        
        <button className="btn bg-green-600 hover:bg-green-700 text-white w-full border-0 rounded px-4 py-2 text-sm font-normal">
          เข้าสู่ระบบ
        </button>

        {/* Footer Links */}
        <div className="flex justify-between mt-5 pt-4 border-t border-green-200">
          <a href="#" className="text-xs text-gray-700 hover:text-green-700 no-underline">
            สมัครสมาชิก
          </a>
          <a href="#" className="text-xs text-gray-700 hover:text-green-700 no-underline">
            ลืมรหัสผ่าน
          </a>
        </div>
      </fieldset>
    </div>
  );
}