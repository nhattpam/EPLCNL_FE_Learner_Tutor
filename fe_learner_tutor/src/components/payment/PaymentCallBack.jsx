import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentCallBack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(location.search);

    // Get all parameters and convert them to an object
    const paramsObject = {};
    queryParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    // Set the extracted details to state
    setPaymentDetails(paramsObject);

    // Check the vnp_ResponseCode and navigate if it's "00"
    if (paramsObject.vnp_ResponseCode === '00') {
      navigate('/payment-history');
    }
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
