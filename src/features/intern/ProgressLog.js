import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import AIInsights from '../../components/AIInsights';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import DashboardSection from './components/DashboardSection';
import LogProcessSection from './components/LogProcessSection';
import MOASection from './components/MOASection';
import ReportingsSection from './components/ReportingsSection';
import ProfileSection from './components/ProfileSection';

const PLMUN_LOGO = 'https://s.yimg.com/zb/imgv1/b78a2d83-7709-3a13-a971-0109aa12560b/t_500x300';
const NAVY = '#0a2342';
const NAVY_LIGHT = '#274472';

function ProgressLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tasksCompleted: '',
    challenges: '',
    nextSteps: '',
    timeIn: '',
    timeOut: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [user, setUser] = useState(auth.currentUser);
  const [attendance, setAttendance] = useState({ timeIn: null, timeOut: null });
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [moaUrl, setMoaUrl] = useState('');
  const [moaUploading, setMoaUploading] = useState(false);
  const [moaError, setMoaError] = useState('');
  const [moaSuccess, setMoaSuccess] = useState('');
  const [reportType, setReportType] = useState('Weekly');
  const [reportDesc, setReportDesc] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const todayStr = dayjs().format('YYYY-MM-DD');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [selectedMenu]);

  const fetchLogs = async () => {
    setLoading(true);
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
      setLogs(logsData);
    } catch (error) {
      setError('Error fetching logs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setAttendanceLoading(true);
    try {
      const q = query(
        collection(db, 'attendance'),
        where('userId', '==', auth.currentUser.uid),
        where('date', '==', todayStr)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setAttendance({ timeIn: data.timeIn, timeOut: data.timeOut });
      } else {
        setAttendance({ timeIn: null, timeOut: null });
      }
    } catch (error) {
      setAttendance({ timeIn: null, timeOut: null });
    } finally {
      setAttendanceLoading(false);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setAttendanceHistory(data);
    } catch (error) {
      setAttendanceHistory([]);
    }
  };

  const handleTimeIn = async () => {
    try {
      await addDoc(collection(db, 'attendance'), {
        userId: auth.currentUser.uid,
        date: todayStr,
        timeIn: dayjs().format('HH:mm:ss'),
        timeOut: null,
      });
      fetchAttendance();
    } catch (error) {
      // handle error
    }
  };

  const handleTimeOut = async () => {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('userId', '==', auth.currentUser.uid),
        where('date', '==', todayStr)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await docRef.update({ timeOut: dayjs().format('HH:mm:ss') });
        fetchAttendance();
      }
    } catch (error) {
      // handle error
    }
  };

  // Helper to generate and save AI insights for a log
  const generateAndSaveInsights = async (logId, logData) => {
    try {
      // Prepare prompt for Gemini
      const logsText = `Date: ${new Date().toLocaleDateString()}\nTasks: ${logData.tasksCompleted}\nChallenges: ${logData.challenges || 'None'}\nNext Steps: ${logData.nextSteps}`;
      const prompt = `You are an internship progress assistant. Analyze the following progress log and provide:\nSummary:\nKey Achievements:\nGrowth Areas:\nRecommendations:\n\nLog:\n${logsText}`;
      // Call Gemini API
      const geminiText = await window.generateGeminiInsights(prompt); // assumes global or import
      // Save insights to Firestore as a field in the log
      const logRef = window.db.collection('progress').doc(logId); // assumes global or import
      await logRef.update({ aiInsights: geminiText });
    } catch (err) {
      // handle error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const docRef = await addDoc(collection(db, 'progress'), {
        userId: auth.currentUser.uid,
        date: today,
        timeIn: formData.timeIn,
        timeOut: formData.timeOut,
        tasksCompleted: formData.tasksCompleted,
        challenges: formData.challenges,
        nextSteps: formData.nextSteps,
        createdAt: serverTimestamp(),
      });
      setFormData({
        tasksCompleted: '',
        challenges: '',
        nextSteps: '',
        timeIn: '',
        timeOut: '',
      });
      setSuccess('Progress log submitted! Generating AI insights...');
      // Generate and save AI insights
      await generateAndSaveInsights(docRef.id, formData);
      fetchLogs();
    } catch (error) {
      setError('Error adding log.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/login';
  };

  // Add MOA and Reportings to menu
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { key: 'logprocess', label: 'Log Process', icon: <InsightsIcon /> },
    // Attendance is now part of Log Process
    { key: 'moa', label: 'MOA', icon: <DescriptionIcon /> },
    { key: 'reportings', label: 'Reportings', icon: <CloudUploadIcon /> },
    { key: 'profile', label: 'Profile', icon: <AccountCircleIcon /> },
    { key: 'logout', label: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  // Fetch MOA URL on mount
  useEffect(() => {
    const fetchMoa = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().moaUrl) {
          setMoaUrl(userDoc.data().moaUrl);
        }
      } catch {}
    };
    fetchMoa();
  }, []);

  // MOA upload handler
  const handleMoaUpload = async (e) => {
    setMoaError('');
    setMoaSuccess('');
    setMoaUploading(true);
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setMoaError('Please upload a PDF file.');
      setMoaUploading(false);
      return;
    }
    try {
      // Use Firebase Storage (assume window.firebaseStorage is set up)
      const storageRef = window.firebaseStorage.ref();
      const fileRef = storageRef.child(`moa/${auth.currentUser.uid}.pdf`);
      await fileRef.put(file);
      const url = await fileRef.getDownloadURL();
      await window.db.collection('users').doc(auth.currentUser.uid).update({ moaUrl: url });
      setMoaUrl(url);
      setMoaSuccess('MOA uploaded successfully!');
    } catch (err) {
      setMoaError('Failed to upload MOA.');
    }
    setMoaUploading(false);
  };

  // Fetch reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(
          collection(db, 'reports'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setReports(querySnapshot.docs.map(doc => doc.data()));
      } catch {}
    };
    fetchReports();
  }, []);

  // Report submit handler
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError('');
    setReportSuccess('');
    if (!reportDesc.trim()) {
      setReportError('Description is required.');
      return;
    }
    try {
      await addDoc(collection(db, 'reports'), {
        userId: auth.currentUser.uid,
        type: reportType,
        description: reportDesc,
        date: dayjs().format('YYYY-MM-DD'),
      });
      setReportDesc('');
      setReportSuccess('Report submitted!');
    } catch {
      setReportError('Failed to submit report.');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f4f8fb' }}>
      {/* Responsive Drawer/Menu */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? menuOpen : true}
        onClose={() => setMenuOpen(false)}
        sx={{
          width: isMobile ? '70vw' : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? '70vw' : 240,
            maxWidth: 320,
            boxSizing: 'border-box',
            background: NAVY,
            color: '#fff',
            borderRight: 'none',
            boxShadow: 4,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          <Tooltip title="Pamantasan ng Lungsod ng Muntinlupa - College of Information Technology Studies (CITS)" placement="right">
            <Avatar src={PLMUN_LOGO} alt="PLMun Logo" sx={{ width: 48, height: 48, mb: 1, bgcolor: '#fff', border: '2px solid #f4f8fb', boxShadow: 2, cursor: 'pointer' }} />
          </Tooltip>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              color: '#fff',
              textAlign: 'center',
              fontSize: 15,
              lineHeight: 1.1,
              mb: 0.5,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%',
              px: 1,
            }}
          >
            PLMun CITS
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#e3eaf6',
              textAlign: 'center',
              fontSize: 11,
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              px: 1,
            }}
          >
            Intern Portal
          </Typography>
        </Box>
        <Divider sx={{ background: '#274472', mb: 1 }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={selectedMenu === item.key}
                onClick={item.action ? item.action : () => handleMenuClick(item.key)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  color: '#fff',
                  '&.Mui-selected': { background: '#274472', color: '#fff', boxShadow: 2 },
                  '&:hover': { background: '#274472', color: '#fff' },
                  minHeight: 48,
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={<Typography fontWeight={600}>{item.label}</Typography>} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Hamburger for mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setMenuOpen(true)}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1301, background: NAVY, color: '#fff', '&:hover': { background: NAVY_LIGHT } }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, ml: { sm: 28, xs: 0 }, width: '100%' }}>
        {/* Menu-based content rendering */}
        {selectedMenu === 'dashboard' && (
          <DashboardSection logs={logs} NAVY={NAVY} NAVY_LIGHT={NAVY_LIGHT} />
        )}
        {selectedMenu === 'logprocess' && (
          <LogProcessSection
            logs={logs}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            success={success}
            NAVY={NAVY}
            NAVY_LIGHT={NAVY_LIGHT}
            loading={loading}
          />
        )}
        {selectedMenu === 'moa' && (
          <MOASection
            moaUrl={moaUrl}
            moaUploading={moaUploading}
            moaError={moaError}
            moaSuccess={moaSuccess}
            handleMoaUpload={handleMoaUpload}
            NAVY={NAVY}
            NAVY_LIGHT={NAVY_LIGHT}
          />
        )}
        {selectedMenu === 'reportings' && (
          <ReportingsSection
            reportType={reportType}
            reportDesc={reportDesc}
            handleReportTypeChange={e => setReportType(e.target.value)}
            handleReportDescChange={e => setReportDesc(e.target.value)}
            handleReportSubmit={handleReportSubmit}
            reportError={reportError}
            reportSuccess={reportSuccess}
            reports={reports}
            NAVY={NAVY}
            NAVY_LIGHT={NAVY_LIGHT}
          />
        )}
        {selectedMenu === 'profile' && (
          <ProfileSection
            user={user}
            NAVY={NAVY}
            NAVY_LIGHT={NAVY_LIGHT}
            PLMUN_LOGO={PLMUN_LOGO}
          />
        )}
      </Box>
    </Box>
  );
}

export default ProgressLog; 