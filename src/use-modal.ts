import EventManager from '@lomray/event-manager';
import type { FC, MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
// @TODO eslint: v4 not found in 'uuid'  import/named
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid';
import CHANNEL from './channel';
import type { IModalProps, OmitProps, THideModal } from './types';

/**
 * Use modal for custom inners
 */
const useModal = <TCP extends object>(
  Component: FC<TCP>,
  modalProps?: OmitProps<IModalProps<TCP>>,
  componentProps?: OmitProps<TCP>,
): [(e?: MouseEvent<any> | null, params?: OmitProps<TCP>) => void, THideModal] => {
  /**
   * Uniq ID for each hook
   */
  const id = useRef(uuidv4());

  /**
   * Open modal
   */
  const open = useCallback<(e?: MouseEvent<any> | null, params?: TCP) => void>(
    (e, params) => {
      EventManager.publish(CHANNEL.OPEN, {
        event: CHANNEL.OPEN,
        Component,
        modalProps,
        componentProps: { ...componentProps, ...params },
        id: id.current,
      });
    },
    [Component, componentProps, modalProps],
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
    if (!modalProps?.hookRef) {
      return;
    }

    modalProps.hookRef.open = open;
    modalProps.hookRef.hide = hide;
  }, [open, hide, modalProps?.hookRef]);

  return useMemo(() => [open, hide], [hide, open]);
};

export default useModal;
