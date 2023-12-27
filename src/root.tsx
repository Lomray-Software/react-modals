import EventManager from '@lomray/event-manager';
import type { FC } from 'react';
import React, { useEffect, useCallback, useState } from 'react';
import CHANNEL from './channel';
import type { IEventsPayload, IModalItem, IModalProps, IModalRoot, THideModal } from './types';

/**
 * ModalRoot
 * @constructor
 */
const ModalRoot = <TCP extends object>({ Modal }: IModalRoot<TCP>) => {
  const [state, setState] = useState<IModalItem<TCP>[]>([]);

  /**
   * Clear modal state
   */
  const clearModalState: THideModal = useCallback(
    (id) => setState((prevState) => prevState.filter((el) => el.id !== id)),
    [],
  );

  /**
   * Hide modal with animation
   */
  const hideModal: THideModal = useCallback((id) => {
    const isIdNotFound = !id || typeof id === 'object';

    clearModalState(id);

    setState((prevState) =>
      prevState.map((el) => {
        if (isIdNotFound || el.id === id) {
          return { ...el, modalProps: { ...el.modalProps, isVisible: false } };
        }

        return el;
      }),
    );
  }, []);

  /**
   * Build modal item structure
   */
  const buildModalItem: (
    Component: FC<TCP> | null,
    modalProps: IModalProps<TCP>,
    id: string,
    componentProps?: TCP,
  ) => IModalItem<TCP> = useCallback(
    (Component, modalProps, id, componentProps) => ({
      Component,
      modalProps: {
        ...modalProps,
        isVisible: true,
        closeModal: () => hideModal(id),
      },
      id,
      componentProps,
    }),
    [],
  );

  /**
   * Open modal
   * Component - modal body component. Modal wrapper already added in consumer
   */
  const openModal = useCallback(
    (Component: FC<TCP> | null, modalProps: IModalProps<TCP>, id: string, componentProps?: TCP) => {
      setState((prevState) => {
        const isIdExists = prevState.some((el) => el.id === id);
        const modalItem = buildModalItem(Component, modalProps, id, componentProps);

        // In some cases need to rewrite modal state (like one modal state changing)
        if (isIdExists) {
          return prevState.map((el) => {
            if (el.id === id) {
              return modalItem;
            }

            return el;
          });
        }

        // Push to state new modal
        return [...prevState, modalItem];
      });
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = EventManager.subscribe(
      [CHANNEL.OPEN, CHANNEL.HIDE],
      ({ event, id, ...rest }: IEventsPayload<TCP>) => {
        switch (event) {
          case CHANNEL.OPEN:
            const { Component, modalProps, componentProps } = rest;

            openModal(Component, modalProps as unknown as IModalProps<TCP>, id, componentProps);

            return;

          case CHANNEL.HIDE:
            hideModal(id);

            return;
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {state.map(({ Component, id, modalProps, componentProps = {} }, index) => {
        if (!Component) {
          return null;
        }

        const { closeModal, isVisible } = modalProps;

        return (
          <Modal {...modalProps} key={`${id}${index}`}>
            {/* @TODO Component type
            // @ts-ignore */}
            <Component {...componentProps} closeModal={closeModal} isVisible={isVisible} />
          </Modal>
        );
      })}
    </>
  );
};

export default ModalRoot;
