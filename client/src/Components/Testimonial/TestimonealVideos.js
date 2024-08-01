import { Col, Row } from 'antd'
import React from 'react'

const TestimonealVideos = () => {
    return (
        <Row gutter={[23, 23]}>
            <Col xs={24} md={12} lg={8} className="rightTestimonail">
                <iframe
                    width="560"
                    height="300"
                    src="https://www.youtube.com/embed/g32qUM-Gb7Q?si=PnJASqmLrzf-K8dU"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </Col>
            <Col xs={24} md={12} lg={8} className="rightTestimonail">
                <iframe
                    width="560"
                    height="300"
                    src="https://www.youtube.com/embed/9X5WdHbSrBA?si=8vSgjcnlQ9mVN5Dl"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </Col>
            <Col xs={24} md={12} lg={8} className="rightTestimonail">
                <iframe
                    width="560"
                    height="300"
                    src="https://www.youtube.com/embed/DlDNU7lMWYE?si=TOrVCKPEyZsVoT8v"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </Col>
        </Row>
    )
}

export default TestimonealVideos
