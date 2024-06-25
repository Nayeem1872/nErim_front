import React from 'react'

const Maintenance = () => {
  return (
    <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100vh",
                textAlign: "center",
              }}
            >
              <img src="/image/maintenance.svg" alt="Under Maintenance" />
              <h1>Under Maintenance</h1>
              <p>
                We are currently undergoing maintenance. Please check back
                later.
              </p>
            </div>
  )
}

export default Maintenance