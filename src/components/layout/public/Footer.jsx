import React from 'react'

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>Administración archivos &copy; {new Date().getFullYear()} - Todos los derechos reservados</p>
      </div>
    </footer>
  )
}
