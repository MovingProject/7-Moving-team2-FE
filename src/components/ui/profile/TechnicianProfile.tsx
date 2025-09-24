"use client";
import clsx from "clsx";
import { useCard } from "../card/CardContext";
import LikeButton from "../LikeButton";
import MovingInfoViewer, { MovingInfo } from "./MovingInfoViewer";
import ProfileViewer from "./ProfileViewer";

interface Profile {
  name?: string;
  greeting?: string;
  imageUrl?: string;
  movingInfo?: MovingInfo;
  likes?: {
    count: number;
    isLiked: boolean;
  };
}

interface TechnicianInfoProps {
  profile: Profile;
  show?: ("name" | "greeting" | "services" | "movingInfo" | "estimated" | "likes")[];
  size?: "sm" | "md" | "lg";
  movingInfo?: MovingInfo;
  className?: string;
}

export default function TechnicianProfile({
  profile = {},
  show = ["name", "movingInfo"],
  className,
}: TechnicianInfoProps) {
  const { size } = useCard(); // Card에서 내려준 size
  const isVisible = (
    key: "name" | "greeting" | "services" | "movingInfo" | "estimated" | "likes"
  ) => show.includes(key);
  const likeButtonClasses =
    size === "sm" || size === "md" ? "top-2 right-3" : "top-1/2 -translate-y-1/2 right-2"; // Again, redundant

  return (
    <div className={`relative flex items-center gap-3 ${className ?? ""}`}>
      {profile.imageUrl && <ProfileViewer initialImageUrl={profile.imageUrl} size={size} />}

      <div className={`flex flex-col ${size !== "sm" ? "gap-1" : "gap-2"}`}>
        {isVisible("name") && (
          <p
            className={`${size !== "sm" && size !== "md" ? "text-lg" : "text-base"} font-semibold text-gray-800`}
          >
            {profile.name ?? "-"}
          </p>
        )}
        {isVisible("greeting") && profile.greeting && (
          <p className={`${size != "sm" ? "text-base" : "text-sm"} text-gray-600`}>
            {profile.greeting}
          </p>
        )}

        {isVisible("movingInfo") && profile.movingInfo && (
          <MovingInfoViewer info={profile.movingInfo} infoType="review" />
        )}
        {isVisible("services") && profile.movingInfo && (
          <MovingInfoViewer info={profile.movingInfo} infoType="localservice" />
        )}
        {isVisible("estimated") && profile.movingInfo && (
          <MovingInfoViewer info={profile.movingInfo} infoType="estimate" />
        )}
        {isVisible("likes") && profile.likes && (
          <LikeButton
            count={profile.likes?.count}
            isLiked={profile.likes?.isLiked}
            className={clsx("absolute", likeButtonClasses)}
          />
        )}
      </div>
    </div>
  );
}
