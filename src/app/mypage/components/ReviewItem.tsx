import Image from "next/image";
import StarEmpty from "@/assets/icon/StarEmpty.svg";
import StarFilled from "@/assets/icon/StarFilled.svg";
import { ReviewResponseDto } from "@/lib/apis/reviewApi";

export default function ReviewItem({ review }: { review: ReviewResponseDto }) {
  const formattedDate = new Date(review.createdAt).toISOString().split("T")[0];
  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <div className="mb-1 flex items-center justify-start gap-[14px] text-sm">
          <span className="text-gray-900">{review.consumerName}</span>
          <span className="text-gray-200"> | </span>
          <span className="text-gray-400">{formattedDate}</span>
        </div>
        <div className="mb-2 flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Image
              key={i}
              src={i < review.rating ? StarFilled : StarEmpty}
              alt="star"
              width={16}
              height={16}
            />
          ))}
        </div>
      </div>

      <p className="whitespace-pre-wrap text-gray-800">{review.content}</p>
    </div>
  );
}
