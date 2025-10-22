"use client";
import React from "react";
import BaseCard, { CommonCardProps } from "./BaseCard";
import Tag from "../Tag";
import Button from "../Button";
import { MoveTypeMap } from "@/types/moveTypes";
import { ReviewData } from "@/types/card";
import UserProfileArea from "../profile/UserProfileArea";

interface ReviewCardProps extends CommonCardProps {
  review?: ReviewData;
  onReviewClick?: () => void;
  hideButton?: boolean;
}

export default function ReviewCard({
  user,
  request,
  quotation,
  review,
  onReviewClick,
  hideButton = false,
}: ReviewCardProps) {
  const tags = request?.serviceType;
  const reviewDate = review?.createdAt;
  return (
    <BaseCard className="gap-4 border border-gray-300 bg-white px-[14px] py-4 lg:max-w-[640px] lg:gap-4 lg:px-6 lg:py-5">
      <div className="flex justify-between">
        {tags && (
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <Tag
                key={index}
                type={MoveTypeMap[tag].clientType}
                content={MoveTypeMap[tag].content}
              />
            ))}
          </div>
        )}
        {reviewDate && <span className="text-sm text-gray-400">{reviewDate}</span>}
      </div>
      <UserProfileArea
        user={user}
        request={request}
        quotation={quotation}
        show={["name", "estimated"]}
      />
      {review?.content ? (
        <p className="text-sm text-gray-600 lg:text-base">{review.content}</p>
      ) : (
        !hideButton && (
          <div>
            <Button size="sm" textSize="mobile" text="리뷰 작성하기" onClick={onReviewClick} />
          </div>
        )
      )}
    </BaseCard>
  );
}
