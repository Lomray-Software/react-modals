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

Use this to open application-owned modal content from hooks or refs. It supplies
lifecycle events and a root renderer, not styling, focus management, keyboard
handling, or an accessible dialog implementation. Supply those in your `Modal`
component. There is no `ModalProvider` export; `ModalRoot` is a named export.

Mount one `ModalRoot` per application and open modals after it has mounted. Roots
listen to shared event channels, so several roots are not independent scopes.
The small shell below demonstrates the wiring only, not a production dialog.

<!-- docs-test:example -->
```tsx
import React, { type FC, type PropsWithChildren } from 'react';
import { ModalRoot, useModal, type IModalToggle } from '@lomray/react-modals';

const ModalShell: FC<PropsWithChildren<IModalToggle>> = ({ children, isVisible }) =>
  isVisible ? <section>{children}</section> : null;

interface MessageProps extends IModalToggle {
  text: string;
}

const Message: FC<MessageProps> = ({ text, closeModal }) => (
  <div>
    <p>{text}</p>
    <button onClick={closeModal}>Close</button>
  </div>
);

const OpenButton = () => {
  const [open, hide] = useModal(Message);
  return (
    <>
      <button onClick={() => open({ text: 'Hello' })}>Open</button>
      <button onClick={() => hide()}>Hide</button>
    </>
  );
};

export const App = () => (
  <>
    <OpenButton />
    <ModalRoot Modal={ModalShell} />
  </>
);
```

`ModalRoot` unsubscribes when it unmounts. A modal opened by a hook does not
automatically close when that hook's owner unmounts; call `hide()` when your
application's lifecycle requires it. For access outside the owning component,
pass a `createModalRef<MessageProps>()` as `hookRef` in the second argument to
`useModal`; its methods are assigned by an effect, so do not call it before mount.

`useModalMobx` also passes the current MobX parent context ID to modal content.
It does not add a provider or style the dialog.

Release 2.0.1 declares peers on React, react-router-dom, @lomray/client-helpers and
@lomray/react-mobx-manager. Install compatible versions even for the basic hook;
the package root re-exports the MobX hook. The docs test records its pinned
fixture separately from these broad peer ranges. It checks opening and closing
in a simulated DOM, not accessibility or an SSR integration.

## Demo
Explore [demo app](https://github.com/Lomray-Software/modal-context-example) to more understand.

## Bugs and feature requests

Bug or a feature request, [please open a new issue](https://github.com/Lomray-Software/react-modals/issues/new).
