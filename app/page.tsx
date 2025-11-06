'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (passcode === 'Poesie509$$$') {
      // Store auth token in both localStorage and cookies
      localStorage.setItem('zewo_auth', 'authenticated');
      document.cookie = 'zewo_auth=authenticated; path=/; max-age=86400'; // 24 hours
      router.push('/dashboard');
    } else {
      setError('Invalid passcode');
      setPasscode('');
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '48px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '32px',
          margin: '0 auto 24px auto'
        }}>
          Z
        </div>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome back Zewo
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Please enter the code
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            style={{
              width: '100%',
              marginBottom: '16px',
              padding: '16px',
              fontSize: '16px',
              textAlign: 'center',
              letterSpacing: '2px'
            }}
            disabled={isLoading}
            autoFocus
          />
          
          {error && (
            <div style={{
              color: 'var(--accent-red)',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !passcode}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              opacity: isLoading || !passcode ? 0.5 : 1,
              cursor: isLoading || !passcode ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </button>
          
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)'
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              Just want to browse projects?
            </p>
            <button
              type="button"
              onClick={() => router.push('/projects?visitor=true')}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '500',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              View Projects as Visitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}