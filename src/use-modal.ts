import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useModalContext } from './context';
import type { IDefaultModalProps, IModalHookRef, IModalItem } from './types';

/**
 * Use modal for custom inners
 */
const useModal = <TProps extends object>(
  Component: IModalItem<TProps>['Component'],
  props?: IDefaultModalProps<TProps>,
  componentProps?: IModalItem<TProps>['componentProps'],
) => {
  const { openModal, hideModal } = useModalContext();

  /**
   * Uniq ID for each hook
   */
  const id = useRef(uuidv4());

  /**
   * Open modal
   */
  const open = useCallback<
    (e?: MouseEvent<any> | null, params?: IModalItem<TProps>['componentProps']) => void
  >(
    (e, params) => {
      openModal<TProps>(Component, props, { ...componentProps, ...params } as TProps, id.current);
    },
    [Component, componentProps, openModal, props],
  );

  /**
   * Hide modal with current uniq ID
   */
  const hide = useCallback(() => hideModal(id.current), [hideModal]);

  /**
   * Set functions to ref
   */
  useEffect(() => {
    if (!props?.hookRef) {
      return;
    }

    (props.hookRef as IModalHookRef<TProps>).open = open;
    (props.hookRef as IModalHookRef<TProps>).hide = hide;
  }, [open, hide, props?.hookRef]);

  return useMemo(() => [open, hide], [hide, open]);
};

export default useModal;
