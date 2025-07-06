import axios from 'axios';
import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get('/api/profile', {
          withCredentials: true, // send cookies for session
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    }
    getUser();
  }, []);

  if (!user) return <a href="/auth/steam">Login with Steam</a>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <img src={user.photos?.[2]?.value} alt="avatar" />
      <a href="/auth/logout">Logout</a>
    </div>
  );
}

export default Profile;
