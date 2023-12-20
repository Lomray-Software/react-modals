import { useStoreManagerParent } from '@lomray/react-mobx-manager';
import type { IDefaultModalProps, IModalItem, IModalParentId } from './types';
import useModal from './use-modal';

/**
 * Use modal for custom inners
 */
const useModalMobx = <TProps extends Record<string, any>>(
  Component: IModalItem<TProps & IModalParentId>['Component'],
  props?: IDefaultModalProps,
  componentProps?: IModalItem<TProps & IModalParentId>['componentProps'],
) => {
  const parentId = useStoreManagerParent();

  return useModal(Component as never, props, { ...componentProps, parentId });
};

export default useModalMobx;
