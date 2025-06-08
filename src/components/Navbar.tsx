'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
}));

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar>
          <StyledLink href="/">
            <Typography variant="h6" component="div">
              請假系統
            </Typography>
          </StyledLink>
          <div style={{ flexGrow: 1 }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <StyledLink href="/leave-application">
              <Button variant="contained" color="secondary">
                請假申請
              </Button>
            </StyledLink>
            <StyledLink href="/leave-applications">
              <Button variant="outlined" color="inherit">
                申請記錄
              </Button>
            </StyledLink>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 