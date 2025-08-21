"use client";

import { PreviewImage } from "@/components/Hosting/Steps/PhotosStep";
import { api } from "@/lib/api/api";
import { createClient } from "@/lib/supabase/client";
import { basicButton } from "@/lib/styles";
import { CreateProfile } from "@/lib/types/profile";
import { uploadFiles } from "@/lib/uploadthing";
import { cleanString, isValidUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCamera, FiFileText, FiUser } from "react-icons/fi";
import { Container } from "../../components/Container";

const supabase = createClient();

export default function AuthCallback() {
  const router = useRouter();
  const [step, setStep] = useState<"verifying" | "profile" | "completed">("verifying");
  const [profileImage, setProfileImage] = useState<PreviewImage>();
  const [profileData, setProfileData] = useState<CreateProfile>({
    firstName: "",
    lastName: "",
    bio: "",
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setProfileImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleUploadImage = async () => {
    if (!profileImage || !profileImage?.file) {
      return;
    }
    try {
      const response = await uploadFiles("imagesUploader", { files: [profileImage.file] });

      if (response) {
        return response[0].ufsUrl;
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Image upload failed, try again.");
    }
  };

  const handleCreateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const avatarUrl = await handleUploadImage();
      const data = verifyProfileData({ ...profileData, avatarUrl });
      const signUpResponse = await api.signUp(data);

      if (signUpResponse?.success) {
        setStep("completed");
        setLoading(false);
        toast.success("Account created.", { duration: 2000 });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error("Failed to create account");
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
      <Container className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-myGreenExtraLight to-myGreen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 bg-myGreenSemiBold rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-myGrayDark mb-2">Verifiying account...</h1>
          <p className="text-myGray text-lg">You will be redirected shortly</p>
        </motion.div>
      </Container>
    );
  }

  if (step === "completed") {
    return (
      <Container className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-myGreenExtraLight to-myGreen">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, rotate: 360 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-16 h-16 bg-myGreenSemiBold rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.div animate={{ rotate: 360 }}>✓</motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl font-semibold text-myGrayDark mb-2"
          >
            Profile completed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-myGray text-lg"
          >
            Redirecting to main page...
          </motion.p>
        </div>
      </Container>
    );
  }

  if (step === "profile") {
    return (
      <Container className="flex flex-col items-center justify-center bg-gradient-to-br from-myGreenExtraLight to-myGreen">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-myGreen">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-myGreenSemiBold rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiUser className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-2xl font-semibold text-myGrayDark mb-2"
              >
                Complete your profile
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className="text-myGray">
                Tell us more about yourself
              </motion.p>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-6">
              {/* Profile picture with small scale animation */}
              <motion.div
                className="space-y-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-myGrayDark">Profile picture (optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-myGreen rounded-full cursor-pointer hover:border-myGreenSemiBold transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {profileImage && profileImage.url ? (
                        <Image src={profileImage.url} alt="Preview" height={20} width={20} className="w-20 h-20 rounded-full object-cover" />
                      ) : (
                        <>
                          <FiCamera className="w-6 h-6 text-myGreen group-hover:text-myGreenSemiBold mb-2" />
                          <p className="text-xs text-myGray">Upload</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
              </motion.div>

              {/* First name input */}
              <motion.div className="space-y-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
                <label className="block text-sm font-medium text-myGrayDark">First name *</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myGreen focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Tu nombre"
                />
              </motion.div>

              {/* Last name input */}
              <motion.div className="space-y-2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0, duration: 0.4 }}>
                <label className="block text-sm font-medium text-myGrayDark">Last name *</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myGreen focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Tu apellido"
                />
              </motion.div>

              {/* Biography textarea */}
              <motion.div className="space-y-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 0.4 }}>
                <label className="block text-sm font-medium text-myGrayDark">Biography (optional)</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-myGreen focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-none"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </motion.div>

              {/* Submit button with scale animation */}
              <motion.button
                type="submit"
                disabled={loading || !profileData.firstName || !profileData.lastName}
                className={`${basicButton} w-full bg-myGreenSemiBold text-myGrayDark py-3 px-6 rounded-lg font-medium hover:bg-myGreen transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.3 }}
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
              </motion.button>
            </form>
          </div>
        </motion.div>
      </Container>
    );
  }
}

function verifyProfileData(profileData: CreateProfile): CreateProfile {
  const avatarUrl = profileData.avatarUrl ? (isValidUrl(profileData.avatarUrl.trim()) ? profileData.avatarUrl.trim() : "") : "";
  return {
    firstName: cleanString(profileData.firstName),
    lastName: cleanString(profileData.lastName),
    bio: profileData.bio ? cleanString(profileData.bio.trim()) : "",
    avatarUrl,
  };
}
