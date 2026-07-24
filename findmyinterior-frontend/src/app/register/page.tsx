"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown, ChevronRight, CheckCircle2, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

// ─── Professional Type Taxonomy ───────────────────────────────────────────────
const PROFESSIONAL_CATEGORIES = [
  {
    icon: "🏠",
    label: "Interior & Design",
    types: [
      { label: "Interior Designer (Individual)", value: "interior_designer" },
      { label: "Interior Design Company", value: "interior_company" },
      { label: "Modular Kitchen Designer", value: "modular_kitchen_designer" },
      { label: "Wardrobe Designer", value: "wardrobe_designer" },
      { label: "2D/3D Designer", value: "2d_3d_designer" },
      { label: "Space Planner", value: "space_planner" },
    ],
  },
  {
    icon: "📐",
    label: "Architecture & Engineering",
    types: [
      { label: "Architect", value: "architect" },
      { label: "Structural Engineer", value: "structural_engineer" },
      { label: "Civil Engineer", value: "civil_engineer" },
      { label: "MEP Consultant", value: "mep_consultant" },
      { label: "Landscape Designer", value: "landscape_designer" },
      { label: "Vastu Consultant", value: "vastu_consultant" },
    ],
  },
  {
    icon: "👷",
    label: "Contractors",
    types: [
      { label: "Interior Contractor", value: "interior_contractor" },
      { label: "Civil Contractor", value: "civil_contractor" },
      { label: "Turnkey Contractor", value: "turnkey_contractor" },
      { label: "Renovation Contractor", value: "renovation_contractor" },
      { label: "Demolition Contractor", value: "demolition_contractor" },
    ],
  },
  {
    icon: "🛠",
    label: "Skilled Workforce",
    types: [
      { label: "Carpenter", value: "carpenter" },
      { label: "Electrician", value: "electrician" },
      { label: "Plumber", value: "plumber" },
      { label: "Painter", value: "painter" },
      { label: "POP / False Ceiling Worker", value: "pop_false_ceiling_worker" },
      { label: "Tile & Marble Fitter", value: "tile_marble_fitter" },
      { label: "Granite Installer", value: "granite_installer" },
      { label: "Fabricator", value: "fabricator" },
      { label: "Aluminium Fabricator", value: "aluminium_fabricator" },
      { label: "Glass Installer", value: "glass_installer" },
      { label: "Welder", value: "welder" },
      { label: "Polish Worker", value: "polish_worker" },
      { label: "Wallpaper Installer", value: "wallpaper_installer" },
    ],
  },
  {
    icon: "🧱",
    label: "Material Suppliers",
    types: [
      { label: "Plywood Dealer", value: "plywood_dealer" },
      { label: "Laminate Dealer", value: "laminate_dealer" },
      { label: "Tile Dealer", value: "tile_dealer" },
      { label: "Marble & Granite Dealer", value: "marble_granite_dealer" },
      { label: "Paint Dealer", value: "paint_dealer" },
      { label: "Hardware Supplier", value: "hardware_supplier" },
      { label: "Lighting Supplier", value: "lighting_supplier" },
      { label: "Electrical Supplier", value: "electrical_supplier" },
      { label: "Sanitary & Bathroom Supplier", value: "sanitary_bathroom_supplier" },
      { label: "Modular Kitchen Material Supplier", value: "modular_kitchen_material_supplier" },
      { label: "Glass Supplier", value: "glass_supplier" },
      { label: "ACP & Aluminium Supplier", value: "acp_aluminium_supplier" },
      { label: "Furniture Supplier", value: "furniture_supplier" },
      { label: "Door & Window Supplier", value: "door_window_supplier" },
    ],
  },
  {
    icon: "🏗",
    label: "Builders & Developers",
    types: [
      { label: "Builder", value: "builder" },
      { label: "Real Estate Developer", value: "real_estate_developer" },
      { label: "Apartment Project", value: "apartment_project" },
      { label: "Commercial Project", value: "commercial_project" },
      { label: "Villa Project", value: "villa_project" },
    ],
  },
  {
    icon: "🏡",
    label: "Home Improvement Services",
    types: [
      { label: "Home Renovation", value: "home_renovation" },
      { label: "Waterproofing", value: "waterproofing" },
      { label: "Pest Control", value: "pest_control" },
      { label: "Deep Cleaning", value: "deep_cleaning" },
      { label: "CCTV & Security Systems", value: "cctv_security" },
      { label: "Home Automation", value: "home_automation" },
      { label: "Solar Installation", value: "solar_installation" },
      { label: "AC Installation & Service", value: "ac_installation" },
    ],
  },
  {
    icon: "🚚",
    label: "Support Services",
    types: [
      { label: "Packers & Movers", value: "packers_movers" },
      { label: "Interior Material Transport", value: "interior_material_transport" },
      { label: "Equipment Rental", value: "equipment_rental" },
      { label: "Interior Project Consultant", value: "interior_project_consultant" },
    ],
  },
];

