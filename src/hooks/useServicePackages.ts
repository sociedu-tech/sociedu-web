import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicePackageService } from '@/services/servicePackageService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  PackageQueryParams,
  CreateServicePackageRequest,
  UpdateServicePackageRequest,
  CreateVersionRequest,
  UpdateVersionRequest,
  CreateCurriculumRequest,
  ReorderCurriculumRequest,
} from '@/types';

export const useMyPackages = (params?: PackageQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.packages(params),
    queryFn: () => servicePackageService.getMyPackages(params),
  });
};

export const usePackageDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.packageDetail(id),
    queryFn: () => servicePackageService.getMyPackage(id),
    enabled: !!id,
  });
};

export const usePackageVersions = (packageId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.packageVersions(packageId),
    queryFn: () => servicePackageService.getPackageVersions(packageId),
    enabled: !!packageId,
  });
};

export const useCurriculums = (packageId: string, versionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.curriculums(versionId),
    queryFn: () => servicePackageService.getCurriculums(packageId, versionId),
    enabled: !!packageId && !!versionId,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServicePackageRequest) => servicePackageService.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packages() });
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServicePackageRequest }) =>
      servicePackageService.updatePackage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packages() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packageDetail(variables.id) });
    },
  });
};

export const useTogglePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicePackageService.togglePackage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packages() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packageDetail(id) });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicePackageService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packages() });
    },
  });
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packageId, data }: { packageId: string; data: CreateVersionRequest }) =>
      servicePackageService.createPackageVersion(packageId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.packageVersions(variables.packageId) });
    },
  });
};

export const useCreateCurriculum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      packageId,
      versionId,
      data,
    }: {
      packageId: string;
      versionId: string;
      data: CreateCurriculumRequest;
    }) => servicePackageService.addCurriculum(packageId, versionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curriculums(variables.versionId) });
    },
  });
};

export const useUpdateCurriculum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      packageId,
      versionId,
      curriculumId,
      data,
    }: {
      packageId: string;
      versionId: string;
      curriculumId: string;
      data: CreateCurriculumRequest;
    }) => servicePackageService.updateCurriculum(packageId, versionId, curriculumId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curriculums(variables.versionId) });
    },
  });
};

export const useDeleteCurriculum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      packageId,
      versionId,
      curriculumId,
    }: {
      packageId: string;
      versionId: string;
      curriculumId: string;
    }) => servicePackageService.deleteCurriculum(packageId, versionId, curriculumId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curriculums(variables.versionId) });
    },
  });
};

export const useReorderCurriculums = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ versionId, data }: { versionId: string; data: ReorderCurriculumRequest }) =>
      servicePackageService.reorderCurriculums(versionId, data),
    onMutate: async ({ versionId, data }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.curriculums(versionId) });
      const previousCurriculums = queryClient.getQueryData(QUERY_KEYS.curriculums(versionId));
      
      // We don't try to sort perfectly here unless we have all data, but we can set a dirty flag or sort locally if we want.
      // For safety, we can just let it refetch on success or error.
      
      return { previousCurriculums };
    },
    onError: (err, variables, context) => {
      if (context?.previousCurriculums) {
        queryClient.setQueryData(QUERY_KEYS.curriculums(variables.versionId), context.previousCurriculums);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.curriculums(variables.versionId) });
    },
  });
};
