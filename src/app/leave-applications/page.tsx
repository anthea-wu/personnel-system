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
  Alert,
  Box,
  TableSortLabel
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
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const handleLeaveTypeChipClick = (leaveType: string) => {
    if (leaveTypeFilter === leaveType) {
      setLeaveTypeFilter('all');
    } else {
      setLeaveTypeFilter(leaveType);
    }
  };

  const handleStatusChipClick = (status: string) => {
    if (statusFilter === status) {
      setStatusFilter('all');
    } else {
      setStatusFilter(status);
    }
  };

  const clearAllFilters = () => {
    setLeaveTypeFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = leaveTypeFilter !== 'all' || statusFilter !== 'all';

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortApplications = (apps: LeaveApplication[]) => {
    if (!sortField) return apps;
    
    return [...apps].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'duration':
          // 計算請假時間長度用於排序
          const aDuration = calculateDuration(a);
          const bDuration = calculateDuration(b);
          aValue = aDuration;
          bValue = bDuration;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  const calculateDuration = (app: LeaveApplication) => {
    if (app.timeType === 'fullDay') {
      // 全天假以天數計算（結束日期 - 開始日期 + 1）
      const start = new Date(app.startDate);
      const end = new Date(app.endDate);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } else if (app.startTime && app.endTime) {
      // 指定時間以分鐘計算
      const [startHour, startMin] = app.startTime.split(':').map(Number);
      const [endHour, endMin] = app.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return endMinutes - startMinutes;
    }
    return 0;
  };

  const filteredAndSortedApplications = sortApplications(
    applications.filter((app) => {
      const leaveTypeMatch = leaveTypeFilter === 'all' || app.leaveType === leaveTypeFilter;
      const statusMatch = statusFilter === 'all' || app.status === statusFilter;
      return leaveTypeMatch && statusMatch;
    })
  );

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

        <Paper elevation={1} style={{ padding: '16px', marginBottom: '24px' }}>
          <Typography variant="h6" gutterBottom>
            篩選條件
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', minHeight: '40px' }}>
            {leaveTypeFilter !== 'all' && (
              <Chip
                label={getLeaveTypeText(leaveTypeFilter)}
                size="small"
                variant="filled"
                color="primary"
                onDelete={() => setLeaveTypeFilter('all')}
                clickable
                onClick={() => setLeaveTypeFilter('all')}
              />
            )}
            {statusFilter !== 'all' && (
              <Chip
                label={getStatusText(statusFilter)}
                size="small"
                variant="filled"
                color={getStatusColor(statusFilter) as any}
                onDelete={() => setStatusFilter('all')}
                clickable
                onClick={() => setStatusFilter('all')}
              />
            )}
            {hasActiveFilters && (
              <Button
                variant="text"
                size="small"
                onClick={clearAllFilters}
                sx={{ ml: 1 }}
              >
                清除全部篩選
              </Button>
            )}
            {!hasActiveFilters && (
              <Typography variant="body2" color="textSecondary">
                點擊表格中的標籤來篩選資料
              </Typography>
            )}
          </Box>
        </Paper>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>申請人</TableCell>
                  <TableCell>假別</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'startDate'}
                      direction={sortField === 'startDate' ? sortDirection : 'asc'}
                      onClick={() => handleSort('startDate')}
                    >
                      開始日期
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>結束日期</TableCell>
                  <TableCell>時間類型</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'duration'}
                      direction={sortField === 'duration' ? sortDirection : 'asc'}
                      onClick={() => handleSort('duration')}
                    >
                      請假時間
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'createdAt'}
                      direction={sortField === 'createdAt' ? sortDirection : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      申請時間
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>請假原因</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="textSecondary">
                        {applications.length === 0 ? '目前沒有請假申請記錄' : '沒有符合篩選條件的記錄'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getLeaveTypeText(app.leaveType)} 
                          size="small" 
                          variant="outlined"
                          clickable
                          onClick={() => handleLeaveTypeChipClick(app.leaveType)}
                          sx={{ cursor: 'pointer' }}
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
                          clickable
                          onClick={() => handleStatusChipClick(app.status)}
                          sx={{ cursor: 'pointer' }}
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
          顯示 {filteredAndSortedApplications.length} / {applications.length} 筆申請記錄
        </Typography>
      </Container>
    </div>
  );
} 