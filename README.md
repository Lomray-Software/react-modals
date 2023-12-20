<h1 align='center'>React modals</h1>

<p align="center">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=reliability_rating" alt="reliability">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=security_rating" alt="Security Rating">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=sqale_rating" alt="Maintainability Rating">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=vulnerabilities" alt="Vulnerabilities">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=bugs" alt="Bugs">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=ncloc" alt="Lines of Code">
  <img src="https://img.shields.io/npm/l/@lomray/react-modals" alt="size">
  <img src="https://img.shields.io/npm/v/@lomray/react-modals?label=semantic%20release&logo=semantic-release" alt="semantic version">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=react-modals&metric=coverage" alt="code coverage">
</p>

## Table of contents
- [Getting started](#getting-started)
- [How to use](#how-to-use)
- [Code examples](#demo)
- [Bugs and feature requests](#bugs-and-feature-requests)

## Getting started

The package is distributed using [npm](https://www.npmjs.com/), the node package manager.

```
npm i --save @lomray/react-modals
```

## How to use

1. Add modal component types
```typescript
/**
 * types/lomray/react-modals.d.ts
 */
import { IModalProps as IModalPropsDefault } from '@lomray/react-modals'
import { TDialogProps } from '@components/modals/default'

declare module '@lomray/react-modals' {
  interface IModalProps extends IModalPropsDefault, TDialogProps {}
}
```

2. Add ModalProvider and ModalRoot with Dialog (Modal) component
```typescript jsx
/**
 * src/app.tsx
 */
import { ModalProvider } from '@lomray/react-modals';
import ModalRoot from '@lomray/react-modals';
import Layout from './components/layout';
import Dialog from './modals/default';

const App = () => {
  <ModalProvider>
    <Layout />
    <ModalRoot Modal={(props) => <Dialog {...props} />} />
  </ModalProvider>
}
```

3. Create new  modal layout with useModal hook
```typescript jsx
/**
 * src/my-modal.tsx
 */
import type { IModalToggle } from '@lomray/react-modals';
import { createModalRef, useModal } from '@lomray/react-modals';
import React, { FC } from 'react';

export interface IMyModal {
  text: string;
}

const MyModal: FC<IMyModal & IModalToggle> = ({ toggle, isVisible, text = 'default' }) => (
  <div style={{ width: 300 }}>
    <p>isVisible: {isVisible}</p>
    <p>text: {text}</p>
    <button onClick={toggle}>close</button>
  </div>
);

export const myModalRef = createModalRef<IMyModal>();

const useMyModal = () =>
  useModal<IMyModal>(MyModal, {
    className: 'additionalClassName',
    hookRef: myModalRef,
  });

export default useMyModal;
```

In cases where your modal window needs to access the parent store in Mobx, use the useModalMobx hook.

An example with Mobx can be found in Code examples
```typescript jsx
import { useModalMobx } from '@lomray/react-modals';
```


4. Use new modal in component via hook
```typescript jsx
/**
 * src/layout.tsx
 */
import { FC } from 'react';
import useMyModal, { myModalRef } from './my-modal';

const Layout: FC = () => {
  const [open] = useMyModal(); // [open, hide]

  return (
    <div>
      <button onClick={(e) => open(e, { text: 'hello' })}>
        open modal via hook
      </button>
      <button onClick={(e) => myModalRef?.open(e)}>
        open modal via global
      </button>
    </div>
  );
};

export default Layout;
```

## Code examples
Explore [demo app](https://github.com/Lomray-Software/modal-context-example) to more understand.

## Bugs and feature requests

Bug or a feature request, [please open a new issue](https://github.com/Lomray-Software/react-modals/issues/new).
