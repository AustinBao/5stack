import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://5stack.up.railway.app/profile', {
      credentials: 'include',
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setUser(data));
  }, []);

  if (!user)
    return (
      <a href="https://5stack.up.railway.app/auth/steam">
        Login with Steam
      </a>
    );

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <img src={user.photos?.[2]?.value} alt="avatar" />
      <a href="https://5stack.up.railway.app/logout">Logout</a>
    </div>
  );
}

export default Profile;
