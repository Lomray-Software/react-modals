import EventManager from '@lomray/event-manager';
import type { FC } from 'react';
import React, { useEffect, useCallback, useState } from 'react';
import CHANNEL from './channel';
import type { IEventsPayload, IModalContext, IModalItem, IModalRoot } from './types';

/**
 * ModalRoot Consumer
 * @constructor
 */
const ModalRoot: FC<IModalRoot> = ({ Modal }) => {
  const [state, setState] = useState<IModalItem[]>([]);

  /**
   * Clear modal state
   */
  const clearModalState: IModalContext['hideModal'] = useCallback(
    (id) => setState((prevState) => prevState.filter((el) => el.id !== id)),
    [],
  );

  /**
   * Hide modal with animation
   */
  const hideModal: IModalContext['hideModal'] = useCallback(
    (id) => {
      const isIdNotFound = !id || typeof id === 'object';

      clearModalState(id);

      setState((prevState) =>
        prevState.map((el) => {
          if (isIdNotFound || el.id === id) {
            return { ...el, props: { ...el.props, isVisible: false } };
          }

          return el;
        }),
      );
    },
    [clearModalState],
  );

  /**
   * Build modal item structure
   */
  const buildModalItem: IModalContext['openModal'] = useCallback(
    (Component, props, componentProps, id): IModalItem => ({
      Component: Component as IModalItem['Component'],
      props: {
        ...props,
        isVisible: true,
        toggle: () => hideModal(id),
      } as IModalItem['props'],
      id: id ?? 'DEFAULT',
      type: 'DEFAULT',
      componentProps,
    }),
    [hideModal],
  );

  /**
   * Open modal
   * Component - modal body component. Modal wrapper already added in consumer
   */
  const openModal: IModalContext['openModal'] = useCallback(
    (Component, props, componentProps, id) => {
      setState((prevState) => {
        const isIdExists = prevState.some((el) => el.id === id);

        // In some cases need to rewrite modal state (like one modal state changing)
        if (isIdExists) {
          return prevState.map((el) => {
            if (el.id === id) {
              return buildModalItem(Component, props, componentProps, id) as never;
            }

            return el;
          });
        }

        // Push to state new modal
        return [...prevState, buildModalItem(Component, props, componentProps, id)] as never;
      });
    },
    [buildModalItem],
  );

  useEffect(() => {
    const unsubscribe = EventManager.subscribe(
      [CHANNEL.OPEN, CHANNEL.HIDE],
      ({ event, id, ...rest }: IEventsPayload) => {
        switch (event) {
          case CHANNEL.OPEN:
            const { Component, props, componentProps } = rest;

            openModal(Component, props, componentProps, id);

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
      {state.map(({ Component, id, props, componentProps = {} }, index) => {
        if (!Component) {
          return null;
        }

        return (
          <Modal {...props} key={`${id}${index}`}>
            <Component {...componentProps} toggle={props.toggle} isVisible={props.isVisible} />
          </Modal>
        );
      })}
    </>
  );
};

export default ModalRoot;
