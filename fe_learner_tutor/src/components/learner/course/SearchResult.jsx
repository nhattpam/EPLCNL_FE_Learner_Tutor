import React from 'react';
import { Link } from 'react-router-dom';

const SearchResult = ({ searchQuery, filteredCourses, filteredTutors }) => {
    return (
        <>
            {searchQuery !== "" && (
                <div className="modal-container">
                    <div className="modal-background" ></div>
                    <div className="modal-content">
                        <h2>Search Results for "{searchQuery}"</h2>

                        {/* Render filtered courses */}
                        <div>
                            {filteredCourses.map(course => (
                                <div key={course.id} className='iitem'>
                                    <img src={course.imageUrl} alt={course.name} style={{ width: '100px', height: '70px' }} />
                                    <Link to={`/detail-course/${course.id}`}>
                                        <p style={{ fontWeight: 'bold', color: '#f58d04' }}>{course.name}</p>
                                    </Link>
                                    {/* Render other course details as needed */}
                                </div>
                            ))}
                        </div>

                        {/* Render filtered tutors */}
                        <div>
                            {filteredTutors.map(tutor => (
                                <div key={tutor.id} className='iitem'>
                                    <img src={tutor.account.imageUrl} alt={tutor.account.fullName} style={{ width: '100px', height: '70px' }} />
                                    <Link to={`/detail-tutor/${tutor.id}`}>
                                        <p style={{ fontWeight: 'bold', color: '#f58d04' }}>{tutor.account.fullName}</p>
                                    </Link>
                                    {/* Render other tutor details as needed */}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}

            <style>
                {`
                .modal-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000; /* Ensure modal is on top of other content */
                }
                
                .modal-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
                    z-index: 999; /* Ensure it covers everything but the modal */
                }
                
                .modal-content {
                    background-color: #fff; /* White background for modal */
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Box shadow for depth */
                    z-index: 1000; /* Ensure modal content is on top */
                }
                
                .iitem {
                    transition: transform 0.3s ease;
                }
                
                .iitem:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                
                `}
            </style>
        </>

    );
};

export default SearchResult;
