import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { toPng } from 'html-to-image';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ReceiptPage({ enrollmentData }) {
  const receiptRef = useRef(null);

  const downloadReceipt = async () => {
    if (receiptRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 800,
        height: 1000
      });
      
      const link = document.createElement('a');
      link.download = `ALS-Enrollment-Receipt-${enrollmentData.learner_ref_no || 'No-LRN'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating receipt:', err);
      alert('Error generating receipt. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)', 
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Success Message */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
      }}>
        <CheckCircleIcon sx={{ fontSize: 40 }} />
        <div>
          <Typography variant="h5" component="h1" style={{ fontWeight: 700, margin: 0 }}>
            Enrollment Successful!
          </Typography>
          <Typography variant="body1" style={{ margin: 0, opacity: 0.9 }}>
            Your enrollment has been submitted successfully.
          </Typography>
        </div>
      </div>

      {/* Receipt */}
      <div ref={receiptRef} style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '600px',
        width: '100%',
        marginBottom: '2rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/images/als-logo.png" 
            alt="ALS Logo" 
            style={{ height: '80px', marginBottom: '1rem' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography variant="h4" component="h2" style={{ 
            fontWeight: 700, 
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            ALS ENROLLMENT RECEIPT
          </Typography>
          <Typography variant="h6" style={{ 
            color: '#3b82f6',
            fontWeight: 600
          }}>
            ALS Center Opol West
          </Typography>
        </div>

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Enrollment Details */}
        <div style={{ marginBottom: '2rem' }}>
          <Typography variant="h6" style={{ 
            fontWeight: 700, 
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Enrollment Information
          </Typography>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Reference No:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {enrollmentData.learner_ref_no || 'To be assigned'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Enrollment Date:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {formatDate(enrollmentData.date_enrolled)}
              </Typography>
            </div>
          </div>
        </div>

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Personal Information */}
        <div style={{ marginBottom: '2rem' }}>
          <Typography variant="h6" style={{ 
            fontWeight: 700, 
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Personal Information
          </Typography>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Full Name:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {`${enrollmentData.firstname} ${enrollmentData.middlename ? enrollmentData.middlename + ' ' : ''}${enrollmentData.lastname}${enrollmentData.extension_name ? ' ' + enrollmentData.extension_name : ''}`}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Birth Date:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {formatDate(enrollmentData.birthdate)}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Gender:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {enrollmentData.gender}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Mobile No:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {enrollmentData.mobile_no}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Email:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {enrollmentData.email_address || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" style={{ color: '#6b7280', fontWeight: 600 }}>
                Mother Tongue:
              </Typography>
              <Typography variant="body1" style={{ color: '#1e293b', fontWeight: 700 }}>
                {enrollmentData.mother_tongue || 'Not specified'}
              </Typography>
            </div>
          </div>
        </div>

        <Divider style={{ margin: '1.5rem 0' }} />

        {/* Important Notice */}
        <div style={{ 
          background: '#fef3c7', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <Typography variant="body2" style={{ 
            color: '#92400e', 
            fontWeight: 600,
            textAlign: 'center'
          }}>
            ⚠️ IMPORTANT NOTICE
          </Typography>
          <Typography variant="body2" style={{ 
            color: '#92400e', 
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Please keep this receipt as proof of your enrollment. 
            You may be required to present this during orientation or class registration.
          </Typography>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Typography variant="body2" style={{ color: '#6b7280' }}>
            Generated on {new Date().toLocaleDateString('en-PH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
          <Typography variant="body2" style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            ALS Center Opol West - Alternative Learning System
          </Typography>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadReceipt}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)'
            }
          }}
        >
          Download Receipt
        </Button>
        
        <Button
          component={Link}
          href="/"
          variant="outlined"
          startIcon={<HomeIcon />}
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#374151',
              color: '#374151',
              background: '#f9fafb',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
