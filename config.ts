
import { SuggestionCategory, SuggestionStatus } from './types';
import { BookOpen, Wrench, Users, FlaskConical, MoreHorizontal, Home, LayoutGrid, PlusCircle, Clock, CheckCircle2, PlayCircle, Eye } from 'lucide-react';
import React from 'react';

export const APP_CONFIG = {
  departmentName: 'יזמות וחדשנות',
  institutionName: 'המכללה האקדמית רמת גן',
  headOfDepartmentTitle: 'ראש החוג',
};

export const NAV_ITEMS = [
  { path: '/', label: 'בית', icon: Home },
  { path: '/feed', label: 'קיר החדשנות', icon: LayoutGrid },
  { path: '/submit', label: 'פרסום הצעה', icon: PlusCircle },
];

export const STATUS_CONFIG: Record<SuggestionStatus, { label: string, color: string, bg: string, icon: any }> = {
  [SuggestionStatus.PENDING]: { label: 'בבדיקה', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  [SuggestionStatus.REVIEWED]: { label: 'נבחן ע"י הסגל', color: 'text-blue-600', bg: 'bg-blue-50', icon: Eye },
  [SuggestionStatus.ACCEPTED]: { label: 'התקבל לביצוע', color: 'text-[#6a0dad]', bg: 'bg-purple-50', icon: PlayCircle },
  [SuggestionStatus.IMPLEMENTED]: { label: 'בוצע בשטח', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
};

export const CATEGORY_CONFIG: Record<SuggestionCategory, {
  label: string;
  icon: any;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  ringClass: string;
}> = {
  [SuggestionCategory.CURRICULUM]: {
    label: 'תכנית לימודים',
    icon: BookOpen,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
    ringClass: 'ring-blue-500/10',
  },
  [SuggestionCategory.FACILITIES]: {
    label: 'מתקנים וציוד',
    icon: Wrench,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
    ringClass: 'ring-emerald-500/10',
  },
  [SuggestionCategory.NETWORKING]: {
    label: 'נטוורקינג ואירועים',
    icon: Users,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-100',
    ringClass: 'ring-amber-500/10',
  },
  [SuggestionCategory.PRACTICAL]: {
    label: 'התנסות מעשית',
    icon: FlaskConical,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-100',
    ringClass: 'ring-indigo-500/10',
  },
  [SuggestionCategory.OTHER]: {
    label: 'אחר',
    icon: MoreHorizontal,
    colorClass: 'text-slate-600',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-100',
    ringClass: 'ring-slate-500/10',
  },
};
