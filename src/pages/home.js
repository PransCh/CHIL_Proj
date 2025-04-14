import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('User Name');
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <div>
    </div>
  );
}
