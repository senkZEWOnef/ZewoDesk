'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const navigationButtons = [
  {
    title: 'GitHub',
    description: 'Access your repositories',
    icon: '⚡',
    url: 'https://github.com',
    color: 'var(--accent-blue)'
  },
  {
    title: 'Neon Database',
    description: 'Manage your databases',
    icon: '🗄️',
    url: 'https://neon.tech',
    color: 'var(--accent-green)'
  },
  {
    title: 'Supabase',
    description: 'Backend as a service',
    icon: '⚡',
    url: 'https://supabase.com/dashboard',
    color: 'var(--accent-green)'
  },
  {
    title: 'Netlify',
    description: 'Deploy and manage sites',
    icon: '🚀',
    url: 'https://app.netlify.com/teams/senkzewonef/projects',
    color: 'var(--accent-green)'
  },
  {
    title: 'Website',
    description: 'Visit your main site',
    icon: '🌐',
    url: 'https://byzewo.com',
    color: 'var(--accent-purple)'
  },
  {
    title: 'Projects',
    description: 'Manage your portfolio',
    icon: '📁',
    url: '/projects',
    color: 'var(--accent-blue)',
    internal: true
  },
  {
    title: 'Meta',
    description: 'View meta information',
    icon: '📊',
    url: '/meta',
    color: 'var(--accent-purple)',
    internal: true
  },
  {
    title: 'Vault',
    description: 'Secure file storage',
    icon: '🗃️',
    url: '/vault',
    color: 'var(--accent-red)',
    internal: true,
    secure: true
  }
];

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('zewo_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleNavigation = (button: typeof navigationButtons[0]) => {
    if (button.secure) {
      // Handle secure vault access
      const password = prompt('Enter passcode to access secure vault:');
      if (password === 'Poesie509$$') {
        router.push(button.url);
      } else if (password !== null) {
        alert('Invalid passcode');
      }
    } else if (button.internal) {
      router.push(button.url);
    } else {
      window.open(button.url, '_blank');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zewo_auth');
    document.cookie = 'zewo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '40px',
            margin: '0 auto 24px auto'
          }}>
            Z
          </div>
          
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Zewo's Desk
          </h1>
          
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '18px'
          }}>
            Your central hub for all things development
          </p>
        </div>

        {/* Navigation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
          maxWidth: '1200px',
          margin: '0 auto 48px auto'
        }}>
          {navigationButtons.map((button, index) => (
            <div
              key={button.title}
              onClick={() => handleNavigation(button)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: button.color
              }} />
              
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                {button.icon}
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '8px',
                color: 'var(--text-primary)'
              }}>
                {button.title}
              </h3>
              
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px'
              }}>
                {button.description}
              </p>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-red)';
              e.currentTarget.style.color = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}