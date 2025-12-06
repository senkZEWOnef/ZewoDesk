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
      padding: 'var(--space-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), 
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 40%),
          linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%)
        `,
        zIndex: 1
      }} />
      
      {/* Floating Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.3,
        zIndex: 1
      }} />
      
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-elevated), rgba(26, 26, 26, 0.95))',
        padding: '3rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
        boxShadow: `
          var(--shadow-xl),
          0 0 60px rgba(59, 130, 246, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        position: 'relative',
        zIndex: 2,
        backdropFilter: 'blur(40px)',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-green))',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          fontSize: '48px',
          margin: '0 auto 2rem auto',
          boxShadow: `
            0 20px 40px rgba(59, 130, 246, 0.4),
            0 8px 16px rgba(139, 92, 246, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `,
          position: 'relative',
          animation: 'logoFloat 3s ease-in-out infinite'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ffffff, #e6f3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.02em'
          }}>Z</span>
          
          {/* Animated glow effect */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            borderRadius: '28px',
            zIndex: -1,
            opacity: 0.6,
            filter: 'blur(8px)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #ffffff, var(--accent-blue-light), var(--accent-purple-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          animation: 'slideInDown 0.6s ease-out 0.2s both'
        }}>
          Welcome back
        </h1>
        
        <div style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          background: 'linear-gradient(90deg, var(--accent-green-light), var(--accent-blue-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.01em',
          animation: 'slideInDown 0.6s ease-out 0.4s both'
        }}>
          Zewo
        </div>
        
        <p style={{
          color: 'var(--text-tertiary)',
          marginBottom: '2.5rem',
          fontSize: '1rem',
          lineHeight: '1.6',
          fontWeight: '400',
          animation: 'slideInDown 0.6s ease-out 0.6s both'
        }}>
          Enter your access code to continue
        </p>

        <form onSubmit={handleSubmit} style={{ 
          position: 'relative',
          animation: 'slideInDown 0.6s ease-out 0.8s both'
        }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1.125rem',
                textAlign: 'center',
                letterSpacing: '0.3em',
                border: '2px solid var(--border)',
                borderRadius: '16px',
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(10px)',
                color: 'var(--text-primary)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'ui-monospace, monospace',
                fontWeight: '600',
                outline: 'none',
                ...(passcode && {
                  borderColor: 'var(--accent-blue)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                })
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-blue)';
                e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3), 0 0 0 3px rgba(59, 130, 246, 0.1)';
                e.target.style.background = 'rgba(20, 20, 20, 0.8)';
              }}
              onBlur={(e) => {
                if (!passcode) {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(20, 20, 20, 0.6)';
                }
              }}
              disabled={isLoading}
              autoFocus
            />
            {isLoading && (
              <div style={{
                position: 'absolute',
                right: 'var(--space-lg)',
                top: '50%',
                transform: 'translateY(-50%)',
                animation: 'spin 1s linear infinite'
              }}>
                ⟳
              </div>
            )}
          </div>
          
          {error && (
            <div style={{
              color: 'var(--accent-red-light)',
              marginBottom: 'var(--space-lg)',
              fontSize: '0.875rem',
              padding: 'var(--space-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !passcode}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '16px',
              background: passcode 
                ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' 
                : 'var(--bg-tertiary)',
              color: passcode ? 'white' : 'var(--text-muted)',
              cursor: isLoading || !passcode ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: passcode && !isLoading ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: passcode 
                ? '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(139, 92, 246, 0.3)' 
                : 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onMouseEnter={(e) => {
              if (passcode && !isLoading) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.5), 0 6px 15px rgba(139, 92, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (passcode && !isLoading) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(139, 92, 246, 0.3)';
              }
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              position: 'relative',
              zIndex: 2
            }}>
              {isLoading ? (
                <>
                  <span style={{ 
                    animation: 'spin 1s linear infinite',
                    fontSize: '1.25rem'
                  }}>⟳</span>
                  Verifying...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.25rem', transition: 'transform 0.3s ease' }}>→</span>
                  Enter ZewoDesk
                </>
              )}
            </span>
            
            {/* Button gradient overlay */}
            {passcode && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }} />
            )}
          </button>
          
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            animation: 'slideInDown 0.6s ease-out 1s both'
          }}>
            <p style={{
              color: 'var(--text-tertiary)',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              Just browsing? View the public portfolio
            </p>
            <button
              type="button"
              onClick={() => router.push('/projects?visitor=true')}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                background: 'transparent',
                border: '1.5px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                target.style.background = 'rgba(255, 255, 255, 0.05)';
                target.style.color = 'var(--text-primary)';
                target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                target.style.background = 'transparent';
                target.style.color = 'var(--text-secondary)';
                target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>👀</span>
              View Public Projects
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}