import axios from 'axios';
import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  // Use different backend for dev vs prod
  const backendUrl = import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://api.5stack.online';

  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get(`${backendUrl}/api/profile`, { withCredentials: true });
        console.log('User data:', res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to get user:', err);
        setUser(null);
      }
    }
    getUser();
  }, [backendUrl]);

  if (!user) return <a href={`${backendUrl}/auth/steam`}>Login with Steam</a>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <img src={user.photos?.[2]?.value} alt="avatar" />
      <a href={`${backendUrl}/logout`}>Logout</a>
    </div>
  );
}

export default Profile;
