import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom'
import tutorService from '../../../services/tutor.service';

const ListForum = () => {

    const { tutorId } = useParams();
    const [forumList, setForumList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [forumsPerPage] = useState(5);

    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING



    useEffect(() => {
        tutorService
            .getAllForumsByTutor(tutorId)
            .then((res) => {
                console.log(res.data);
                setForumList(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [tutorId]);

    const filteredForums = forumList
        .filter((forum) => {
            return (
                forum.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredForums.length / forumsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * forumsPerPage;
    const currentForums = filteredForums.slice(offset, offset + forumsPerPage);

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                {/* ============================================================== */}
                {/* Start Page Content here */}
                {/* ============================================================== */}
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                            </ol>
                                        </div>
                                        <h4 className="page-title">LIST OF FORUMS</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        {/* <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                        {loading && (
                                            <div className="loading-overlay">
                                                <div className="loading-spinner" />
                                            </div>
                                        )}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th colSpan={2}>Course</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentForums.length > 0 && currentForums.map((forum, index) => (
                                                            <tr key={forum.id}>
                                                                <td>{index + 1}</td>
                                                                <td><img src={forum.course?.imageUrl} style={{ height: '100px', width: '200px' }} alt={forum.course?.name} /></td>

                                                                <td>{forum.course?.name}</td>
                                                                <td>
                                                                    <Link to={`/edit-forum/${forum.id}`} className='text-secondary'>
                                                                        <i class="fas fa-comment-dots"></i>
                                                                    </Link>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                        currentForums.length === 0 && (
                                            <p className='text-center mt-3'>No forums found.</p>
                                        )
                                    }
                                    </div> {/* end card-box */}
                                  
                                </div> {/* end col */}
                            </div>
                            {/* end row */}



                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

                <Footer />
            </div>
            <style>
                {
                    `
                    .loading-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        backdrop-filter: blur(10px); /* Apply blur effect */
                        -webkit-backdrop-filter: blur(10px); /* For Safari */
                        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999; /* Ensure it's on top of other content */
                    }
                    
                    .loading-spinner {
                        border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                        border-top: 8px solid #f58d04; /* Orange color */
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite; /* Rotate animation */
                    }
                    
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                    
                    `
                }
            </style>
        </>
    )
}

export default ListForum