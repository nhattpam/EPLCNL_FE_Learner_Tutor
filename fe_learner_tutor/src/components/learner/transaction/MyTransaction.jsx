import React, { useState, useEffect, useRef } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';
import learnerService from '../../../services/learner.service';

const MyTransaction = () => {
    const learnerId = localStorage.getItem('learnerId');
    const [transactionList, setTransactionList] = useState([]);
    const contentRef = useRef(null);

    useEffect(() => {
        learnerService
            .getAllTransactionByLearnerId(learnerId)
            .then((res) => {
                setTransactionList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);

    const scroll = (scrollOffset) => {
        contentRef.current.scrollLeft += scrollOffset;
    };

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                <div className="breadcrumbs">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>My Transaction</h2>
                    </div>
                </div>
                <section id="courses" className="courses mt-2">
                    <div className="container" data-aos="fade-up">
                        <div className="tab-content" id="myLearningTabsContent">
                            <div className="tab-pane fade show active" id="tab-content-1" style={{ marginTop: '-80px' }}>
                                <div className="container" data-aos="fade-up">
                                    <div className="list-container" data-aos="zoom-in" data-aos-delay={100}>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Image</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Payment Method</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Transaction Date</th>
                                                    <th scope="col">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactionList.map((transaction, index) => (
                                                    <tr key={transaction.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>
                                                            <img src={transaction.course.imageUrl} alt={transaction.course.name} className="img-fluid" style={{ maxWidth: '250px', maxHeight: '100px' }} />
                                                        </td>
                                                        <td>
                                                            {transaction.course.isOnlineClass ? (
                                                                <h3><Link to={`/study-class/${transaction.courseId}`}>{transaction.course.name}</Link></h3>
                                                            ) : (
                                                                <h3><Link to={`/study-course/${transaction.courseId}`}>{transaction.course.name}</Link></h3>
                                                            )}
                                                        </td>
                                                        <td>${transaction.course.stockPrice}</td>
                                                        <td>{transaction.paymentMethod.name}</td>
                                                        <td>{transaction.amount} dong</td>
                                                        <td>{transaction.transactionDate}</td>
                                                        <td>{transaction.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};


export default MyTransaction;
