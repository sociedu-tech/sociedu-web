import { useCallback, useEffect, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import type {
  CreateServicePackagePayload,
  CreateServicePackageVersionPayload,
  CurriculumItemPayload,
  ServicePackageDto,
  UpdateServicePackagePayload,
} from '@/types';
import { isApiClientError } from '@/lib/api';

type State = {
  packages: ServicePackageDto[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const initialState: State = {
  packages: [],
  loading: true,
  saving: false,
  error: null,
};

const extractError = (err: unknown, fallback: string): string => {
  if (isApiClientError(err)) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
};

export const useMentorPackages = () => {
  const [state, setState] = useState<State>(initialState);

  const fetchPackages = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const list = await mentorService.getMyPackages();
      setState({ packages: list, loading: false, saving: false, error: null });
    } catch (err) {
      setState({
        packages: [],
        loading: false,
        saving: false,
        error: extractError(err, 'Không thể tải danh sách gói dịch vụ'),
      });
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const withSaving = useCallback(
    async <T>(action: () => Promise<T>, fallbackMsg: string): Promise<T> => {
      setState((prev) => ({ ...prev, saving: true, error: null }));
      try {
        const result = await action();
        return result;
      } catch (err) {
        const msg = extractError(err, fallbackMsg);
        setState((prev) => ({ ...prev, error: msg }));
        throw err;
      } finally {
        setState((prev) => ({ ...prev, saving: false }));
      }
    },
    [],
  );

  const createPackage = useCallback(
    async (payload: CreateServicePackagePayload) => {
      const created = await withSaving(
        () => mentorService.createMyPackage(payload),
        'Không thể tạo gói dịch vụ',
      );
      setState((prev) => ({ ...prev, packages: [created, ...prev.packages] }));
      return created;
    },
    [withSaving],
  );

  const updatePackage = useCallback(
    async (pkgId: string, payload: UpdateServicePackagePayload) => {
      const updated = await withSaving(
        () => mentorService.updatePackage(pkgId, payload),
        'Không thể cập nhật gói dịch vụ',
      );
      setState((prev) => ({
        ...prev,
        packages: prev.packages.map((p) => (p.id === pkgId ? { ...p, ...updated } : p)),
      }));
      return updated;
    },
    [withSaving],
  );

  const togglePackage = useCallback(
    async (pkgId: string) => {
      const updated = await withSaving(
        () => mentorService.togglePackage(pkgId),
        'Không thể đổi trạng thái gói',
      );
      setState((prev) => ({
        ...prev,
        packages: prev.packages.map((p) => (p.id === pkgId ? { ...p, ...updated } : p)),
      }));
      return updated;
    },
    [withSaving],
  );

  const archivePackage = useCallback(
    async (pkgId: string) => {
      await withSaving(() => mentorService.archivePackage(pkgId), 'Không thể xoá gói');
      setState((prev) => ({
        ...prev,
        packages: prev.packages.filter((p) => p.id !== pkgId),
      }));
    },
    [withSaving],
  );

  const createPackageVersion = useCallback(
    async (pkgId: string, payload: CreateServicePackageVersionPayload) => {
      const updated = await withSaving(
        () => mentorService.createPackageVersion(pkgId, payload),
        'Không thể tạo phiên bản mới',
      );
      setState((prev) => ({
        ...prev,
        packages: prev.packages.map((p) => (p.id === pkgId ? { ...p, ...updated } : p)),
      }));
      return updated;
    },
    [withSaving],
  );

  const addCurriculum = useCallback(
    async (pkgId: string, verId: string, payload: CurriculumItemPayload) => {
      const created = await withSaving(
        () => mentorService.addCurriculum(pkgId, verId, payload),
        'Không thể thêm mục curriculum',
      );
      setState((prev) => ({
        ...prev,
        packages: prev.packages.map((p) =>
          p.id === pkgId
            ? {
                ...p,
                versions: p.versions.map((v) =>
                  v.id === verId ? { ...v, curriculums: [...v.curriculums, created] } : v,
                ),
              }
            : p,
        ),
      }));
      return created;
    },
    [withSaving],
  );

  const updateCurriculum = useCallback(
    async (pkgId: string, verId: string, curId: string, payload: CurriculumItemPayload) => {
      const updated = await withSaving(
        () => mentorService.updateCurriculum(pkgId, verId, curId, payload),
        'Không thể cập nhật curriculum',
      );
      setState((prev) => ({
        ...prev,
        packages: prev.packages.map((p) =>
          p.id === pkgId
            ? {
                ...p,
                versions: p.versions.map((v) =>
                  v.id === verId
                    ? {
                        ...v,
                        curriculums: v.curriculums.map((c) => (c.id === curId ? updated : c)),
                      }
                    : v,
                ),
              }
            : p,
        ),
      }));
      return updated;
    },
    [withSaving],
  );

  const deleteCurriculum = useCallback(
    async (pkgId: string, verId: string, curId: string) => {
      await withSaving(
        () => mentorService.deleteCurriculum(pkgId, verId, curId),
        'Không thể xoá curriculum',
      );
      setState((prev) => ({
        ...prev,
        packages: prev.packages.map((p) =>
          p.id === pkgId
            ? {
                ...p,
                versions: p.versions.map((v) =>
                  v.id === verId
                    ? { ...v, curriculums: v.curriculums.filter((c) => c.id !== curId) }
                    : v,
                ),
              }
            : p,
        ),
      }));
    },
    [withSaving],
  );

  return {
    packages: state.packages,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    refresh: fetchPackages,
    createPackage,
    updatePackage,
    togglePackage,
    archivePackage,
    createPackageVersion,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum,
  };
};
