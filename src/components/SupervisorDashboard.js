import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AIInsights from './AIInsights';

function SupervisorDashboard() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      // Get all users with role 'intern'
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'intern')
      );
      const userSnapshot = await getDocs(usersQuery);
      
      // For each intern, get their latest progress log
      const internsData = await Promise.all(
        userSnapshot.docs.map(async (doc) => {
          const intern = { id: doc.id, ...doc.data() };
          
          // Get latest progress log
          const logsQuery = query(
            collection(db, 'progress'),
            where('userId', '==', doc.id),
            orderBy('createdAt', 'desc'),
            // limit(1) // Uncomment to get only the latest log
          );
          const logsSnapshot = await getDocs(logsQuery);
          intern.logs = logsSnapshot.docs.map(log => ({
            id: log.id,
            ...log.data(),
            createdAt: log.data().createdAt.toDate()
          }));
          
          return intern;
        })
      );
      
      setInterns(internsData);
    } catch (error) {
      console.error('Error fetching interns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (internId, logId) => {
    try {
      await addDoc(collection(db, 'feedback'), {
        internId,
        logId,
        feedback,
        createdAt: new Date()
      });
      setFeedback('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  if (loading) return <div>Loading interns data...</div>;

  return (
    <div>
      <h3>Interns Progress Overview</h3>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Interns List */}
        <div style={{ width: '30%', borderRight: '1px solid #ddd', paddingRight: '20px' }}>
          {interns.length === 0 ? (
            <p>No interns found.</p>
          ) : (
            interns.map(intern => (
              <div
                key={intern.id}
                onClick={() => setSelectedIntern(intern)}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedIntern?.id === intern.id ? '#f0f0f0' : 'white'
                }}
              >
                <p><strong>{intern.email}</strong></p>
                <p>Latest Update: {intern.logs.length > 0 
                  ? intern.logs[0].createdAt.toLocaleDateString()
                  : 'No logs yet'}</p>
              </div>
            ))
          )}
        </div>

        {/* Selected Intern's Progress Logs and Insights */}
        <div style={{ width: '70%' }}>
          {selectedIntern ? (
            <>
              <h4>{selectedIntern.email}'s Progress</h4>
              
              {/* AI Insights */}
              <AIInsights userId={selectedIntern.id} role="intern" />

              {/* Progress Logs */}
              <h4 style={{ marginTop: '20px' }}>Progress Logs</h4>
              {selectedIntern.logs.length === 0 ? (
                <p>No progress logs found for this intern.</p>
              ) : (
                selectedIntern.logs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '15px',
                      marginBottom: '15px'
                    }}
                  >
                    <p><strong>Date:</strong> {log.createdAt.toLocaleDateString()}</p>
                    <p><strong>Tasks Completed:</strong><br/>{log.tasksCompleted}</p>
                    {log.challenges && (
                      <p><strong>Challenges:</strong><br/>{log.challenges}</p>
                    )}
                    <p><strong>Next Steps:</strong><br/>{log.nextSteps}</p>
                    
                    {/* Feedback Section */}
                    <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                      <h5>Add Feedback</h5>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Enter your feedback..."
                        style={{ width: '100%', marginBottom: '10px' }}
                        rows="3"
                      />
                      <button
                        onClick={() => handleSubmitFeedback(selectedIntern.id, log.id)}
                        disabled={!feedback.trim()}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <p>Select an intern to view their progress logs.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupervisorDashboard; 