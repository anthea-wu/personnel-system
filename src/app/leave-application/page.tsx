'use client';

import Navbar from "@/components/Navbar";
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Select, 
  MenuItem, 
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';

export default function LeaveApplication() {
  const [timeType, setTimeType] = useState('fullDay');
  const [leaveType, setLeaveType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // 錯誤狀態管理
  const [errors, setErrors] = useState({
    name: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    leaveType: false,
    reason: false
  });

  // 驗證函數
  const validateForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const startHour = formData.get('startHour') as string;
    const startMinute = formData.get('startMinute') as string;
    const endHour = formData.get('endHour') as string;
    const endMinute = formData.get('endMinute') as string;
    const reason = (formData.get('reason') as string)?.trim();
    
    const newErrors = {
      name: !name,
      startDate: !startDate,
      endDate: !endDate,
      startTime: timeType === 'specificTime' && (!startHour || !startMinute),
      endTime: timeType === 'specificTime' && (!endHour || !endMinute),
      leaveType: !leaveType,
      reason: !reason
    };
    
    setErrors(newErrors);
    
    // 檢查是否有任何錯誤
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    // 清除之前的訊息
    setSubmitMessage(null);
    
    if (validateForm(form)) {
      setIsSubmitting(true);
      
      try {
        const formData = new FormData(form);
        
        // 準備要送出的資料
        const applicationData = {
          name: (formData.get('name') as string)?.trim(),
          startDate: formData.get('startDate') as string,
          endDate: formData.get('endDate') as string,
          leaveType,
          reason: (formData.get('reason') as string)?.trim(),
          timeType,
          startTime: timeType === 'specificTime' ? 
            `${formData.get('startHour')}:${formData.get('startMinute')}` : null,
          endTime: timeType === 'specificTime' ? 
            `${formData.get('endHour')}:${formData.get('endMinute')}` : null,
        };
        
        // 調用API
        const response = await fetch('/api/leave-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationData),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          setSubmitMessage({
            type: 'success',
            text: '請假申請已成功提交！'
          });
          
          // 重置表單
          form.reset();
          setLeaveType('');
          setTimeType('fullDay');
          setErrors({
            name: false,
            startDate: false,
            endDate: false,
            startTime: false,
            endTime: false,
            leaveType: false,
            reason: false
          });
          
        } else {
          setSubmitMessage({
            type: 'error',
            text: result.error || '提交失敗，請稍後再試'
          });
        }
        
      } catch (error) {
        console.error('提交請假申請時發生錯誤:', error);
        setSubmitMessage({
          type: 'error',
          text: '網路錯誤，請檢查連線後再試'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('表單驗證失敗');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="xl" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          請假申請
        </Typography>
        
        <Paper elevation={3} style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* 姓名、假別、請假日期區間 */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '24px',
              flexDirection: 'row'
            }}>
              <TextField
                style={{ flex: 1, marginRight: '16px' }}
                label="姓名"
                name="name"
                required
                variant="outlined"
                error={errors.name}
                helperText={errors.name ? '請輸入姓名' : ''}
              />

              <FormControl style={{ flex: 1, marginRight: '16px' }} required error={errors.leaveType}>
                <InputLabel>請假假別</InputLabel>
                <Select
                  value={leaveType}
                  label="請假假別"
                  onChange={(e) => setLeaveType(e.target.value)}
                  name="leaveType"
                >
                  <MenuItem value="annual">特休</MenuItem>
                  <MenuItem value="personal">事假</MenuItem>
                  <MenuItem value="sick">病假</MenuItem>
                </Select>
                {errors.leaveType && (
                  <Typography variant="caption" color="error" style={{ marginTop: '3px', marginLeft: '14px' }}>
                    請選擇請假假別
                  </Typography>
                )}
              </FormControl>

              <TextField
                style={{ flex: 1, marginRight: '16px' }}
                label="開始日期"
                name="startDate"
                type="date"
                required
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                error={errors.startDate}
                helperText={errors.startDate ? '請選擇開始日期' : ''}
                sx={{
                  '& input[type="date"]': {
                    cursor: 'pointer',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  },
                }}
              />
              <TextField
                style={{ flex: 1 }}
                label="結束日期"
                name="endDate"
                type="date"
                required
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                error={errors.endDate}
                helperText={errors.endDate ? '請選擇結束日期' : ''}
                sx={{
                  '& input[type="date"]': {
                    cursor: 'pointer',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  },
                }}
              />
            </div>

            {/* 請假時間 */}
            <div style={{ marginBottom: '24px' }}>
              <FormControl component="fieldset" className="flex">
                <RadioGroup
                  value={timeType}
                  onChange={(e) => setTimeType(e.target.value)}
                  name="timeType"
                  row
                  style={{ alignItems: 'flex-start' }}
                >
                  <FormControlLabel 
                    value="fullDay" 
                    control={<Radio />} 
                    label="全天" 
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FormControlLabel 
                      value="specificTime" 
                      control={<Radio />} 
                      label="指定時間" 
                    />
                    {timeType === 'specificTime' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FormControl size="small" error={errors.startTime}>
                            <Select
                              name="startHour"
                              displayEmpty
                              defaultValue=""
                              style={{ minWidth: '70px' }}
                            >
                              <MenuItem value="" disabled>時</MenuItem>
                              {Array.from({ length: 24 }, (_, i) => {
                                if (i>=8 && i<=18) {
                                  return (
                                    <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </MenuItem>
                                  )
                                }
                                return null;
                              })}
                            </Select>
                          </FormControl>
                          <Typography variant="body2">:</Typography>
                          <FormControl size="small" error={errors.startTime}>
                            <Select
                              name="startMinute"
                              displayEmpty
                              defaultValue=""
                              style={{ minWidth: '70px' }}
                            >
                              <MenuItem value="" disabled>分</MenuItem>
                              {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i} value={(i * 5).toString().padStart(2, '0')}>
                                  {(i * 5).toString().padStart(2, '0')}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {errors.startTime && (
                            <Typography variant="caption" color="error" style={{ fontSize: '0.75rem' }}>
                              請選擇時間
                            </Typography>
                          )}
                        </div>
                        
                        <Typography variant="body2" color="textSecondary">至</Typography>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FormControl size="small" error={errors.endTime}>
                            <Select
                              name="endHour"
                              displayEmpty
                              defaultValue=""
                              style={{ minWidth: '70px' }}
                            >
                              <MenuItem value="" disabled>時</MenuItem>
                              {Array.from({ length: 24 }, (_, i) => {
                                if (i>=8 && i<=18) {
                                  return (
                                    <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </MenuItem>
                                  )
                                }
                                return null;
                              })}
                            </Select>
                          </FormControl>
                          <Typography variant="body2">:</Typography>
                          <FormControl size="small" error={errors.endTime}>
                            <Select
                              name="endMinute"
                              displayEmpty
                              defaultValue=""
                              style={{ minWidth: '70px' }}
                            >
                              <MenuItem value="" disabled>分</MenuItem>
                              {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i} value={(i * 5).toString().padStart(2, '0')}>
                                  {(i * 5).toString().padStart(2, '0')}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {errors.endTime && (
                            <Typography variant="caption" color="error" style={{ fontSize: '0.75rem' }}>
                              請選擇時間
                            </Typography>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </FormControl>
            </div>

            {/* 請假原因 */}
            <div style={{ marginBottom: '24px' }}>
              <TextField
                fullWidth
                label="請假原因"
                name="reason"
                multiline
                rows={4}
                required
                placeholder="請輸入請假原因..."
                variant="outlined"
                error={errors.reason}
                helperText={errors.reason ? '請輸入請假原因' : ''}
              />
            </div>

            {/* 送出按鈕 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '送出申請'
                )}
              </Button>
            </div>
          </form>
        </Paper>
        
        {/* 提交訊息顯示 */}
        {submitMessage && (
          <Alert
            severity={submitMessage.type}
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              right: 20,
              zIndex: 1000,
              maxWidth: '600px',
              margin: '0 auto'
            }}
            onClose={() => setSubmitMessage(null)}
          >
            {submitMessage.text}
          </Alert>
        )}
      </Container>
    </div>
  );
} 