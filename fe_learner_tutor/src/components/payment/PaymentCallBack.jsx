import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import transactionService from '../../services/transaction.service';
import enrollmentService from '../../services/enrollment.service';
import walletService from '../../services/wallet.service';
import walletHistoryService from '../../services/wallet-history.service';

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
    learner: []
  });

  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  if (!storedLoginStatus) {
      navigate(`/login`)
  }




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
          // setTransaction(updatedTransaction);
          console.log(updatedTransaction);
          transactionService.updateTransaction(transactionId, updatedTransaction);

          if (updatedTransaction.courseId === null) {
            walletService.getWalletById(updatedTransaction.learner?.account?.wallet?.id) //learner's wallet
              .then((response) => {
                const updatedWallet = {
                  balance: response.data.balance + (updatedTransaction.amount / 24000),
                  accountId: updatedTransaction.learner?.accountId,
                  transactionDate: updatedTransaction.transactionDate
                }
                console.log(JSON.stringify(updatedWallet));

                walletService.updateWallet(response.data.id, updatedWallet);
                const walletHistory = {
                  walletId: response.data.id,
                  note: `+${updatedTransaction.amount / 24000}$ receiving money from e-wallet at ${updatedTransaction.transactionDate}`,
                  transactionDate: updatedTransaction.transactionDate
                }

                walletHistoryService.saveWalletHistory(walletHistory);
              })
          } else {
            const updatedEnrollment = {
              status: "ONGOING",
              totalGrade: 0,
              transactionId: updatedTransaction.id,
              enrolledDate: updatedTransaction.transactionDate,
              refundStatus: false
            };


            console.log("This is enrollment: " + JSON.stringify(updatedEnrollment));
            enrollmentService.saveEnrollment(updatedEnrollment);

            walletService.getWalletById("188e9df9-be4b-4531-858e-098ff8c3735c") //admin's wallet
              .then((response) => {
                const updatedWallet = {
                  balance: response.data.balance + (updatedTransaction.amount / 24000),
                  accountId: "9b868733-8ab1-4191-92ab-65d1b82863c3",
                  transactionDate: updatedTransaction.transactionDate
                }

                //update admin wallet balance
                walletService.updateWallet(response.data.id, updatedWallet);
                const walletHistory = {
                  walletId: response.data.id,
                  note: `+${updatedTransaction.amount / 24000}$ from ${updatedTransaction.learner.account.fullName} by transaction ${transactionId} at ${updatedTransaction.transactionDate}`,
                  transactionDate: updatedTransaction.transactionDate
                }

                walletHistoryService.saveWalletHistory(walletHistory);
              })
          }

          // Navigate to invoice page
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