import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Monitor,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Palette,
  ShieldCheck,
  Box,
  PlaySquare,
  BookOpen,
  Briefcase,
  ShieldAlert,
  Tv,
  Film,
  CreditCard,
  Users,
  BadgeCheck,
  Video,
  Zap,
  CheckCircle2,
  Send,
  Smartphone,
  Bot,
  Cpu,
  Grid,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Sparkles,
  Monitor,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Palette,
  ShieldCheck,
  Box,
  Youtube: PlaySquare,
  PlaySquare,
  BookOpen,
  Briefcase,
  ShieldAlert,
  Tv,
  Film,
  CreditCard,
  Users,
  BadgeCheck,
  Video,
  Zap,
  CheckCircle2,
  Send,
  Smartphone,
  Bot,
  Cpu,
  Grid,
  HelpCircle
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "w-5 h-5", size = 20, ...props }) => {
  const IconComponent = iconMap[name] || Sparkles;
  return <IconComponent className={className} size={size} {...props} />;
};
