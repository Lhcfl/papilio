/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { atom } from 'jotai';
import { createContext } from 'react';

export const PageTabContext = createContext(atom('_default'));
