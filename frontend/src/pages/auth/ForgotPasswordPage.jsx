import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { forgetpassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isUpdatingPassword } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const result = await dispatch(forgetpassword({ token, data: formData }));

    if (forgetpassword.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Set New Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full pl-10 pr-10 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

               <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full pl-10 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 flex justify-center items-center"
          >
            {isUpdatingPassword ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;