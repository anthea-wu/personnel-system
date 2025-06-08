'use client';

import Navbar from "@/components/Navbar";
import { 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert
} from '@mui/material';
import { useState, useEffect } from 'react';

interface LeaveApplication {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  timeType: string;
  startTime: string | null;
  endTime: string | null;
  status: string;
  createdAt: string;
}

export default function LeaveApplications() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leave-applications');
      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.applications);
        setError(null);
      } else {
        setError('無法載入請假申請資料');
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getLeaveTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      'annual': '特休',
      'personal': '事假',
      'sick': '病假'
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    const statuses: { [key: string]: string } = {
      'pending': '待審核',
      'approved': '已核准',
      'rejected': '已拒絕'
    };
    return statuses[status] || status;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Navbar />
        <Container maxWidth="xl" style={{ paddingTop: '48px' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            請假申請記錄
          </Typography>
          <Typography>載入中...</Typography>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="xl" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Typography variant="h4" component="h1">
            請假申請記錄
          </Typography>
          <Button 
            variant="outlined" 
            onClick={fetchApplications}
            disabled={loading}
          >
            重新整理
          </Button>
        </div>

        {error && (
          <Alert severity="error" style={{ marginBottom: '24px' }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>申請人</TableCell>
                  <TableCell>假別</TableCell>
                  <TableCell>開始日期</TableCell>
                  <TableCell>結束日期</TableCell>
                  <TableCell>時間類型</TableCell>
                  <TableCell>請假時間</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>申請時間</TableCell>
                  <TableCell>請假原因</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="textSecondary">
                        目前沒有請假申請記錄
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getLeaveTypeText(app.leaveType)} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{app.startDate}</TableCell>
                      <TableCell>{app.endDate}</TableCell>
                      <TableCell>{app.timeType === 'fullDay' ? '全天' : '指定時間'}</TableCell>
                      <TableCell>
                        {app.timeType === 'specificTime' && app.startTime && app.endTime
                          ? `${app.startTime} - ${app.endTime}`
                          : '全天'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(app.status)} 
                          size="small" 
                          color={getStatusColor(app.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(app.createdAt).toLocaleString('zh-TW')}
                      </TableCell>
                      <TableCell style={{ maxWidth: '200px' }}>
                        <Typography variant="body2" noWrap title={app.reason}>
                          {app.reason}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Typography variant="body2" color="textSecondary" style={{ marginTop: '16px' }}>
          總共 {applications.length} 筆申請記錄
        </Typography>
      </Container>
    </div>
  );
} 