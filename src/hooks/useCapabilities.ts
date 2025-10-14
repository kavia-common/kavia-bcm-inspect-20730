import { useApiGet, useApiPost, useApiPut, useApiDelete, invalidateQueries } from './useApi';
import { baseUrl } from '../apis';

export interface Capability {
  id: string;
  name: string;
  is_edited: boolean;
}

// PUBLIC_INTERFACE
/**
 * Hook for managing capabilities data and operations
 */
export function useCapabilities() {
  const defaultSort = JSON.stringify({ name: "ASC" });

  // Get all capabilities
  const useGetCapabilities = (sort = defaultSort) => {
    return useApiGet<Capability[]>(
      ['capabilities', { sort }],
      `${baseUrl}corecapability?sort=${sort}`
    );
  };

  // Create capability
  const useCreateCapability = () => {
    return useApiPost<Capability, { name: string }>(
      `${baseUrl}coreCapability`,
      {
        onSuccess: () => {
          invalidateQueries(['capabilities']);
        },
      }
    );
  };

  // Update capability
  const useUpdateCapability = (id: string) => {
    return useApiPut<Capability, { name: string }>(
      `${baseUrl}coreCapability/${id}`,
      {
        onSuccess: () => {
          invalidateQueries(['capabilities']);
        },
      }
    );
  };

  // Delete capability
  const useDeleteCapability = () => {
    return useApiDelete<any, string>(
      `${baseUrl}coreCapability`,
      {
        onSuccess: () => {
          invalidateQueries(['capabilities']);
        },
      }
    );
  };

  return {
    useGetCapabilities,
    useCreateCapability,
    useUpdateCapability,
    useDeleteCapability,
  };
}