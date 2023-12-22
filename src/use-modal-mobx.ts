import { useStoreManagerParent } from '@lomray/react-mobx-manager';
import type { FC } from 'react';
import type { IModalProps, OmitProps } from './types';
import useModal from './use-modal';

/**
 * Use modal for custom inners
 */
const useModalMobx = <TCP extends object>(
  Component: FC<TCP>,
  modalProps?: OmitProps<IModalProps<TCP>> & Partial<Record<string, any>>,
  componentProps?: OmitProps<TCP>,
) => {
  const parentId = useStoreManagerParent();

  return useModal(Component, modalProps, { ...componentProps, parentId } as TCP);
};

export default useModalMobx;
