import React from 'react'
import { Button, Tooltip } from 'antd';

const CustomButtons = ({ type, onClick, icon, text, tooltipTitle, danger }) => {
    const handleMouseEnter = (e, color) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0px 8px 16px ${color}`;
      };
    
      const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
      };
  return (
    <Tooltip title={tooltipTitle}>
      <Button
        type={type}
        danger={danger}
        onClick={onClick}
        style={{
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
        onMouseEnter={(e) => handleMouseEnter(e, danger ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 0, 255, 0.3)')}
        onMouseLeave={handleMouseLeave}
      >
        {icon}
      </Button>
    </Tooltip>
  )
}

export default CustomButtons