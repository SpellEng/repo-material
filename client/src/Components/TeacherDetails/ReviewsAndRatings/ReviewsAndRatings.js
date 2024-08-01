import React, { useState } from 'react';
import { Rate, List, Button } from 'antd';
import "./ReviewsAndRatings.css"

const ReviewsAndRatings = ({ reviews }) => {
    const [visibleReviews, setVisibleReviews] = useState(5);

    const handleShowAll = () => {
        setVisibleReviews(reviews.length);
    };

    return (
        <div className="ReviewsAndRatings mt-3">
            <div className="mt-5">
                <h2 className="mb-4">Reviews</h2>
                <List
                    itemLayout="horizontal"
                    dataSource={reviews.slice(0, visibleReviews)?.reverse()}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<img src={item?.userId?.picture?.url} width="32" height="32" />}
                                title={item?.userId?.fullName}
                                description={
                                    <div>
                                        <Rate allowHalf disabled value={item?.rating} />
                                        <p>{item?.message}</p>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                {visibleReviews < reviews.length && (
                    <div className="text-left mt-4">
                        <Button onClick={handleShowAll}>See More</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsAndRatings;
