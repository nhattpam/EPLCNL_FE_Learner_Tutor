import React from 'react'
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'

const ListClassCourse = () => {
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
                    <h4 className="page-title">List Class Course</h4>
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
                          <Link to="/tutor/courses/create" className="btn btn-primary">
                            Create Course
                          </Link>
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
                            <th data-hide="phone">Image</th>
                            <th>CODE</th>
                            <th data-toggle="true">Course Name</th>
                            <th data-toggle="true">Category</th>
                            <th data-hide="phone, tablet">Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <img src='https://imgv2-2-f.scribdassets.com/img/document/450288336/original/b650a3aafc/1704919648?v=1' style={{ height: '50px', width: '30px' }}></img>
                            </td>
                            <td>FL22</td>
                            <td>Traffic Court Referee</td>
                            <td>A1</td>
                            <td><span className="badge label-table badge-success">Active</span></td>
                            <td>
                              <Link to={"/check-center"}>
                                <i class="fa-regular fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4AAU6sJHMKCLdsw83LpkP5JDJHFSONg4tUA&usqp=CAU' style={{ height: '50px', width: '30px' }}></img>
                            </td>
                            <td>KO21</td>
                            <td>Saw Court Referee</td>
                            <td>C1</td>
                            <td><span className="badge label-table badge-success">Active</span></td>
                            <td>
                              <Link to={"/check-center"}>
                                <i class="fa-regular fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img src='https://m.media-amazon.com/images/I/518Mac+q-VL._AC_UF894,1000_QL80_.jpg' style={{ height: '50px', width: '30px' }}></img>
                            </td>
                            <td>MO11</td>
                            <td>Dens Court Referee</td>
                            <td>C2</td>
                            <td><span className="badge label-table badge-danger">InActive</span></td>
                            <td>
                              <Link to={"/check-center"}>
                                <i class="fa-regular fa-eye"></i>
                              </Link>
                            </td>
                          </tr>

                        </tbody>
                        <tfoot>
                          <tr className="active">
                            <td colSpan={5}>
                              <div className="text-right">
                                <ul className="pagination pagination-rounded justify-content-end footable-pagination m-t-10 mb-0" />
                              </div>
                            </td>
                          </tr>
                        </tfoot>
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

export default ListClassCourse