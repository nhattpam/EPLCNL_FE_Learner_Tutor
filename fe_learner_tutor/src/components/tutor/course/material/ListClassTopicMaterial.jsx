import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../Footer'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import { Link } from 'react-router-dom'
import classLessonService from '../../../../services/class-lesson.service';
import topicService from '../../../../services/topic.service';

const ListClassTopicMaterial = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }

  const { storedClassTopicId } = useParams();
  const [materialList, setMaterialList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [materialsPerPage] = useState(5);

  const [classTopic, setClassTopic] = useState({
    name: '',
  });

  const [lessonMaterial, setLessonMaterial] = useState({
    name: '',
    materialUrl: '',
    createdDate: '',
    updatedDate: ''
  });

  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getClassTopicById(storedClassTopicId)
        .then((res) => {
          setClassTopic(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassTopicId]);

  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getAllMaterialsByClassTopic(storedClassTopicId)
        .then((res) => {
          setMaterialList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassTopicId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredLessonMaterials = materialList
    .filter((material) => {
      return (
        material.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredLessonMaterials.length / materialsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * materialsPerPage;
  const currentLessonMaterials = filteredLessonMaterials.slice(offset, offset + materialsPerPage);

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
                    <h4 className="page-title">MATERIALS OF TOPIC - <span className='text-success'>{classTopic.name}</span> </h4>
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
                          {/* Create Tutor Button */}
                          <Link to={`/tutor/courses/create-class-material/${storedClassTopicId}`} >
                            <button className="btn btn-success mr-2">
                              Create
                            </button>
                          </Link>

                          <div className="form-group">
                            <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                        <thead className="thead-light">
                          <tr>
                            <th data-toggle="true">Material Name</th>
                            {/* <th>Url</th> */}
                            <th data-hide="phone">Created Date</th>
                            <th data-hide="phone, tablet">Updated Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            currentLessonMaterials.length > 0 && currentLessonMaterials.map((material) => (
                              <tr key={material.id}>
                                <td>{material.name}</td>
                                {/* <td>{material.materialUrl}</td> */}
                                <td>{material.createdDate}</td>
                                <td>{material.updatedDate}</td>
                                <td>
                                  <Link to={`/tutor/courses/edit-class-material/${material.id}`} className='text-danger'>
                                    <i class="fas fa-trash-alt"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          }

                        </tbody>

                      </table>

                    </div> {/* end .table-responsive*/}

                  </div> {/* end card-box */}
                  {currentLessonMaterials.length === 0 && (
                    <p>No materials yet</p>
                  )}
                </div> {/* end col */}
              </div>
              {/* end row */}



            </div> {/* container */}
          </div> {/* content */}
        </div>
        {/* ============================================================== */}
        {/* End Page content */}
        {/* ============================================================== */}

      </div >
    </>
  )
}

export default ListClassTopicMaterial