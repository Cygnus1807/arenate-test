import { useState } from 'react';
import CollegeLogo from '../shared/CollegeLogo';
import { BellIcon, CloseIcon, MenuIcon, UserCircleIcon } from '../shared/Icons';

const DashboardHeader = ({ userEmail, onSignOut, onOpenProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    onSignOut?.();
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    onOpenProfile?.();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <CollegeLogo />
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <span className="absolute top-1.5 left-2.5">
                <BellIcon />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </span>
            </div>
            <div className="hidden md:flex flex-col text-right">
              {userEmail && <span className="text-xs font-medium text-gray-500">{userEmail}</span>}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleProfile}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                >
                  My profile
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-green-600 hover:text-green-700"
                >
                  Sign out
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleProfile}
              className="hidden md:block rounded-full border border-transparent p-1 text-gray-600 transition hover:border-gray-200 hover:text-gray-800"
            >
              <UserCircleIcon />
            </button>
            <button onClick={() => setIsMenuOpen((open) => !open)} className="md:hidden">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-2">
            <button type="button" className="text-left text-gray-600">
              Notifications
            </button>
            <button type="button" className="text-left text-gray-600" onClick={handleProfile}>
              My profile
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-left text-red-600 font-semibold"
            >
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
