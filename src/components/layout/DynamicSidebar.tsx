/**
 * Dynamic Role-Based Sidebar Navigation Component
 * Shows/hides menu items based on user role and permissions
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@store/authStore';
import { getMenuForRole, filterMenuByPermissions, MenuItem } from '@config/navigation';
import { cn } from '@utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function DynamicSidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get menu items for user's primary role
  const userRole = user?.roles?.[0] || 'STAFF';
  let menuItems = getMenuForRole(userRole);

  // Filter by permissions
  const userPermissions = user?.permissions || [];
  menuItems = filterMenuByPermissions(menuItems, userPermissions);

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: MenuItem) =>
    item.children?.some((child) => location.pathname.startsWith(child.path)) || false;

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isCurrentActive = isActive(item.path) || (hasChildren && isParentActive(item));
    const isExpanded = expandedItems.has(item.path);
    const Icon = item.icon;

    return (
      <div key={item.path} className="w-full">
        {hasChildren ? (
          <motion.button
            onClick={() => toggleExpand(item.path)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isCurrentActive
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'group'
            )}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.badge && (
                <span
                  className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', item.badge.color)}
                >
                  {item.badge.label}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </motion.button>
        ) : (
          <Link
            to={item.path}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isCurrentActive
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'group'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
            {item.badge && (
              <span
                className={cn('text-xs font-semibold px-2 py-0.5 rounded-full ml-auto', item.badge.color)}
              >
                {item.badge.label}
              </span>
            )}
          </Link>
        )}

        {/* Expanded submenu */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-2 mt-1 space-y-1 border-l border-border pl-4"
            >
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className={cn(
        'fixed md:relative top-16 md:top-0 left-0 z-40 h-[calc(100vh-64px)] md:h-screen w-80 bg-card border-r border-border overflow-y-auto',
        'flex flex-col'
      )}
    >
      {/* Menu items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.length > 0 ? (
          menuItems.map((item) => renderMenuItem(item))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No menu items available</p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-border p-4 space-y-3"
      >
        {/* User info */}
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
        </div>

        {/* Logout button */}
        <motion.button
          onClick={() => {
            logout();
            onClose?.();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}

export default DynamicSidebar;
