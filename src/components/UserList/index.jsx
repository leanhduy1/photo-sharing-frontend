import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import React from "react";

function UserList () {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let cancelled = false;

      const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const data = await userApi.getList();
          if (!cancelled) setUsers(data);
        } catch (error) {
          if (!cancelled) setError(error.message);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      
      fetchUsers();
      return () => { cancelled = true; };
    }, []);

    if (loading) {
      return <Typography variant="body1" sx={{ p: 2 }}>Loading users...</Typography>;
    }

    if (error) {
      return <Typography variant="body1" color="error" sx={{ p: 2 }}>Error: {error}</Typography>;
    }

    return (
      <div>
        <Typography variant="h6" sx={{ p: 1 }}>Users</Typography>
        <Divider />
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem component={Link} to={`/users/${user._id}`} >
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;