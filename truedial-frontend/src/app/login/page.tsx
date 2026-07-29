import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - TrueDial",
  description: "Login or Register to TrueDial.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-8">
          {/* Logo Placeholder */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <span className="text-2xl font-bold text-white">TD</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            India's B2B Discovery Platform
          </h1>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
