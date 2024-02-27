import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import transactionService from '../../services/transaction.service';
import enrollmentService from '../../services/enrollment.service';

const PaymentCallBack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({});
  const [transaction, setTransaction] = useState({
    id: "",
    paymentMethodId: "",
    amount: "",
    status: "",
    transactionDate: "",
    learnerId: "",
    courseId: "",
    refundStatus: ""
  });

  const [enrollment, setEnrollment] = useState({
    learnerId: "",
    courseId: "",
    status: "",
    totalGrade: 0
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paramsObject = {};

    queryParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    setPaymentDetails(paramsObject);

    const transactionId = paramsObject.vnp_OrderInfo;

    if (transactionId && paramsObject.vnp_ResponseCode === '00') {
      // Uncomment the navigation line if needed
      // navigate('/payment-history');

      // Fetch current transaction details and then update the status
      transactionService.getTransactionById(transactionId)
        .then((response) => {
          // Assuming response is in the correct format
          const updatedTransaction = {
            ...response.data,
            status: "DONE"
          };
          setTransaction(updatedTransaction);
          console.log(updatedTransaction);
          transactionService.updateTransaction(transactionId, updatedTransaction);

          //create enrollment for successfully transaction
          enrollment.courseId = transaction.courseId;
          enrollment.learnerId = transaction.learnerId;
          enrollmentService.saveEnrollment(enrollment);
          //go to invoice page
          navigate(`/invoice/${transactionId}`)
        })
        .catch((error) => {
          console.error("Error fetching transaction details:", error);
        });
    }

    // Cleanup function if needed
    return () => {
      // Perform cleanup tasks if any
    };
  }, [location.search]);

  return (
    <div>
      <h2>PaymentCallBack</h2>
      <p>This component displays payment details:</p>
      <ul>
        {Object.entries(paymentDetails).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentCallBack;
