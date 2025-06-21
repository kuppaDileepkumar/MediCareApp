import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const response = await axios.post(`http://localhost:5000/api/auth${endpoint}`, {
        username,
        password,
      });

      if (isLogin) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/"); // redirect to home
      } else {
        alert("Registration successful. Please login.");
        setIsLogin(true); // switch to login after registration
      }
    } catch (err) {
      alert(`Authentication failed: ${isLogin ? "Invalid credentials" : "Username may already exist"}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="border w-full p-2 mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition">
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginRegister;
