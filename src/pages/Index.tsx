
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
          Event Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive platform for managing events, notifications, and users. 
          Login to the admin dashboard to get started.
        </p>
        <Button 
          size="lg" 
          className="font-medium"
          onClick={() => navigate("/admin")}
        >
          Admin Login
        </Button>
      </div>
      
      <footer className="absolute bottom-0 w-full py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Event Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
