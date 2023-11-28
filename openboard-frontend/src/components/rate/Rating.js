import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'

const Rating = ({ defaultValue, onRate }) => {
    const [value, setValue] = useState(defaultValue || 0);
    const stars = Array.from({ length: 5 }, (_, index) => index + 1);

    const handleStarClick = (selectedValue) => {
        // document.querySelector("#stars").classList.add("disabled")
        if(value === defaultValue || value === 0) {
            setValue(selectedValue);
            onRate(selectedValue);
        }
    };

    return (
        <div id="stars">
            {stars.map((star) => (
                <FaStar size={25}
                    key={star}
                    className={star <= value ? 'text-warning' : 'text-secondary'}
                    onClick={() => handleStarClick(star)}
                />
            ))}
        </div>
    );
};

export default Rating;
