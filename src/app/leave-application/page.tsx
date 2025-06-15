'use client';

import Navbar from "@/components/Navbar";
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
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
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

enum TIME_TYPE {
  FULL_DAY = 'FULL_DAY',
  SPECIFIC_TIME = 'SPECIFIC_TIME'
}

// 建立驗證 schema
const leaveApplicationSchema = z.object({
  name: z.string().min(1, '請輸入姓名'),
  leaveType: z.string().min(1, '請選擇請假假別'),
  timeType: z.nativeEnum(TIME_TYPE),
  startDate: z.string().min(1, '請選擇開始日期'),
  endDate: z.string().optional(),
  startHour: z.string().optional(),
  startMinute: z.string().optional(),
  endHour: z.string().optional(),
  endMinute: z.string().optional(),
  reason: z.string().min(1, '請輸入請假原因')
}).refine((data) => {
  // 驗證全天模式下結束日期為必填
  if (data.timeType === TIME_TYPE.FULL_DAY) {
    return !!(data.endDate && data.endDate.length > 0);
  }
  return true;
}, {
  message: '請選擇結束日期',
  path: ['endDate']
}).refine((data) => {
  // 驗證結束日期不能早於開始日期（僅在全天模式下檢查）
  if (data.timeType === TIME_TYPE.FULL_DAY && data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: '結束日期不能早於開始日期',
  path: ['endDate']
}).refine((data) => {
  // 驗證指定時間模式下必須選擇開始時間
  if (data.timeType === TIME_TYPE.SPECIFIC_TIME) {
    return !!(data.startHour && data.startMinute);
  }
  return true;
}, {
  message: '請選擇開始時間',
  path: ['startHour']
}).refine((data) => {
  // 驗證指定時間模式下必須選擇結束時間
  if (data.timeType === TIME_TYPE.SPECIFIC_TIME) {
    return !!(data.endHour && data.endMinute);
  }
  return true;
}, {
  message: '請選擇結束時間',
  path: ['endHour']
}).refine((data) => {
  // 驗證結束時間至少比開始時間晚30分鐘
  if (data.timeType === TIME_TYPE.SPECIFIC_TIME && data.startHour && data.startMinute && data.endHour && data.endMinute) {
    const startMinutes = parseInt(data.startHour) * 60 + parseInt(data.startMinute);
    const endMinutes = parseInt(data.endHour) * 60 + parseInt(data.endMinute);
    return endMinutes >= startMinutes + 30;
  }
  return true;
}, {
  message: '結束時間必須至少比開始時間晚30分鐘',
  path: ['endHour']
});

type LeaveApplicationForm = z.infer<typeof leaveApplicationSchema>;

export default function LeaveApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const methods = useForm<LeaveApplicationForm>({
    resolver: zodResolver(leaveApplicationSchema),
    defaultValues: {
      name: '',
      leaveType: '',
      timeType: TIME_TYPE.FULL_DAY,
      startDate: '',
      endDate: '',
      startHour: '',
      startMinute: '',
      endHour: '',
      endMinute: '',
      reason: ''
    }
  });
  
  const { handleSubmit, control, watch, setValue, reset, formState: { errors } } = methods;
  const timeType = watch('timeType');
  const startDate = watch('startDate');
  const startHour = watch('startHour');
  const startMinute = watch('startMinute');


  const onSubmit = async (data: LeaveApplicationForm) => {
    console.log('valid form', data);
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      // 準備要送出的資料
      const applicationData = {
        name: data.name.trim(),
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason.trim(),
        timeType: data.timeType,
        startTime: data.timeType === TIME_TYPE.SPECIFIC_TIME ? 
          `${data.startHour}:${data.startMinute}` : null,
        endTime: data.timeType === TIME_TYPE.SPECIFIC_TIME ? 
          `${data.endHour}:${data.endMinute}` : null,
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
        reset();
        
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
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="xl" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          請假申請
        </Typography>
        
        <Paper elevation={3} style={{ padding: '32px' }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* 姓名、假別、全天/指定時間選擇 */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '24px',
              flexDirection: 'row',
              alignItems: 'flex-start'
            }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    style={{ flex: 1, marginRight: '16px' }}
                    label="姓名"
                    required
                    variant="outlined"
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message || ''}
                  />
                )}
              />

              <Controller
                name="leaveType"
                control={control}
                render={({ field }) => (
                  <FormControl style={{ flex: 1, marginRight: '16px' }} required error={!!errors.leaveType} size="small">
                    <InputLabel>請假假別</InputLabel>
                    <Select
                      {...field}
                      label="請假假別"
                    >
                      <MenuItem value="" disabled>請選擇假別</MenuItem>
                      <MenuItem value="annual">特休</MenuItem>
                      <MenuItem value="personal">事假</MenuItem>
                      <MenuItem value="sick">病假</MenuItem>
                    </Select>
                    {errors.leaveType && (
                      <Typography variant="caption" color="error" style={{ marginTop: '3px', marginLeft: '14px' }}>
                        {errors.leaveType.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <div style={{ flex: 1 }}>
                <Controller
                  name="timeType"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" className="flex">
                      <RadioGroup
                        {...field}
                        row
                        style={{ alignItems: 'flex-start' }}
                        onChange={(e) => {
                          field.onChange(e.target.value as TIME_TYPE);
                          // 當切換到指定時間模式時，同步結束日期
                          if (e.target.value === TIME_TYPE.SPECIFIC_TIME && startDate) {
                            setValue('endDate', startDate);
                          }
                        }}
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
                  )}
                />
              </div>
            </div>

            {/* 請假日期區間 */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '24px',
              flexDirection: 'row',
              alignItems: 'flex-start'
            }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    style={{ flex: 1, marginRight: '16px' }}
                    label="開始日期"
                    type="date"
                    required
                    size="small"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      // 當是指定時間模式時，同步更新結束日期
                      if (timeType === TIME_TYPE.SPECIFIC_TIME) {
                        setValue('endDate', e.target.value);
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message || '請選擇開始日期'}
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
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    style={{ flex: 1, marginRight: '16px' }}
                    label="結束日期"
                    type="date"
                    required
                    size="small"
                    onChange={(e) => {
                      if (timeType === TIME_TYPE.FULL_DAY) {
                        field.onChange(e.target.value);
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
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message || (timeType === TIME_TYPE.SPECIFIC_TIME ? '指定時間模式下結束日期自動同步開始日期' : (startDate ? '結束日期不能早於開始日期' : ''))}
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
                )}
              />
              <div style={{ flex: 1, display: 'flex', gap: '8px', minHeight: '56px', position: 'relative' }}>
                {timeType === TIME_TYPE.SPECIFIC_TIME ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Controller
                          name="startHour"
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" error={!!errors.startHour}>
                              <Select
                                {...field}
                                displayEmpty
                                style={{ minWidth: '70px' }}
                                data-testid="start-hour"
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
                          )}
                        />
                        <Typography variant="body2">:</Typography>
                        <Controller
                          name="startMinute"
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" error={!!errors.startHour}>
                              <Select
                                {...field}
                                displayEmpty
                                style={{ minWidth: '70px' }}
                                data-testid="start-minute"
                              >
                                <MenuItem value="" disabled>分</MenuItem>
                                <MenuItem value="00">00</MenuItem>
                                <MenuItem value="30">30</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </div>
                      {errors.startHour && (
                        <Typography variant="caption" color="error" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {errors.startHour.message}
                        </Typography>
                      )}
                    </div>
                    
                    <Typography variant="body2" color="textSecondary">至</Typography>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Controller
                          name="endHour"
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" error={!!errors.endHour}>
                              <Select
                                {...field}
                                displayEmpty
                                style={{ minWidth: '70px' }}
                                data-testid="end-hour"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  // 當結束小時改變時，檢查是否需要調整結束分鐘以滿足最小半小時間隔
                                  if (startHour && startMinute && e.target.value === startHour) {
                                    // 如果是同一小時，且開始分鐘是30，則結束時間必須是下一小時
                                    if (startMinute === '30') {
                                      setValue('endMinute', '');
                                      setValue('endHour', '');
                                    } else if (startMinute === '00') {
                                      // 如果開始是00分，結束必須是30分或更晚
                                      setValue('endMinute', '30');
                                    }
                                  }
                                }}
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
                          )}
                        />
                        <Typography variant="body2">:</Typography>
                        <Controller
                          name="endMinute"
                          control={control}
                          render={({ field }) => {
                            const endHour = watch('endHour');
                            return (
                              <FormControl size="small" error={!!errors.endHour}>
                                <Select
                                  {...field}
                                  displayEmpty
                                  style={{ minWidth: '70px' }}
                                  data-testid="end-minute"
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
                            );
                          }}
                        />
                      </div>
                      {errors.endHour && (
                        <Typography variant="caption" color="error" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {errors.endHour.message}
                        </Typography>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {/* 請假原因 */}
            <div style={{ marginBottom: '24px' }}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="請假原因"
                    multiline
                    rows={4}
                    required
                    placeholder="請輸入請假原因..."
                    variant="outlined"
                    error={!!errors.reason}
                    helperText={errors.reason?.message || ''}
                  />
                )}
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
          </FormProvider>
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