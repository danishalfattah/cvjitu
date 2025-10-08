import { LayoutDashboard, BarChart3, LogOut, User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  provider?: 'email' | 'google';
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  user?: User | null;
  isMobile?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ activeTab, onTabChange, onLogout, user, isMobile = false, onClose }: DashboardSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'scoring',
      label: 'Scoring CV Anda',
      icon: BarChart3
    }
  ];

  const sidebarClasses = isMobile 
    ? "w-80 max-w-[85vw] bg-white border-r border-[var(--border-color)] h-screen flex flex-col shadow-2xl"
    : "fixed left-0 top-0 w-64 bg-white border-r border-[var(--border-color)] h-screen flex flex-col z-40";

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--red-normal)] rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">CV</span>
            </div>
            <span className="font-poppins font-semibold text-lg sm:text-xl text-[var(--neutral-ink)]">CVJitu</span>
          </div>
          
          {/* Close button for mobile */}
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-[var(--red-light)] text-[var(--red-normal)] font-medium transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--neutral-ink)] hover:transform hover:scale-[1.01]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile-only quick actions */}
        {isMobile && (
          <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-4">
              Aksi Cepat
            </p>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-[var(--red-light)] hover:text-[var(--red-normal)] transition-colors">
                <User className="w-5 h-5" />
                <span>Profil Saya</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Logout */}
      {user && (
        <div className="p-4 border-t border-[var(--border-color)] bg-gray-50/50">
          <div className="space-y-3">
            {/* User Profile Card */}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[var(--border-color)] shadow-sm">
              <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} ring-2 ring-[var(--red-normal)]/10`}>
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="bg-[var(--red-normal)] text-white text-xs font-semibold">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold text-[var(--neutral-ink)] truncate`}>
                  {user.fullName}
                </p>
                <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 truncate`}>
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      )}

      {/* Copyright Section */}
      <div className="p-4 border-t border-[var(--border-color)] bg-gray-50/30">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">
            © {new Date().getFullYear()} CVJitu
          </p>
          <p className="text-xs text-gray-400">
            All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
