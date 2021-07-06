/*
 * Copyright (C) 2021 The Gravitee team (http://gravitee.io)
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
import '../../src/atoms/gv-vue-meter';
import notes from '../../.docs/gv-message.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-vue-meter',
  component: 'gv-vue-meter',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-vue-meter',
  css: `
    :host {
      height: 500px;
      color: red;
    }
  `,
};

const items = [
  {
    levels: [
      {
        level: 1,
        targetLevel: false,
        score: 63,
      },
      {
        level: 2,
        targetLevel: false,
        score: 52,
      },
      {
        level: 3,
        targetLevel: false,
        score: 10,
      },
      {
        level: 4,
        targetLevel: true,
        score: 89,
      },
      {
        level: 5,
        targetLevel: false,
        score: 100,
      },
    ],
  },
];

export const basic = makeStory(conf, {
  items,
});
