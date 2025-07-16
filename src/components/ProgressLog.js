import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import AIInsights from './AIInsights';

function ProgressLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tasksCompleted: '',
    challenges: '',
    nextSteps: '',
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const q = query(
        collection(db, 'progress'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched logs:', logsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'progress'), {
        userId: auth.currentUser.uid,
        ...formData,
        createdAt: serverTimestamp(),
      });
      setFormData({
        tasksCompleted: '',
        challenges: '',
        nextSteps: '',
      });
      fetchLogs(); // Refresh the logs list
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Progress Logs Section */}
        <div style={{ flex: '2' }}>
          <h3>Log Your Progress</h3>
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label>Tasks Completed:</label>
              <textarea
                name="tasksCompleted"
                value={formData.tasksCompleted}
                onChange={handleChange}
                required
                rows="3"
                style={{ width: '100%', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Challenges Faced:</label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Next Steps:</label>
              <textarea
                name="nextSteps"
                value={formData.nextSteps}
                onChange={handleChange}
                required
                rows="3"
                style={{ width: '100%', marginTop: '5px' }}
              />
            </div>
            <button type="submit">Submit Progress</button>
          </form>

          <h3>Previous Logs</h3>
          {loading ? (
            <p>Loading logs...</p>
          ) : logs.length === 0 ? (
            <p>No progress logs yet. Start by adding your first log!</p>
          ) : (
            <div>
              {logs.map(log => (
                <div key={log.id} style={{ 
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}>
                  <p><strong>Date:</strong> {
                    log.createdAt && (
                      log.createdAt.toDate
                        ? log.createdAt.toDate().toLocaleDateString()
                        : new Date(log.createdAt).toLocaleDateString()
                    )
                  }</p>
                  <p><strong>Tasks Completed:</strong><br/>{log.tasksCompleted}</p>
                  {log.challenges && <p><strong>Challenges:</strong><br/>{log.challenges}</p>}
                  <p><strong>Next Steps:</strong><br/>{log.nextSteps}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights Section */}
        <div style={{ flex: '1' }}>
          <AIInsights userId={auth.currentUser.uid} role="intern" />
        </div>
      </div>
    </div>
  );
}

export default ProgressLog; 