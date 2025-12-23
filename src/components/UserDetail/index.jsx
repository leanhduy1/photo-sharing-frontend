import { Typography, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import userApi from "../../api/userApi";

function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
      let cancelled = false;

      const fetchUser = async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await userApi.getById(userId);
          if (!cancelled) setUser(data);
        } catch (err) {
          if (!cancelled) setError(err.message);
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      fetchUser();
      return () => { cancelled = true; };
    }, [userId]);

    if (loading) {
        return <Typography sx={{ p: 2 }}>Loading user details...</Typography>;
    }
    
    if (error) {
        return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
    }

    return (
        <div>
          <Typography variant="h4" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          {user.location && (
            <Typography variant="body1">Location: {user.location}</Typography>
          )}
          {user.occupation && (
            <Typography variant="body1">Occupation: {user.occupation}</Typography>
          )}
          {user.description && (
            <Typography variant="body1" paragraph>Description: {user.description}</Typography>
          )}
          <Button variant="contained" component={Link} to={`/photos/${user._id}`}>
            View Photos
          </Button>
        </div>
    );
}

export default UserDetail;