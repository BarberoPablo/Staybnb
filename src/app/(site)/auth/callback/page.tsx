"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { FiUser, FiFileText /* , FiCamera */ } from "react-icons/fi";
import { motion } from "framer-motion";
/* import Image from "next/image"; */
import { api } from "@/lib/api/api";
import { CreateProfile } from "@/lib/types/profile";
import { useSearchParams } from "next/navigation";
import { basicButton } from "@/lib/supabase/styles";

const supabase = createClient();

export default function AuthCallback() {
  const router = useRouter();
  const [step, setStep] = useState<"verifying" | "profile" | "completed">("verifying");
  const [profileData, setProfileData] = useState<CreateProfile>({
    firstName: "",
    lastName: "",
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const emailExpired = params.get("error_code")?.includes("expired");

    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          toast.error(`${sessionError.message}\nRedirecting...`, { duration: 3000 });
          setTimeout(() => {
            router.replace("/");
          }, 3000);
          return;
        }

        if (emailExpired) {
          if (session?.user) {
            setStep("profile");
            return;
          } else {
            // User needs to be logged in to create a profile
            toast.error("Session expired.\nPlease log in and set your profile.", { duration: 3000 });
            setTimeout(() => {
              router.replace(`/auth?redirectTo=${encodeURIComponent("/auth/callback")}`);
            }, 3000);
            return;
          }
        }

        if (session?.user) {
          //  User is logged in
          const profile = await api.getProfile();

          if (profile) {
            toast.success("Profile is complete. Redirecting...", { duration: 3000 });
            setTimeout(() => {
              router.replace("/");
            }, 3000);
          } else {
            setStep("profile");
          }
        } else {
          toast.error("No session found.\nPlease login.", { duration: 2000 });
          setTimeout(() => {
            router.replace(`/auth?redirectTo=${encodeURIComponent("/auth/callback")}`);
          }, 2000);
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error((error as Error).message, { duration: 2000 });
        setTimeout(() => {
          router.replace("/");
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [router, userEmail]);

  const handleInputChange = (field: keyof CreateProfile, value: string | File | null) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  /* const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange("avatarUrl", file);
  }; */

  const handleCreateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.signUp(profileData);

      if (response.success) {
        setStep("completed");
        setLoading(false);
        toast.success("Account created.", { duration: 2000 });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      toast.error((error as Error).message, { duration: 3000 });
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-myGreenLight to-myGreen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 bg-myGreenBold rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-myGrayDark mb-2">Verifiying account...</h1>
          <p className="text-myGray text-lg">You will be redirected shortly</p>
        </motion.div>
      </div>
    );
  }

  if (step === "completed") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-myGreenLight to-myGreen">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 bg-myGreenBold rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              ✓
            </motion.div>
          </div>
          <h1 className="text-2xl font-semibold text-myGrayDark mb-2">Profile completed!</h1>
          <p className="text-myGray text-lg">Redirecting to main page...</p>
        </motion.div>
      </div>
    );
  }

  if (step === "profile") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-myGreenLight to-myGreen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-myGreen">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-myGreenBold rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-myGrayDark mb-2">Complete your profile</h1>
              <p className="text-myGray">Tell us more about yourself</p>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-6">
              {/* <div className="space-y-3">
                <label className="block text-sm font-medium text-myGrayDark">Profile picture (optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-myGreen rounded-full cursor-pointer hover:border-myGreenBold transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {profileData.avatarUrl ? (
                        <Image src={profileData.avatarUrl} alt="Preview" height={20} width={20} className="w-20 h-20 rounded-full object-cover" />
                      ) : (
                        <>
                          <FiCamera className="w-6 h-6 text-myGreen group-hover:text-myGreenBold mb-2" />
                          <p className="text-xs text-myGray">Upload</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
              </div> */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-myGrayDark">First name *</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myGreen focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-myGrayDark">Last name *</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myGreen focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Tu apellido"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-myGrayDark">Biography (optional)</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myGreen focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-none"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !profileData.firstName || !profileData.lastName}
                className={`${basicButton} w-full bg-myGreenBold text-white py-3 px-6 rounded-lg font-medium hover:bg-myGreenDark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Completing profile...
                  </>
                ) : (
                  <>
                    <FiFileText className="w-5 h-5" />
                    Complete profile
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
}
