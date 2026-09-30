import { motion } from 'framer-motion';
import {
  Search,
  Loader2,
  X,
  Sparkles,
  BookOpen,
  Download,
  Info,
  Calendar,
  Tag,
  User,
  Library,
  Compass,
  Heart,
  Users,
  ArrowRight,
  ArrowLeft,
  Award,
  Coffee,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  Trash2,
  Edit,
  Plus,
  Filter,
  Menu,
  LogOut,
  Settings,
  Lock,
  Mail
} from 'lucide-react';

export const ICON_MAP = {
  search: Search,
  loader: Loader2,
  close: X,
  x: X,
  sparkles: Sparkles,
  bookOpen: BookOpen,
  download: Download,
  info: Info,
  calendar: Calendar,
  tag: Tag,
  user: User,
  library: Library,
  compass: Compass,
  heart: Heart,
  users: Users,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  award: Award,
  coffee: Coffee,
  check: Check,
  alert: AlertCircle,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  eye: Eye,
  trash: Trash2,
  edit: Edit,
  plus: Plus,
  filter: Filter,
  menu: Menu,
  lock: Lock,
  mail: Mail,
  logout: LogOut,
  settings: Settings,
};

const SIZE_PRESETS = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
  '2xl': 42,
};

const COLOR_VARIANTS = {
  current: 'text-current',
  primary: 'text-[#A06A42]',
  dark: 'text-[#121A13]',
  forest: 'text-[#1E2A20]',
  muted: 'text-[#2B3B2E]/70',
  light: 'text-[#FFFDFB]',
  danger: 'text-red-600',
  success: 'text-emerald-600',
};

const Icon = ({
  name,
  icon: CustomIcon,
  size = 'md',
  variant = 'current',
  strokeWidth = 2.5,
  spin = false,
  pulse = false,
  animateHover = false,
  className = '',
  ...props
}) => {
  const normalizedName = name
    ? name.charAt(0).toLowerCase() + name.slice(1)
    : '';

  const LucideIcon = CustomIcon || ICON_MAP[name] || ICON_MAP[normalizedName];

  if (!LucideIcon) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Icon] "${name}" adında bir ikon ICON_MAP içinde bulunamadı.`);
    }
    return null;
  }

  const resolvedSize = typeof size === 'number' ? size : (SIZE_PRESETS[size] || 18);
  const colorClass = COLOR_VARIANTS[variant] || COLOR_VARIANTS.current;

  const combinedClassName = [
    'shrink-0 select-none',
    colorClass,
    spin ? 'animate-spin' : '',
    pulse ? 'animate-pulse' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (animateHover) {
    return (
      <motion.span
        whileHover={{ scale: 1.15, rotate: -8 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="inline-flex items-center justify-center"
      >
        <LucideIcon
          size={resolvedSize}
          strokeWidth={strokeWidth}
          className={combinedClassName}
          {...props}
        />
      </motion.span>
    );
  }

  return (
    <LucideIcon
      size={resolvedSize}
      strokeWidth={strokeWidth}
      className={combinedClassName}
      {...props}
    />
  );
};

export default Icon;
