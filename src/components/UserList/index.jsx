import { Divider, List, ListItem, ListItemText, Typography, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import React from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

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
    return () => {
      cancelled = true;
    };
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key !== "Enter") return;

    setLoading(true);
    setError(null);

    try {
      let data;
      if (!searchKeyword.trim()) {
        data = await userApi.getList();
      } else {
        data = await userApi.search(searchKeyword);
      }
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        Loading users...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h6" sx={{ p: 1 }}>
        Users
      </Typography>
      <TextField
        fullWidth
        label="Search Users"
        margin="normal"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Divider />
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem component={Link} to={`/users/${user._id}`}>
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
