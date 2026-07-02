import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductSkeleton = ({ cards = 6 }) => {
  return (
    <div className="home-page d-flex flex-wrap">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div className="card m-2" key={i} style={{ width: "18rem" }}>
            <Skeleton height={300} />
            <div className="card-body">
              <Skeleton height={20} width={`80%`} />
              <Skeleton height={20} width={`60%`} />
              <Skeleton height={30} width={`100%`} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductSkeleton;
