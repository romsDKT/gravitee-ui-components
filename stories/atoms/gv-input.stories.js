/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../../src/atoms/gv-input';
import notes from '../../.docs/gv-input.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-input',
  component: 'gv-input',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-input',
};

const items = [
  { placeholder: 'Text...', label: 'Text label' },
  { placeholder: 'A valid email...', type: 'email', label: 'Email label' },
  { placeholder: 'Number', type: 'number', label: 'Number label' },
  { placeholder: 'Number between 1 and 10', type: 'number', min: '1', max: '10', label: 'Number label' },
  { placeholder: 'Search...', type: 'search', label: 'Search label' },
  { placeholder: 'Url...', type: 'url', label: 'Url label' },
  { placeholder: 'No Label...' },
  { placeholder: 'Password...', 'icon-left': 'general:shield-protected', type: 'password', label: 'Password label' },
];

export const Types = makeStory(conf, {
  items,
});

export const Small = makeStory(conf, {
  items: items.map((p) => ({ ...p, small: true, clearable: true })),
});

export const Large = makeStory(conf, {
  items: items.map((p) => ({ ...p, large: true, clearable: true })),
});

export const Clearable = makeStory(conf, {
  items: items.slice(0, items.length - 1).map((p) => ({ ...p, clearable: true })),
});

export const clipboard = makeStory(conf, {
  items: [
    { placeholder: 'Clipboard...', label: 'Simple clipboard', value: 'Copy me !', clipboard: true },
    { placeholder: 'Clipboard...', label: 'Readonly style clipboard', value: 'Copy me !', clipboard: true, readonly: true },
    { placeholder: 'Password...', type: 'password', label: 'Password clipboard', value: 'Copy me !', clipboard: true },
  ],
});

export const IconLeft = makeStory(conf, {
  items: items.map((p) => ({ ...p, 'icon-left': 'general:search' })),
});

export const Disabled = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true })),
});

export const Required = makeStory(conf, {
  items: items.map((p) => ({ ...p, required: true })),
});

export const Readonly = makeStory(conf, {
  items: items.map((p) => ({ ...p, required: true, readonly: true, value: 'Readonly value' })),
});

export const Slotted = makeStory(conf, {
  items: [
    {
      placeholder: 'Password...',
      'icon-left': 'general:shield-protected',
      type: 'password',
      label: 'Password label',
      innerHTML: '<input></input>',
    },
  ],
});

export const DisabledAndRequired = makeStory(conf, {
  items: items.map((p) => ({ ...p, disabled: true, required: true })),
});

export const Loading = makeStory(conf, {
  items: items.map((p) => ({ ...p, loading: true })),
});

export const LoadingAndRequired = makeStory(conf, {
  items: items.map((p) => ({ ...p, loading: true, required: true })),
});

export const Autofocus = makeStory(conf, {
  docs: `
  All fields have the autofocus attribute, so it's the last one in the dom that gets it.
`,
  items: items.map((p) => ({ ...p, autofocus: true })),
});

export const Skeleton = makeStory(conf, {
  items: items.map((p) => ({ ...p, skeleton: true })),
});