// ─── Type Picker Component ─────────────────────────────────────────────────────
function ProfessionalTypePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<string[]>([]);

  const selectedLabel = PROFESSIONAL_CATEGORIES
    .flatMap((c) => c.types)
    .find((t) => t.value === value)?.label ?? "";

  const filtered = search.trim()
    ? PROFESSIONAL_CATEGORIES.map((cat) => ({
        ...cat,
        types: cat.types.filter((t) =>
          t.label.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.types.length > 0)
    : PROFESSIONAL_CATEGORIES;

  const toggleCat = (label: string) =>
    setOpenCats((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5 text-sm hover:border-orange-400 focus:outline-none focus:border-orange-500 transition bg-white dark:bg-slate-900 dark:border-slate-700"
      >
        <span className={selectedLabel ? "text-slate-900 dark:text-white font-medium" : "text-slate-400"}>
          {selectedLabel || "Select your professional type..."}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
          {/* Search */}
          <div className="sticky top-0 bg-white dark:bg-slate-900 p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search type..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-orange-400"
                autoFocus
              />
            </div>
          </div>

          {/* Category list */}
          {filtered.map((cat) => (
            <div key={cat.label}>
              <button
                type="button"
                onClick={() => toggleCat(cat.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span>{cat.icon} {cat.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${openCats.includes(cat.label) || search ? "rotate-90" : ""}`} />
              </button>
              {(openCats.includes(cat.label) || !!search) && (
                <div className="bg-slate-50 dark:bg-slate-800/50">
                  {cat.types.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        onChange(type.value);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full text-left px-5 py-2 text-sm transition flex items-center gap-2 ${
                        value === type.value
                          ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600"
                      }`}
                    >
                      {value === type.value && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Register Page ────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState<"who" | "details">("who");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "customer",
  });
  const [isCustomer, setIsCustomer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setAuth, _hasHydrated } = useAuthStore();

  // Auth guard: redirect if already logged in
  useEffect(() => {
    if (_hasHydrated && user) {
      router.replace("/dashboard");
    }
  }, [user, _hasHydrated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Client-side phone validation
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      setFieldErrors({ phone: "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9." });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setFieldErrors({ password_confirmation: "Passwords do not match." });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setFieldErrors({ password: "Password must be at least 8 characters." });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);
      const { user: newUser, token } = res.data.data;
      setAuth(newUser, token);
      router.push("/dashboard");
    } catch (err: any) {
      const responseData = err.response?.data;
      console.error("Registration error:", responseData);

      if (responseData?.errors && typeof responseData.errors === "object") {
        const parsedErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(responseData.errors)) {
          parsedErrors[field] = Array.isArray(messages) ? (messages as string[])[0] : String(messages);
        }
        setFieldErrors(parsedErrors);
        setError("Please fix the errors below.");
      } else {
        setError(responseData?.message || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key: string) => fieldErrors[key];

  if (!_hasHydrated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#0a1c3a] dark:text-white">
            Find<span className="text-[#E8701A]">My</span>Interior
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create your account — it's free</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-visible dark:bg-slate-900/80 dark:border dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Join the Platform</CardTitle>
            <CardDescription className="dark:text-slate-400">
              {step === "who"
                ? "First, tell us who you are"
                : isCustomer
                ? "Create your homeowner account"
                : "Set up your professional account"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-5 pt-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* ── Step 1: Who are you? ── */}
              {step === "who" && (
                <div className="space-y-4">
                  {/* Customer option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, role: "customer" });
                      setIsCustomer(true);
                      setStep("details");
                    }}
                    className="w-full flex items-center gap-4 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 rounded-xl p-4 text-left transition-all group"
                  >
                    <span className="text-3xl">🏠</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">Homeowner / Customer</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Looking to hire professionals for your home</p>
                    </div>
                    <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-orange-500" />
                  </button>

                  {/* Professional option */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">I am a professional / business</p>
                    <ProfessionalTypePicker
                      value={formData.role === "customer" ? "" : formData.role}
                      onChange={(v) => {
                        setFormData({ ...formData, role: v });
                        setIsCustomer(false);
                        setStep("details");
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Details ── */}
              {step === "details" && (
                <>
                  {/* Selected type display */}
                  {!isCustomer && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                        {PROFESSIONAL_CATEGORIES.flatMap((c) => c.types).find((t) => t.value === formData.role)?.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep("who")}
                        className="ml-auto text-xs text-orange-500 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium dark:text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`dark:bg-slate-800 dark:border-slate-700 dark:text-white ${field("name") ? "border-red-400" : ""}`}
                    />
                    {field("name") && <p className="text-xs text-red-600">{field("name")}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium dark:text-slate-300">Mobile Number</Label>
                    <div className="flex">
                      <span className="flex items-center px-3 border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm rounded-l-md">🇮🇳 +91</span>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setFormData({ ...formData, phone: v });
                          if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                        }}
                        className={`rounded-l-none dark:bg-slate-800 dark:border-slate-700 dark:text-white ${field("phone") ? "border-red-400" : ""}`}
                      />
                    </div>
                    {field("phone") ? (
                      <p className="text-xs text-red-600">{field("phone")}</p>
                    ) : (
                      <p className="text-xs text-slate-400">Must start with 6, 7, 8, or 9</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium dark:text-slate-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`dark:bg-slate-800 dark:border-slate-700 dark:text-white ${field("email") ? "border-red-400" : ""}`}
                    />
                    {field("email") && <p className="text-xs text-red-600">{field("email")}</p>}
                  </div>

                  {/* Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium dark:text-slate-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={8}
                          placeholder="Min 8 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${field("password") ? "border-red-400" : ""}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {field("password") && <p className="text-xs text-red-600">{field("password")}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password_confirmation" className="text-sm font-medium dark:text-slate-300">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="password_confirmation"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Repeat password"
                          value={formData.password_confirmation}
                          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                          className={`pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${field("password_confirmation") ? "border-red-400" : ""}`}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {field("password_confirmation") && <p className="text-xs text-red-600">{field("password_confirmation")}</p>}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <Label htmlFor="terms" className="text-xs font-normal text-slate-600 dark:text-slate-400 leading-snug">
                      I agree to the{" "}
                      <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>,{" "}
                      <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>, and{" "}
                      <Link href="/compliance" className="text-orange-600 hover:underline">Community Guidelines</Link>.
                    </Label>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              {step === "who" ? (
                <p className="text-center text-xs text-slate-400">Select your type above to continue</p>
              ) : (
                <>
                  <Button
                    type="submit"
                    className="w-full bg-[#E8701A] hover:bg-[#c25a12] text-white font-bold py-3 shadow-lg transition"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account →"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep("who")}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    ← Go back
                  </button>
                </>
              )}
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-500">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Multi-GST note */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg text-center">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Own multiple companies?</strong> Register once, then add more ventures from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
