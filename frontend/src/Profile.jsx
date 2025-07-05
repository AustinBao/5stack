import { useEffect, useState } from 'react'

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/profile', {
      credentials: 'include' // send cookies!
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data));
  }, []);

  if (!user) return <a href="http://localhost:3000/auth/steam">Login with Steam</a>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <img src={user.photos[2]?.value} alt="avatar" />
      <a href="http://localhost:3000/logout">Logout</a>
    </div>
  );
}

export default Profile;
