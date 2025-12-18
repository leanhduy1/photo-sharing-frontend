import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation, matchPath } from "react-router-dom";
import "./styles.css";
import userApi from "../../api/userApi";
import { useState, useEffect } from "react";

export default function TopBar() {
  const location = useLocation();
  const [contextTitle, setContextTitle] = useState('Photo Sharing');

  useEffect(() => {
    const buildTitle = async () => {
      const { pathname } = location;

      const photosMatch = matchPath('/photos/:userId', pathname);
      if (photosMatch) {
        try {
          const user = await userApi.getById(photosMatch.params.userId);
          setContextTitle(`Photos of ${user.first_name} ${user.last_name}`);
        } catch {
          setContextTitle('Photos');
        }
        return;
      }

      const userMatch = matchPath('/users/:userId', pathname);
      if (userMatch) {
        try {
          const user = await userApi.getById(userMatch.params.userId);
          setContextTitle(`${user.first_name} ${user.last_name}`);
          } catch {
            setContextTitle('User Detail');
          }
        return;
      }

      if (pathname === '/users') {
        setContextTitle('User List');
        return;
      }

      setContextTitle('Photo Sharing');
      };

      buildTitle();
    }, [location]);

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Lê Anh Duy</Typography>
        <Typography variant="h6">{contextTitle}</Typography>
      </Toolbar>
    </AppBar>
  );
}