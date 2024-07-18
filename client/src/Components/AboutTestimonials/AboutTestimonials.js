import React, { useRef, useState } from 'react';
import RahulPic from "../../assets/RahulPic.png";
import NeerajPic from "../../assets/NeerajPic.png";
import AdityaPic from "../../assets/AdityaPic.png";
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import "./AboutTestimonials.css";
import TestimonialCard from './TestimonialCard/TestimonialCard';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

const AboutTestimonials = () => {
    const [swiperInstance, setSwiperInstance] = useState(null);

    const testimonialArray = [
        {
            photo: RahulPic,
            name: " Rahul Kumar",
            post: "Marketing Manager",
            rating: 4.25,
            description:
                "SpellEng empowered me to confidently speak English in meetings and deliver presentations by reducing my hesitation. Now, as a Marketing Manager, I excel in communication thanks to their personalized sessions.",
        },
        {
            photo: NeerajPic,
            name: " Neeraj Gupta ",
            post: "Civil Engineer",
            rating: 5,
            description:
                "Before SpellEng, I didn't know much English. But with their help, I learned from the beginning. My tutor was patient and taught me simple words and sentences. Now, I feel more confident when I speak English.",
        },
        {
            photo: AdityaPic,
            name: " Aditya Aggarwal ",
            post: "Law Student",
            rating: 4.5,
            description:
                "I used to employ very basic words and often mispronounced them. SpellEng significantly enhanced my vocabulary and pronunciation skills. I now express myself confidently in English. Thank you, SpellEng, for making learning enjoyable.",
        },
    ];

    const handleNext = () => {
        if (swiperInstance) {
            swiperInstance.slideNext();
        }
    };

    const handlePrev = () => {
        if (swiperInstance) {
            swiperInstance.slidePrev();
        }
    };

    return (
        <div className='AboutTestimonials'>
            <div className='leftContainer'>
                <h1>Success Stories with SpellEng</h1>
                <p>
                    Real Voices, Real Results: Experience the power of personalized English tutoring
                    through the stories of our satisfied users.
                </p>
                <div className='arrowsContainer'>
                    <button className='btn' onClick={handlePrev}>
                        <FaArrowLeftLong />
                    </button>
                    <button className='btn' onClick={handleNext}>
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>
            <div>
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    autoplay={true}
                    onSwiper={(swiper) => setSwiperInstance(swiper)}
                    className="swiper"
                    modules={[Autoplay]}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        }
                    }}
                >
                    {testimonialArray.map((testimonial, index) => (
                        <SwiperSlide key={index} className="swiperSlide">
                            <TestimonialCard testimonialProps={testimonial} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default AboutTestimonials;
