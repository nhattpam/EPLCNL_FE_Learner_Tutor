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
                .modal-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
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
