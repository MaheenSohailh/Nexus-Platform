// // pages/otp/OTP.tsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export const OTP: React.FC = () => {
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const verify = () => {
//     if (otp === "123456") {
//       if(user?.role === "entrepreneur") navigate("/dashboard/entrepreneur");
//       else if(user?.role === "investor") navigate("/dashboard/investor");
//     } else {
//       alert("Invalid OTP");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
//       <h1 className="text-2xl font-bold">Enter OTP</h1>
//       <input
//         type="text"
//         maxLength={6}
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         className="border p-2 rounded text-center w-32"
//         placeholder="123456"
//       />
//       <button onClick={verify} className="px-4 py-2 bg-blue-600 text-white rounded">Verify</button>
//       <p className="text-gray-500 text-sm">OTP is 123456 (mock)</p>
//     </div>
//   );
// };