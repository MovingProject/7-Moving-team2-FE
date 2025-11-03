import ReviewItem from "./ReviewItem";
import { ReviewResponseDto } from "@/lib/apis/reviewApi";

interface ReviewListProps {
  reviews: ReviewResponseDto[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return <div className="py-10 text-center text-gray-400">작성된 리뷰가 아직 없습니다.</div>;
  }

  return (
    <div className="divide-y divide-gray-200">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
