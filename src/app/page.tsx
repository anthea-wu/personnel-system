import Navbar from "@/components/Navbar";
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="xl" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            歡迎使用請假系統
          </Typography>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            這是一個簡單易用的請假管理系統，讓您輕鬆管理請假申請。
          </Typography>
          <div style={{ marginTop: '32px' }}>
            <Button
              component={Link}
              href="/leave-application"
              variant="contained"
              color="primary"
              size="large"
            >
              開始申請請假
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
