
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import UserTable from '@/components/admin/UserTable';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function UserManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <SEO 
        title="User Management"
        description="Manage and monitor user registrations and profiles"
        url="https://voicemate.id/admin/users"
        noIndex={true}
      />
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">
              Monitor user registrations, profile creation status, and identify any issues with the registration process.
            </p>
          </div>
          <UserTable />
        </div>
        <Footer />
      </div>
    </>
  );
}
