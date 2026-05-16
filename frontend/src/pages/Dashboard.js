import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

import RequestForm from "../components/RequestForm";

import RequestList from "../components/RequestList";

import Loader from "../components/Loader";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/requests");

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        {user?.role === "User" && showRequestForm && (
          <RequestForm
            fetchRequests={fetchRequests}
            onCreated={() => setShowRequestForm(false)}
            onCancel={() => setShowRequestForm(false)}
          />
        )}

        {loading ? (
          <Loader />
        ) : (
          <RequestList
            requests={requests}
            fetchRequests={fetchRequests}
            onNewRequest={
              user?.role === "User" ? () => setShowRequestForm(true) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
