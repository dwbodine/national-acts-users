import { User } from '@/types/user';
import { redirect } from 'next/navigation';

export default function HomePage() {

  let user: User | undefined = undefined;
  try {
    const currentUserStr = localStorage.getItem('currentUser') || undefined;
    if (currentUserStr) {
      user = JSON.parse(currentUserStr) as User;
    }
  } catch {
    user = undefined;
  }

  if (user && user.isAuthenticated) {
    if (user.isAdmin) {
      redirect('/dashboard/');
    } else {
      redirect('sellers');
    }
  }
  else {
    redirect('login')
  }

  return (
    <></>
  );
}
