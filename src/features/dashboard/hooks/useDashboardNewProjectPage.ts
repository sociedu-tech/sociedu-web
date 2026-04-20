import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { mentorService } from '@/services/mentorService';
import type { User } from '@/types';
import {
  NEW_PROJECT_DEMO_MENTORS,
  NEW_PROJECT_DURATION_OPTIONS,
  NEW_PROJECT_TOPIC_TAGS,
} from '@/data/dashboardNewProjectMock';

function scoreMentor(mentor: User, selectedTags: Set<string>, textBlob: string): number {
  const info = mentor.mentorInfo;
  if (!info?.expertise?.length) return 0;
  let score = 0;
  for (const ex of info.expertise) {
    if (selectedTags.has(ex)) score += 24;
    else if (textBlob.includes(ex.toLowerCase())) score += 8;
  }
  const rating = info.rating ?? mentor.rating ?? 0;
  score += Math.round(rating * 3);
  if (info.verificationStatus === 'verified') score += 6;
  return score;
}

export function useDashboardNewProjectPage() {
  const router = useRouter();
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);
  const isMentee = role === ROLES.USER;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [duration, setDuration] = useState<string>(NEW_PROJECT_DURATION_OPTIONS[2].value);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const [mentors, setMentors] = useState<User[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [mentorsError, setMentorsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setMentorsLoading(true);
      setMentorsError(null);
      try {
        const data = await mentorService.getAll();
        if (!cancelled) {
          const withMentorInfo = data.filter((m) => m.mentorInfo?.expertise?.length);
          setMentors(withMentorInfo.length > 0 ? withMentorInfo : NEW_PROJECT_DEMO_MENTORS);
        }
      } catch {
        if (!cancelled) {
          setMentors(NEW_PROJECT_DEMO_MENTORS);
          setMentorsError('Không tải được danh sách mentor từ máy chủ. Đang hiển thị gợi ý mẫu.');
        }
      } finally {
        if (!cancelled) setMentorsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const textBlob = useMemo(() => `${title} ${description} ${goals}`.toLowerCase(), [title, description, goals]);

  const rankedMentors = useMemo(() => {
    const list = mentors.map((m) => ({
      mentor: m,
      score: scoreMentor(m, selectedTags, textBlob),
    }));
    list.sort((a, b) => b.score - a.score);
    const maxScore = list[0]?.score ?? 0;
    return list.map((row) => ({
      ...row,
      matchPct: maxScore > 0 ? Math.min(100, Math.round((row.score / maxScore) * 100)) : null,
    }));
  }, [mentors, selectedTags, textBlob]);

  const topSuggestions = useMemo(() => rankedMentors.slice(0, 6), [rankedMentors]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const t = title.trim();
    if (!t) {
      setSubmitError('Vui lòng nhập tên dự án.');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      router.push('/dashboard/projects?created=1');
    } catch {
      setSubmitError('Không thể lưu. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isMentee,
    title,
    setTitle,
    description,
    setDescription,
    goals,
    setGoals,
    duration,
    setDuration,
    selectedTags,
    topicTags: NEW_PROJECT_TOPIC_TAGS,
    durationOptions: NEW_PROJECT_DURATION_OPTIONS,
    mentorsLoading,
    mentorsError,
    submitting,
    submitError,
    onSubmit,
    toggleTag,
    topSuggestions,
  };
}
