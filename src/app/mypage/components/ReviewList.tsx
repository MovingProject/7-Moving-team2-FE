import ReviewItem from "./ReviewItem";

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
