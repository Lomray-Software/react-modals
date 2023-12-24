import { useStoreManagerParent } from '@lomray/react-mobx-manager';
import type { TMapStores } from '@lomray/react-mobx-manager';
import type { FC, MouseEvent } from 'react';
import type { IModalProps, OmitToggleProps, THideModal } from './types';
import useModal from './use-modal';

/**
 * Use modal for custom inners
 */
const useModalMobx = <TCP extends object, TS extends TMapStores>(
  Component: FC<TCP>,
  modalProps?: OmitToggleProps<IModalProps<Omit<TCP, keyof TS>>>,
  componentProps?: OmitToggleProps<TCP>,
): [
  (e?: MouseEvent<any> | null, params?: Omit<OmitToggleProps<TCP>, keyof TS>) => void,
  THideModal,
] => {
  const parentId = useStoreManagerParent();

  return useModal(
    Component,
    modalProps as IModalProps<TCP>,
    { ...componentProps, parentId } as TCP,
  );
};

export default useModalMobx;
