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

enum TIME_TYPE {
  FULL_DAY = 'FULL_DAY',
  SPECIFIC_TIME = 'SPECIFIC_TIME'
}

export default function LeaveApplication() {
  const [timeType, setTimeType] = useState(TIME_TYPE.FULL_DAY);
  const [leaveType, setLeaveType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const isSpecificTimeType = timeType === TIME_TYPE.SPECIFIC_TIME;
  
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
    
    // 檢查結束日期是否早於開始日期
    const isEndDateValid = isSpecificTimeType || !startDate || !endDate || new Date(endDate) >= new Date(startDate);
    
    // 檢查結束時間是否至少比開始時間晚半小時（僅在指定時間模式下）
    let isEndTimeValid = true;
    if (isSpecificTimeType && startHour && startMinute && endHour && endMinute) {
      const startTimeMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
      const endTimeMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
      // 結束時間必須至少比開始時間晚30分鐘
      isEndTimeValid = endTimeMinutes >= startTimeMinutes + 30;
    }
    
    const newErrors = {
      name: !name,
      startDate: !startDate,
      endDate: timeType === TIME_TYPE.FULL_DAY && (!endDate || !isEndDateValid),
      startTime: isSpecificTimeType && (!startHour || !startMinute),
      endTime: isSpecificTimeType && ((!endHour || !endMinute) || !isEndTimeValid),
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
      console.log('valid form')
      setIsSubmitting(true);
      
      try {
        const formData = new FormData(form);
        console.log(formData);
        
        // 準備要送出的資料
        const applicationData = {
          name: (formData.get('name') as string)?.trim(),
          startDate: formData.get('startDate') as string,
          endDate: formData.get('endDate') as string,
          leaveType,
          reason: (formData.get('reason') as string)?.trim(),
          timeType,
          startTime: timeType === TIME_TYPE.SPECIFIC_TIME ? 
            `${formData.get('startHour')}:${formData.get('startMinute')}` : null,
          endTime: timeType === TIME_TYPE.SPECIFIC_TIME ? 
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
          setTimeType(TIME_TYPE.FULL_DAY);
          setStartDate('');
          setEndDate('');
          setStartHour('');
          setStartMinute('');
          setEndHour('');
          setEndMinute('');
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
            {/* 姓名、假別、全天/指定時間選擇 */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '24px',
              flexDirection: 'row',
              alignItems: 'flex-start'
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
                  <MenuItem value="" disabled>請選擇假別</MenuItem>
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

              <div style={{ flex: 1 }}>
                <FormControl component="fieldset" className="flex">
                  <RadioGroup
                    value={timeType}
                    onChange={(e) => {
                      setTimeType(e.target.value as TIME_TYPE);
                    }}
                    name="timeType"
                    row
                    style={{ alignItems: 'flex-start' }}
                  >
                    <FormControlLabel 
                      value={TIME_TYPE.FULL_DAY} 
                      control={<Radio />} 
                      label="全天" 
                    />
                    <FormControlLabel 
                      value={TIME_TYPE.SPECIFIC_TIME} 
                      control={<Radio />} 
                      label="指定時間" 
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            {/* 請假日期區間 */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '24px',
              flexDirection: 'row',
              alignItems: 'flex-start'
            }}>
              <TextField
                style={{ flex: 1, marginRight: '16px' }}
                label="開始日期"
                name="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // 當是指定時間模式時，同步更新結束日期
                  if (timeType === TIME_TYPE.SPECIFIC_TIME) {
                    setEndDate(e.target.value);
                    console.log('set end date as' + e.target.value);
                  }
                }}
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
                style={{ flex: 1, marginRight: '16px' }}
                label="結束日期"
                name="endDate"
                type="date"
                required
                value={endDate}
                onChange={(e) => {
                  if (timeType === TIME_TYPE.FULL_DAY) {
                    setEndDate(e.target.value);
                  }
                }}
                disabled={timeType === TIME_TYPE.SPECIFIC_TIME}
                inputProps={{
                  min: startDate || undefined
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                error={errors.endDate}
                helperText={errors.endDate ? '請選擇結束日期' : (timeType === TIME_TYPE.SPECIFIC_TIME ? '指定時間模式下結束日期自動同步開始日期' : (startDate ? '結束日期不能早於開始日期' : ''))}
                sx={{
                  '& input[type="date"]': {
                    cursor: timeType === TIME_TYPE.SPECIFIC_TIME ? 'not-allowed' : 'pointer',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: timeType === TIME_TYPE.SPECIFIC_TIME ? 'not-allowed' : 'pointer',
                  },
                }}
              />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minHeight: '56px' }}>
                {timeType === TIME_TYPE.SPECIFIC_TIME ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FormControl size="small" error={errors.startTime}>
                        <Select
                          name="startHour"
                          displayEmpty
                          value={startHour}
                          onChange={(e) => setStartHour(e.target.value)}
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
                          value={startMinute}
                          onChange={(e) => setStartMinute(e.target.value)}
                          style={{ minWidth: '70px' }}
                        >
                          <MenuItem value="" disabled>分</MenuItem>
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="30">30</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    
                    <Typography variant="body2" color="textSecondary">至</Typography>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FormControl size="small" error={errors.endTime}>
                        <Select
                          name="endHour"
                          displayEmpty
                          value={endHour}
                          onChange={(e) => {
                            setEndHour(e.target.value);
                            // 當結束小時改變時，檢查是否需要調整結束分鐘以滿足最小半小時間隔
                            if (startHour && startMinute && e.target.value === startHour) {
                              // 如果是同一小時，且開始分鐘是30，則結束時間必須是下一小時
                              if (startMinute === '30') {
                                setEndMinute('');
                                setEndHour('');
                              } else if (startMinute === '00') {
                                // 如果開始是00分，結束必須是30分或更晚
                                setEndMinute('30');
                              }
                            }
                          }}
                          style={{ minWidth: '70px' }}
                        >
                          <MenuItem value="" disabled>時</MenuItem>
                          {Array.from({ length: 24 }, (_, i) => {
                            if (i>=8 && i<=18) {
                              const hourStr = i.toString().padStart(2, '0');
                              let isDisabled = false;
                              
                              if (startHour && startMinute) {
                                // 如果開始時間是30分，同一小時不能作為結束時間
                                if (startMinute === '30' && hourStr === startHour) {
                                  isDisabled = true;
                                }
                                // 結束時間不能早於開始時間
                                else if (parseInt(hourStr) < parseInt(startHour)) {
                                  isDisabled = true;
                                }
                              }
                              
                              return (
                                <MenuItem key={i} value={hourStr} disabled={isDisabled}>
                              {hourStr}
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
                          value={endMinute}
                          onChange={(e) => setEndMinute(e.target.value)}
                          style={{ minWidth: '70px' }}
                        >
                          <MenuItem value="" disabled>分</MenuItem>
                          {['00', '30'].map((minute) => {
                            let isDisabled = false;
                            
                            if (startHour && startMinute && endHour === startHour) {
                              // 同一小時內，結束分鐘必須至少比開始分鐘晚30分鐘
                              const startMinutes = parseInt(startMinute);
                              const endMinutes = parseInt(minute);
                              isDisabled = endMinutes < startMinutes + 30;
                            }
                            
                            return (
                              <MenuItem key={minute} value={minute} disabled={isDisabled}>
                                {minute}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </div>
                    {(errors.startTime || errors.endTime) && (
                      <Typography variant="caption" color="error" style={{ fontSize: '0.75rem', position: 'absolute', top: '100%', left: 0 }}>
                        {errors.startTime ? '請選擇開始時間' : errors.endTime ? '請選擇結束時間，且至少需比開始時間晚30分鐘' : '請選擇時間'}
                      </Typography>
                    )}
                  </>
                ) : null}
              </div>
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