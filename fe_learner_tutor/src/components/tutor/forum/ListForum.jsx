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



    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

 

    useEffect(() => {
        tutorService
            .getAllForumsByTutor(tutorId)
            .then((res) => {
                console.log(res.data);
                setForumList(res.data);

            })
            .catch((error) => {
                console.log(error);
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
                                        <h4 className="page-title">List Forum Of Tutor</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">
                                                    <div className="form-group mr-2">
                                                        <select id="demo-foo-filter-status" className="custom-select custom-select-sm">
                                                            <option value>Show all</option>
                                                            <option value="active">Active</option>
                                                            <option value="disabled">Disabled</option>
                                                            <option value="suspended">Suspended</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                <thead>
                                                    <tr>
                                                        <th data-toggle="true">Forum Id</th>
                                                        <th>Course</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentForums.map((forum) => (
                                                        <tr key={forum.id}>
                                                            <td>{forum.id}</td>
                                                            <td>{forum.course.name}</td>
                                                            <td>
                                                                <Link to={`/edit-forum/${forum.id}`}>
                                                                    <i class="fa-regular fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                            
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
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
        </>
    )
}

export default ListForum