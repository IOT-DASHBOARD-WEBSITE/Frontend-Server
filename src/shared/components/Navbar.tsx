'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, Zap, Bell, ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import '@/styles/navbar.scss';

export default function Navbar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and set initial collapsed state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile); // Always collapsed on mobile by default
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close navbar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && !collapsed && e.target instanceof HTMLElement) {
        const navbar = document.querySelector('.navbar');
        if (navbar && !navbar.contains(e.target)) {
          setCollapsed(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, collapsed]);

  const isActive = (href: string) => {
    return pathname === href ? 'active' : '';
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/devices', label: 'Devices', icon: Settings },
  ];

  const handleNavClick = () => {
    // Close menu on mobile when clicking a nav item
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          className="mobile-hamburger"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Open Menu' : 'Close Menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {/* Overlay for mobile when expanded */}
      {isMobile && !collapsed && (
        <div 
          className="navbar-overlay visible"
          onClick={() => setCollapsed(true)}
        />
      )}

      <nav className={`navbar ${collapsed ? 'collapsed' : ''}`}>
        {/* Logo Section */}
        <div className="navbar-header">
          <Link href="/" className="navbar-logo" onClick={handleNavClick}>
            <span className="logo-icon">⚡</span>
            {!collapsed && <span className="logo-text">HCMUT IoT</span>}
          </Link>
          {!isMobile && (
            <button 
              className="collapse-btn" 
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Open Menu' : 'Close Menu'}
            >
              {collapsed ? <ChevronDown size={20} /> : <X size={20} />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="navbar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href)}`}
                title={collapsed ? item.label : ''}
                onClick={handleNavClick}
              >
                <Icon size={20} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="navbar-footer">
          <div className="nav-item notifications">
            <Bell size={20} className="nav-icon" />
            {!collapsed && <span className="nav-label">Alerts</span>}
          </div>
        </div>
      </nav>
    </>
  );
}
