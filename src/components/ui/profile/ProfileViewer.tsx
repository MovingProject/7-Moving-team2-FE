"use client"; // 이 파일은 클라이언트에서 실행됩니다.

import { useState, useEffect } from "react";
import ProfileImage from "@/components/ui/profile/ProfileImage";
import { getRandomProfileImage } from "@/utils/constant/getProfileImage";

interface ProfileViewerProps {
  initialImageUrl: string;
  size?: "sm" | "md" | "lg";
}

export default function ProfileViewer({ initialImageUrl, size = "md" }: ProfileViewerProps) {
  const [profileImageSrc, setProfileImageSrc] = useState(
    initialImageUrl || getRandomProfileImage()
  );

  return <>{profileImageSrc && <ProfileImage src={profileImageSrc} size={size} />}</>;
}
