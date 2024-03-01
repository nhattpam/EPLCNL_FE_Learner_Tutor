import React, { useState } from 'react';

const StarRating = ({ onChange }) => {
    const [rating, setRating] = useState(0); // Initial rating is 0, meaning no stars are selected

    // Function to handle click on a star
    const handleStarClick = (value) => {
        setRating(value); // Update the rating state
        onChange(value); // Pass the rating value to the parent component
    };

    return (
        <div className='star-rating' style={{marginTop: '-40px'}}>
            {[1, 2, 3, 4, 5].map((starValue) => (
                <span
                    key={starValue}
                    onClick={() => handleStarClick(starValue)}
                    style={{ cursor: 'pointer', color: starValue <= rating ? '#f58d04' : 'gray' }}
                >
                    &#9733; {/* Unicode character for a star */}
                </span>
            ))}
            <style>
                {`
                .star-rating {
                    unicode-bidi: bidi-override;
                    color: #cccc00;
                    font-size: 48px; /* Adjust the font size to make stars bigger */
                    margin: 0;
                    padding: 0;
                    display: inline-block;
                  }
                  
                  .star-rating > span {
                    display: inline-block;
                    position: relative;
                    width: 1.1em;
                  }
                  
                  .star-rating > span:hover:before,
                  .star-rating > span:hover ~ span:before {
                    position: absolute;
                  }
                  
                `}
            </style>
        </div>

    );
};

export default StarRating;
