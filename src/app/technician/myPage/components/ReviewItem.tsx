import StarMd from "@/assets/icon/Star-md.svg";
import StarYellowMd from "@/assets/icon/StarYellow-md.svg";

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  content: string;
}

export default function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <div className="mb-1 flex items-center justify-start gap-[14px] text-sm">
          <span className="text-[#1F1F1F]">{review.author}</span>
          <span className="text-[#E6E6E6]"> | </span>
          <span className="text-[#ABABAB]">{review.date}</span>
        </div>
        <div className="mb-2 flex">
          {Array.from({ length: 5 }, (_, i) => (
            <img
              key={i}
              src={i < review.rating ? StarYellowMd.src : StarMd.src}
              alt="star"
              className="h-4 w-4"
            />
          ))}
        </div>
      </div>

      <p className="text-gray-800">{review.content}</p>
    </div>
  );
}
