import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - TrueDial",
  description: "Login or Register to TrueDial.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="TrueDial - 100% Verified"
            className="h-16 w-auto mx-auto mb-4 dark:invert dark:hue-rotate-180 dark:mix-blend-screen"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            India&apos;s #1 Verified B2B Discovery Platform
          </h1>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
