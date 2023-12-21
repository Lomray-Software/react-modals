import EventManager from '@lomray/event-manager';
import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
// @TODO eslint: v4 not found in 'uuid'  import/named
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid';
import CHANNEL from './channel';
import type { IDefaultModalProps, IModalHookRef, IModalItem } from './types';

/**
 * Use modal for custom inners
 */
const useModal = <TProps extends object>(
  Component: IModalItem<TProps>['Component'],
  props?: IDefaultModalProps<TProps>,
  componentProps?: IModalItem<TProps>['componentProps'],
) => {
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
      EventManager.publish(CHANNEL.OPEN, {
        event: CHANNEL.OPEN,
        Component,
        props,
        componentProps: { ...componentProps, ...params },
        id: id.current,
      });
    },
    [Component, componentProps, props],
  );

  /**
   * Hide modal with current uniq ID
   */
  const hide = useCallback(
    () =>
      EventManager.publish(CHANNEL.HIDE, {
        event: CHANNEL.HIDE,
        id: id.current,
      }),
    [],
  );

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
