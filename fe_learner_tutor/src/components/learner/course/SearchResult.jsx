import { Link } from "react-router-dom";

const SearchResult = ({ searchQuery, filteredCourses, filteredTutors, onClose }) => {
    return (
        <>
            <div className="modal-container" style={{ display: searchQuery !== "" ? 'flex' : 'none'}}>
                <button className="close-button" style={{ color: '#fff', backgroundColor: '#f58d04', border: 'none', marginBottom: '20px' }} onClick={onClose}>Close</button>
                <div className="modal-content">
                    <h2>Search Results for "{searchQuery}"</h2>

                    {/* Grid layout */}
                    <div className="grid-container">
                        {/* Left side for courses */}
                        <div className="grid-column">
                            {filteredCourses.map(course => (
                                <div key={course.id} className='iitem'>
                                    <img src={course.imageUrl} alt={course.name} style={{ width: '100px', height: '70px' }} />
                                    <Link to={`/detail-course/${course.id}`} onClick={() => console.log('Link clicked')}>
                                        <p style={{ fontWeight: 'bold', color: '#f58d04' }}>{course.name}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Right side for tutors */}
                        <div className="grid-column">
                            {filteredTutors.map(tutor => (
                                <div key={tutor.id} className='iitem'>
                                    <img src={tutor.account?.imageUrl} alt={tutor.account?.fullName} style={{ width: '100px', height: '70px' }} />
                                    <Link>
                                        <p style={{ fontWeight: 'bold', color: '#f58d04' }}>{tutor.account?.fullName}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
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
                
                .grid-container {
                    display: flex;
                    justify-content: center;
                }
                
                .grid-column {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0 20px; /* Adjust as needed */
                }
                
                .iitem {
                    margin-bottom: 20px; /* Adjust as needed */
                }
                
                `}
            </style>
        </>


    );

};

export default SearchResult;
