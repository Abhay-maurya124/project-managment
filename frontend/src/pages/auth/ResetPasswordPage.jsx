import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Loader2, LogIn } from "lucide-react";
import { resetpassword } from "../../store/slices/authSlice";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authUser, isRequestingForToken } = useSelector((state) => state.auth);
  const [email, setemail] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (authUser) {
      if (authUser.role === "Admin") navigate("/admin-dashboard");
      else if (authUser.role === "Teacher") navigate("/teacherdashboard");
      else navigate("/StudentDashboard");
    }
  }, [authUser, navigate]);
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!validateForm()) return;
    dispatch(resetpassword(email ));
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <LogIn size={32} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">Forgot Password</h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Enter your email and we'll send you a reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="Enter E-mail"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <button
            type="submit"
            disabled={isRequestingForToken}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md flex items-center justify-center disabled:opacity-70"
          >
            {isRequestingForToken ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending mail...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage;