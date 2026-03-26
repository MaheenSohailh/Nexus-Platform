import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX } from "react-icons/hi";
import {
  Home, Building2, CircleDollarSign, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle, Calendar, Video
} from 'lucide-react';
import Joyride, { Step } from 'react-joyride';
import { Button } from '../ui/Button';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${className || ''}`
    }
  >
    <span className="mr-3">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

export const Sidebar: React.FC<{ children: React.ReactNode }> = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);



  useEffect(() => {
    setSidebarOpen(true);
    const timer = setTimeout(() => {
      setRunTour(true);
    }, 300);

    const closeTimer = setTimeout(() => {
      setSidebarOpen(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, []);


  if (!user) return null;

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents', className: 'document-chamber' },
    { to: '/calendar', icon: <Calendar size={20} />, text: 'Schedule Meeting', className: 'calendar' },
    { to: '/videocall', icon: <Video size={20} />, text: 'Video Call', className: 'video-call' },
    { to: '/dashboard/payments', icon: <CircleDollarSign size={20} />, text: 'Payments', className: 'payment' },
  ];

  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
    { to: '/videocall', icon: <Video size={20} />, text: 'Video Call', className: 'video-call' },
    { to: '/dashboard/payments', icon: <CircleDollarSign size={20} />, text: 'Payments', className: 'payment' },
  ];

  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;

  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];

  const steps: Step[] = [
    { target: '.document-chamber', content: 'Upload aur sign documents yahan hotay hain.' },
    { target: '.calendar', content: 'Yahan apni meetings schedule kar sakte ho!' },
    { target: '.video-call', content: 'Yahan se video call start/end kar sakte ho.' },
    { target: '.payment', content: 'Wallet balance aur transactions yahan dekho.' },
  ];

  return (
    <>
      {/* Joyride */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        scrollToFirstStep
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#2563EB',
            textColor: '#111827',
          },
        }}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Mobile toggle button */}
      <div className="md:hidden absolute top-3 right-16 z-50">
        <Button className=" focus:outline-none focus:ring-0 shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-40 w-64 h-full bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col`}>
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, idx) => (
              <SidebarItem key={idx} {...item} />
            ))}
          </div>

          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
            <div className="mt-2 space-y-1">
              {commonItems.map((item, idx) => (
                <SidebarItem key={idx} {...item} />
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs text-gray-600">Need assistance?</p>
              <h4 className="text-sm font-medium text-gray-900 mt-1">Contact Support</h4>
              <a
                href="mailto:support@businessnexus.com"
                className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
              >
                support@businessnexus.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};      