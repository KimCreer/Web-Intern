import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ProgressLog from './components/ProgressLog';
import SupervisorDashboard from './components/SupervisorDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          setError('User role not found.');
        }
      } catch (err) {
        setError('Failed to fetch user role.');
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (loading) return <p>Loading user info...</p>;
  if (!user) return <p>No user found. Please log in again.</p>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2>Dashboard</h2>
          <p>Welcome, <b>{user.email}</b> ({role})</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <hr />

      {role === 'intern' && (
        <ProgressLog />
      )}
      
      {role === 'supervisor' && (
        <SupervisorDashboard />
      )}
      
      {role === 'admin' && (
        <>
          <h3>Admin Dashboard (Coming Soon)</h3>
          <p>Manage users and view analytics here.</p>
        </>
      )}
    </div>
  );
}

export default Dashboard; 