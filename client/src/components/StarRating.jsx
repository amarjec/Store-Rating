import { useState } from "react";

const StarRating = ({ rating, onRate, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`focus:outline-none transition-colors duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            onClick={() => !readOnly && onRate(ratingValue)}
            onMouseEnter={() => !readOnly && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            <span className={`text-2xl ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
          </button>
        );
      })}
    </div>
  );
};
export default StarRating;