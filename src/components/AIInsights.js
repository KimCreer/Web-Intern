import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { generateGeminiInsights } from './geminiApi';

function parseGeminiResponse(text) {
  // Try to extract sections from the Gemini response
  // Expecting sections like: Summary:, Key Achievements:, Growth Areas:, Recommendations:
  const summaryMatch = text.match(/Summary:(.*?)(Key Achievements:|$)/s);
  const achievementsMatch = text.match(/Key Achievements:(.*?)(Growth Areas:|$)/s);
  const growthAreasMatch = text.match(/Growth Areas:(.*?)(Recommendations:|$)/s);
  const recommendationsMatch = text.match(/Recommendations:(.*)/s);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : '',
    keyAchievements: achievementsMatch ? achievementsMatch[1].trim().split(/\n|\r/).filter(Boolean) : [],
    growthAreas: growthAreasMatch ? growthAreasMatch[1].trim().split(/\n|\r/).filter(Boolean) : [],
    recommendations: recommendationsMatch ? recommendationsMatch[1].trim().split(/\n|\r/).filter(Boolean) : [],
  };
}

function AIInsights({ userId, role }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line
  }, [userId]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      // Fetch last 5 progress logs
      const logsQuery = query(
        collection(db, 'progress'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      );
      const logsSnapshot = await getDocs(logsQuery);
      const logs = logsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));

      if (logs.length === 0) {
        setInsights({ message: 'No progress logs available for analysis.' });
        return;
      }

      // Prepare logs data for AI analysis
      const logsText = logs.map(log => `
        Date: ${log.createdAt.toLocaleDateString()}
        Tasks: ${log.tasksCompleted}
        Challenges: ${log.challenges || 'None'}
        Next Steps: ${log.nextSteps}
      `).join('\n\n');

      // Compose prompt for Gemini
      const prompt = `You are an internship progress assistant. Analyze the following progress logs and provide:
Summary:
Key Achievements:
Growth Areas:
Recommendations:

Logs:
${logsText}`;

      // Call Gemini API
      const geminiText = await generateGeminiInsights(prompt);
      const parsed = parseGeminiResponse(geminiText);
      setInsights({ ...parsed, createdAt: new Date() });
    } catch (err) {
      setError('Failed to generate insights. Please try again later.');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Analyzing progress data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!insights) return null;
  if (insights.message) return <div>{insights.message}</div>;

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h4>AI Progress Insights</h4>
      <div style={{ marginTop: '15px' }}>
        <h5>Summary</h5>
        <p>{insights.summary}</p>
      </div>
      <div style={{ marginTop: '15px' }}>
        <h5>Key Achievements</h5>
        <ul>
          {insights.keyAchievements?.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '15px' }}>
        <h5>Growth Areas</h5>
        <ul>
          {insights.growthAreas?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '15px' }}>
        <h5>Recommendations</h5>
        <ul>
          {insights.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      <div style={{ 
        fontSize: '0.8em',
        color: '#666',
        marginTop: '15px',
        borderTop: '1px solid #ddd',
        paddingTop: '10px'
      }}>
        Last updated: {insights.createdAt.toLocaleString()}
      </div>
    </div>
  );
}

export default AIInsights; 