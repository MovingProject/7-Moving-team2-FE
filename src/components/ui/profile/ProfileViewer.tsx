"use client"; // 이 파일은 클라이언트에서 실행됩니다.

import ProfileImage from "@/components/ui/profile/ProfileImage";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";
import { useState, useEffect } from "react";

interface ProfileViewerProps {
  initialImageUrl: string;
  size?: "sm" | "md" | "lg";
}

export default function ProfileViewer({ initialImageUrl, size = "md" }: ProfileViewerProps) {
  const defaultImage = initialImageUrl || getRandomProfileImage();
  const [profileImageSrc, setProfileImageSrc] = useState(defaultImage);

  useEffect(() => {
    if (initialImageUrl) {
      setProfileImageSrc(initialImageUrl);
    }
  }, [initialImageUrl]);

  return <>{profileImageSrc && <ProfileImage src={profileImageSrc} />}</>;
}
