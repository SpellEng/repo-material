import React from 'react';
import { Rate, List } from 'antd';
import "./ReviewsAndRatings.css"

const ReviewsAndRatings = ({ reviews }) => {

    return (
        <div className="ReviewsAndRatings mt-3">
            <div className="mt-5">
                <h2 className="mb-4">Reviews</h2>
                <List
                    itemLayout="horizontal"
                    dataSource={reviews}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<img src={item?.userId?.picture?.url} width="32" height="32" />}
                                title={item?.userId?.fullName}
                                description={
                                    <div>
                                        <Rate disabled value={item?.rating} />
                                        <p>{item?.message}</p>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default ReviewsAndRatings;