'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationControls({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage 
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageURL(page));
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxPagesToShow - 1);
      
      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '32px',
      padding: '16px 0',
      borderTop: '1px solid var(--border)'
    }}>
      {/* Items info */}
      <div style={{
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        Showing {startItem}-{endItem} of {totalItems} projects
      </div>

      {/* Pagination controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Previous button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
              e.currentTarget.style.color = 'var(--accent-blue)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          Previous
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: pageNum === currentPage ? 'var(--accent-blue)' : 'var(--bg-secondary)',
              color: pageNum === currentPage ? 'white' : 'var(--text-secondary)',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '40px'
            }}
            onMouseEnter={(e) => {
              if (pageNum !== currentPage) {
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
                e.currentTarget.style.color = 'var(--accent-blue)';
              }
            }}
            onMouseLeave={(e) => {
              if (pageNum !== currentPage) {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {pageNum}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
              e.currentTarget.style.color = 'var(--accent-blue)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}