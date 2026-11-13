# AGENTS.md

本文件面向在本仓库中工作的 AI Agent 和开发者，说明项目定位、技术栈、目录结构、关键架构、生成文件、代码规范与提交要求。

## 1. 项目是什么

Papilio 是一个使用 React 编写的 [Misskey](https://misskey.io/) 第三方客户端，同时兼容部分 Sharkey API。项目目前处于活跃开发阶段。

- 许可证：`AGPL-3.0-or-later`（`sharkey-js/` 等 vendored 代码另有说明，见 `REUSE.toml`）
- 仓库：<https://github.com/Lhcfl/papilio>
- 部署：Vercel SPA（`vercel.json` 将所有路径重写到 `/`）
- 运行环境：Node.js >= 22，包管理器使用 `pnpm`（也可使用 `bun`，但默认命令以 pnpm 为准）

## 2. 技术栈

| 领域            | 技术                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| UI              | React 19、React Compiler、React DOM                                            |
| 构建            | Vite 8、`@vitejs/plugin-react`、`@rolldown/plugin-babel`                       |
| 路由            | TanStack Router（文件路由，`autoCodeSplitting`）                               |
| 数据请求 / 缓存 | TanStack Query + `query-async-storage-persister` + IndexedDB                   |
| 类型检查        | `tsrs`（Rust 版 TypeScript 7 编译器，替代 `tsc` / `tsgo`）                     |
| Lint            | Oxlint + `oxlint-tsgolint`（类型感知规则）                                     |
| 格式化          | Oxfmt，配置在 `.oxfmtrc.json`                                                  |
| 样式            | Tailwind CSS v4、CSS Variables、shadcn/ui                                      |
| 组件基础        | Base UI（`@base-ui/react`）、shadcn/ui、lucide-react、vaul、sonner             |
| 状态            | Zustand、Jotai、React Context                                                  |
| Misskey API     | `misskey-js` + vendored `sharkey-js` 类型                                      |
| i18n            | i18next + react-i18next + HTTP Backend                                         |
| 内容渲染        | `mfm-js`（MFM）、`sanitize-html`、`shiki`（代码高亮）                          |
| 图片 / 媒体     | `photoswipe`、`react-photoswipe-gallery`、`@misskey-dev/browser-image-resizer` |
| 其他            | `buraha`（blurhash worker）、`idb-keyval`、`react-error-boundary`              |

## 3. 常用命令

```sh
pnpm install          # 安装依赖（会执行 husky prepare）
pnpm dev              # 启动 Vite 开发服务器，默认 http://localhost:5173
pnpm build            # 生产构建，产物在 dist/
pnpm preview          # 预览生产构建
pnpm typecheck        # tsrs -b --noEmit
pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix
pnpm licence:check    # 检查 SPDX 许可证头
pnpm licence:annotate # 自动补充 SPDX 许可证头
pnpm test:pre-commit  # pre-commit 钩子实际执行的命令
pnpm test:pre-push    # 并行执行 licence check、typecheck、lint
pnpm format           # oxfmt，格式化整个仓库
pnpm format:check     # 检查格式（不改文件）
```

注意：

- 项目已移除 `typescript` 与 `@typescript/native-preview`，**不要使用 `pnpm exec tsc` 或 `tsgo`**。统一使用 `tsrs` / `pnpm typecheck`。
- `pnpm update-locales` 使用 Bun 运行：`bun dev-scripts/update-locale.ts`。
- `pnpm lint:reuse` 依赖 `pipx` 和 `reuse`。
- `pnpm proj:line-count` 依赖 `tokei`。
- 项目目前没有配置单元测试框架。若任务确实需要测试，先引入 `vitest`，并补充 `test` / `test:single` 脚本；不要凭空假设已有测试命令。

## 4. 目录结构

```text
.
├── src/
│   ├── main.tsx                 # 应用入口：QueryClient Provider、Router
│   ├── routeTree.gen.ts         # TanStack Router 自动生成，勿手改
│   ├── tailwind.css             # Tailwind v4 入口与主题变量
│   ├── routes/                  # 文件路由
│   ├── components/              # 业务组件（mk-*、note/、post-form/ 等）
│   ├── ui/                      # shadcn/ui 生成组件（Base UI），MIT，lint 忽略
│   ├── layouts/                 # 登录布局、侧边栏布局
│   ├── hooks/                   # 业务 hooks（timeline、note、user、upload 等）
│   ├── loaders/                 # 登录后数据加载、query options
│   ├── stores/                  # Zustand / Jotai / Context stores
│   ├── plugins/                 # i18n、IndexedDB、QueryClient 持久化
│   ├── providers/               # 全局 Provider（对话框、右栏、页面 Tab 等）
│   ├── settings/                # 设置页定义与自动生成默认值
│   ├── lib/                     # API 注入、工具函数、通知分组等
│   ├── modals/                  # 模态框组件
│   ├── types/                   # 业务类型，合并 Misskey / Sharkey 类型
│   ├── themes/                  # 主题 CSS
│   ├── assets/                  # 字体 CSS、语言元数据、emoji 列表
│   └── workers/                 # Web Worker（blurhash）
├── locales-source/              # 上游语言 YAML（locales、sharkey、stpv、sukerbuka）
├── sharkey-js/                  # 从 Sharkey 下载的 vendored 类型/API
├── dev-scripts/                 # 许可证、提交信息、locale/sharkey 下载 TUI
├── vite-plugins/                # Vite 插件（locale 生成器）
├── .github/workflows/ci.yml     # CI：lint、typecheck + build、REUSE lint
├── .husky/                      # Git hooks
├── .oxlintrc.json               # Oxlint 配置
├── components.json              # shadcn CLI 配置
├── tsconfig*.json               # TypeScript 项目引用配置
└── vite.config.ts               # Vite 插件、别名、构建配置
```

## 5. 启动与路由架构

### 应用入口

`src/main.tsx`：

1. 创建 TanStack Router（`defaultPendingComponent`、`defaultErrorComponent`）。
2. 使用 `PersistQueryClientProvider` 挂载 QueryClient 持久化。
3. 注册 Router 类型。
4. 调用 `loadFontCssByLocalStorage()` 恢复字体。

### 登录与根路由

`src/routes/__root.tsx` 负责：

- `beforeLoad` 检查 `localStorage.token`；未登录且目标路由没有 `staticData.noAuth` 时重定向到 `/login`。
- 已登录路由包裹 `WithLoginLoader`，它会加载：
  - 当前用户（`me`）
  - 站点 meta
  - NodeInfo
  - 自定义 emoji
- 加载完成后通过 React Context 提供给整个应用。
- 已登录时使用 `SidebarLayout` 渲染 `Outlet`。
- 挂载全局事件监听：通知、主频道、上传提示、通知清理。
- 开发环境挂载 TanStack Router / React Query Devtools。

公开页面（例如登录页）通过路由的 `staticData.noAuth = true` 绕过登录检查。

### 文件路由约定

- 路由文件位于 `src/routes/`，使用 `createFileRoute()`。
- 每个路由文件导出 `Route`。
- `src/routeTree.gen.ts` 由 `@tanstack/router-plugin` 自动生成，**禁止手动修改**。
- `autoCodeSplitting` 已开启，路由组件会自动拆包。
- 以 `-` 开头的文件是路由私有模块，不会成为路由，例如：
  - `src/routes/my/relations/-common.tsx`
  - `src/routes/settings/-atoms.ts`
  - `src/routes/search/-atoms.tsx`
- 常见命名：
  - `__root.tsx`：根路由
  - `_timeline/`：无路径布局（pathless layout）
  - `$id` / `$page` / `$acct`：动态参数
  - `index.tsx`：目录索引路由
  - `route.tsx`：父级布局路由
  - `@{$acct}.tsx`：用户主页路由

新增路由后，开发服务器或构建会自动更新 `routeTree.gen.ts`。

## 6. 数据层

### Misskey API

`src/lib/inject-misskey-api.ts` 是 API 与流的核心：

- `site`、`token` 从 `localStorage` 读取。
- `misskeyApi(endpoint, params)`：带 Misskey 类型的请求封装。
- `sharkeyApi(...)`：Sharkey 专属端点的类型封装。
- `injectMisskeyApi()`：惰性创建 `misskey-js` 的 `APIClient`。
- `injectMisskeyStream()` / `createStreamChannel()`：WebSocket 流封装。
- `storeUserSite()` / `storeUserToken()` / `saveToAccountList()` / `getAccountList()`：多账号支持。
- `logout()`：删除当前账号 IndexedDB，清理 token/site 后刷新页面。

业务类型在 `src/types/sharkey-api.ts` 中合并 Misskey 与 Sharkey 端点类型。新增 API 调用时优先复用 `misskeyApi` / `sharkeyApi`，不要直接裸用 `fetch`，除非是 NodeInfo 或非 Misskey 接口。

### TanStack Query

- `src/plugins/persister.ts` 创建全局 `queryClient`。
- Query 缓存通过 `idb-keyval` 持久化到 IndexedDB。
- 只有 `gcTime >= PERSIST_GC_TIME`（24 小时）的 query 会被持久化。
- 存储按账号隔离：
  - 已登录：`tok:<token 前 20 字符>`
  - 未登录：`site:<site>`
- `loaders/` 中定义登录后基础数据的 query options。
- 路由 loader 使用 `queryClient.query({ ...options, staleTime: 'static' })` 预先取数。
- 分页通常使用 `INITIAL_UNTIL_ID` 与无限查询。

### 状态管理

按用途选择：

- **Zustand**：设置、上传进度、站点、用户偏好等持久状态。
- **Jotai**：局部但跨组件共享的原子状态，例如未读通知数、搜索词。
- **React Context**：登录后稳定的 `me`、site meta、emoji、NodeInfo。
- **React Query**：服务器状态与缓存。

重要文件：

- `src/stores/perference.ts`：全局设置 `usePreference` 与用户设置 `useUserPreference`。
  - `usePreference` 持久化到 `localStorage`，key 为 `perference`（拼写是现有约定，不要随意改名）。
  - `useUserPreference` 持久化到 IndexedDB，按账号隔离。
  - 每个设置会自动生成 `setXxx` 方法。
- `src/stores/me.ts`、`site.ts`、`emojis.ts`、`node-info.ts`：Context hooks。
- `src/stores/unread-notifications.ts`：Jotai atom。

## 7. 设置系统

设置页定义位于 `src/settings/`，由 `src/settings/index.tsx` 自动收集。

新增设置时：

1. 在对应的 `src/settings/*.tsx` 中定义页面、分类和设置项。
2. 使用 `src/settings/types.ts` 提供的辅助函数：
   - `defineSettingsPage`
   - `defineCategory`
   - `defineSwitch`
   - `defineEnum`
   - `defineText`
   - `defineCustom` / `defineKeyCustom`
3. `DefaultSettings` 与 `DefaultUserSettings` 会自动生成，**不要手动修改默认值汇总对象**。
4. 全局设置放入 `usePreference`，账号级设置使用 `user: true` 并放入 `useUserPreference`。
5. 为设置名称、描述、枚举值补充 i18n 文案。

设置页 UI 组件在 `src/components/settings/`。

## 8. 国际化（i18n）

- i18next 初始化在 `src/plugins/i18n.ts`。
- 语言文件位于：

```text
locales-source/locales/
locales-source/sharkey-locales/
locales-source/stpv-locales/
locales-source/sukerbuka-locales/
```

- `vite-plugins/locales-generator.ts` 会合并上述目录的 YAML：
  - 生成 `src/assets/langs.json`（语言列表）
  - 构建时输出 `dist/locales/<lang>.json`
  - 开发时通过 `/locales/<lang>.json` 提供语言文件
- 运行时 i18next 使用 HTTP Backend 加载 `/locales/{{lng}}.json`。
- 当前语言保存在 `localStorage.lang`，回退到 `navigator.language`，再回退到 `en-US`。
- `pnpm update-locales` 会通过 TUI 下载上游语言文件。
- 不要手改 `src/assets/langs.json`，它是生成文件。
- Papilio 自有文案优先放到 `sukerbuka-locales`，避免与上游 locale 同步冲突。

## 9. 样式与 UI 约定

- Tailwind CSS v4，配置是 CSS-first，入口在 `src/tailwind.css`。
- 主题颜色使用 CSS Variables，暗色模式通过 `.dark` class 切换。
- 使用 `cn()`（来自 `@/lib/utils`）合并 className。
- 组件包装的是哪个 HTML 元素，就应透传那个元素的 props（例如 `React.ComponentProps<'div'> & WindowParams`），让调用方可以正常使用 `className`、`style`、`id`、`aria-*`、`data-*` 等。
- 不要为组件的**内部子元素**发明 `headerClassName` / `titleClassName` 这类穿透式 prop 去改内部样式；内部样式由组件自己负责，或用有语义的变体。变体只在出现第二个真实用例时才抽。
- Tailwind class 顺序目前仍靠手写维护：Oxfmt 的 `sortTailwindcss` 在配置里显式设为 `false`（开启它会一次性重排约 280 个文件）。要切换时把它改成 `{ "stylesheet": "./src/tailwind.css" }`，跑一次 `pnpm format`，然后删掉这条说明。
- shadcn/ui 配置在 `components.json`：
  - style: `base-vega`（Base UI 版本）
  - base color: `olive`
  - icon library: `lucide`
- `src/ui/**` 是 shadcn 生成组件（基于 `@base-ui/react`）：
  - 许可证为 MIT
  - Oxlint 忽略该目录
  - 尽量少改；需要业务封装时放到 `src/components/` 下新建组件
  - 多态元素使用 Base UI 的 `render` prop，不再使用 Radix 的 `asChild`
- UI 组件统一从 `@/ui/*` 导入，业务组件放在 `@/components/*`。
- 业务组件命名前缀按「是否与 Misskey 功能相关」区分（`Mk` = Misskey）：
  - `Mk*`：直接承载或复刻 Misskey 客户端功能的组件，例如 `MkNote`、`MkNotification`、`MkMfm`、`MkAvatar`、`MkDrive`、`MkEmoji`、`MkPostForm`。Misskey 上游客户端组件同样以 `Mk*` 命名，保持同名便于对照。
  - `App*`：Papilio 自身的外壳与页面级 UI，Misskey 没有对应的功能概念，例如 `AppSidebar`、`AppNavBar`、`AppPageTab`、`AppRightCard`、`AppThemeToggle`、`AppDefaultErrorComponent`。
  - `src/ui/**` 的 shadcn 生成组件不加前缀。
  - 既有偏通用的组件（`MkError`、`MkEmpty`、`MkAlert`、`MkClock`、`MkI18n` 等）沿用了 `Mk*`，不必为改名而改名；新增组件按上述规则判定。
- 图标统一使用 `lucide-react`。
- Toast 使用 `sonner`，抽屉使用 `vaul`，图片查看使用 PhotoSwipe。
- MFM 渲染入口是 `src/components/mk-mfm.tsx`，不要把 MFM 当普通 Markdown 处理。

## 10. React Compiler 注意事项

项目通过 `@rolldown/plugin-babel` + `babel-plugin-react-compiler` 启用 React Compiler。

- 不要为了性能盲目添加 `useMemo` / `useCallback`，优先写简单、可推导的代码。
- 少数 hook 使用 `'use no memo'` 主动退出编译器优化（例如部分 Context hooks、draft、infinite loader）。不要无故删除。
- 需要手动 memo 的场景（如 `MkNote`）保留现有实现，改动前先确认性能影响。

## 11. 生成文件与 vendored 代码

以下内容不要手动编辑，除非任务明确要求：

| 路径                    | 说明                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `src/routeTree.gen.ts`  | TanStack Router 自动生成                                                              |
| `src/assets/langs.json` | locale 插件生成                                                                       |
| `dist/**`               | 构建产物，已 gitignore                                                                |
| `sharkey-js/**`         | 从 Sharkey 下载的 vendored 类型/API，通过 `bun dev-scripts/update-sharkey-js.ts` 更新 |
| `src/ui/**`             | shadcn/ui 生成组件（Base UI），MIT，lint 忽略                                         |
| `locales-source/**`     | 上游语言快照，通过 `pnpm update-locales` 更新                                         |

## 12. 代码规范

### 格式化

- 使用 Oxfmt，配置在 `.oxfmtrc.json`（`printWidth` 120、单引号、`sortTailwindcss` 关闭、`sortImports` 关闭）。
- Oxfmt 内置的 import 排序（`sortImports`）保持关闭，导入顺序仍按本文约定手写。
- 提交前运行 `pnpm format:check`。

### Lint

- 使用 Oxlint，配置在 `.oxlintrc.json`。
- 类型感知规则已开启，依赖 `oxlint-tsgolint`。
- `typescript/no-explicit-any` 为 error；确实需要 `any` 时使用 `oxlint-disable-next-line typescript/no-explicit-any` 并说明原因。
- `typescript/no-non-null-assertion` 关闭，但仍应避免无依据的 `!`。
- `typescript/ban-ts-comment` 要求 `@ts-expect-error` / `@ts-ignore` 带描述。
- 路由文件中的 `react/only-export-components` 已关闭，避免 TanStack Router 的 `Route` 导出误报。

### TypeScript

- 严格模式开启，同时开启 `noUnusedLocals`、`noUnusedParameters`、`erasableSyntaxOnly`、`verbatimModuleSyntax`。
- 类型导入使用 `import type`。
- 路径别名：
  - `@/` → `src/`
  - `@@/` → 仓库根目录（仅用于类型导入，Vite 运行时只配置了 `@`）
- 类型检查统一使用 `pnpm typecheck`（`tsrs`），不要使用 `tsc`。
- 谨慎使用 `@ts-expect-error`，必须写明原因。

### 导入顺序

保持现有风格：

1. 外部依赖
2. `@/` 别名导入
3. 相对路径 / 同目录导入

优先使用命名导入，避免不必要的默认导入。

### 响应性（React）

- **不得偷偷丢失响应性。** 任何可能变化的值（props、params、store 选择器、URL、context）都必须保持响应，不能只在首次渲染时读一次。
- 禁止把可变输入复制进 `useState` 初始值后不再同步，例如 `useState(() => params.exclude)`——那是快照，不是响应。需要由子组件修改的值，应把状态放到真正的所有者（store / 上层组件），再用受控 props 向下传。
- 唯一例外是确实只需要“首次渲染的初值”；这种情况下必须写明注释和理由，并确认上游不会在组件生命周期内更新该值。
- 同一个值不要有两个可写的所有者；出现两个真相时，改成单一所有者 + 受控更新，而不是靠 `useEffect` 双向同步。
- 派生值直接在渲染期计算；不要为了“缓存”而吞掉依赖变化（`useMemo` / 记忆化组件同理，依赖必须是完整的）。

### 命名

- 变量、函数：`camelCase`
- React 组件、类型：`PascalCase`
- 业务组件：`MkXxx` / `AppXxx`，前缀判定规则见 §9「样式与 UI 约定」
- 文件：组件文件通常使用 kebab-case，例如 `mk-post-form.tsx`
- 以 `use` 开头的函数会被 React 当作 hook：只有真正的 hook 才能这样命名，并且只能在组件或其它 hook 中调用；不要把普通函数/对象属性命名成 `use`。

### 文件组织

- 一个文件只导出一个组件。需要共享的类型、常量或工具函数时，放到单独的文件里。

### 注释

- **不要胡乱添加注释。** 写之前先问：这行代码是不是不言自明的？删掉注释，读者会误解或丢失信息吗？如果不会，就不要写。
- 注释解释**为什么**（非显然的约束、坑、取舍、外部限制），不复述**做了什么**（代码已经写清楚了）。
- 禁止用注释解释显而易见的声明、命名和赋值。“这里声明了状态，因为它不是参数”这类句子没有信息量，只会让下一个人怀疑有东西没说。
- 值得保留的注释：公共 API 的 JSDoc、反直觉的 hack 及其原因、不能从代码推出的约束、许可证头。

### 组合

- 能用同一棵 React 树里的父子组合表达的布局，就不要用 portal。portal 只用于真正脱离层叠/滚动容器的东西：dialog、popover、toast、菜单等。
- 不要把“让远处的组件往这里塞内容”当成组件 API 的设计目标。让拥有布局的组件直接渲染子组件，而不是提供槽位再传送。
- 如果一个抽象的存在理由就是“避免 portal”，那么实现里就不该出现 portal。
- 不要用 `React.Children` 检查子节点的组件类型来做隐式分区（header/body、slot 之类）。让实现显式写出结构，例如 `<WindowHeader>…</WindowHeader>` 之后的内容自然就是 body。
- 不要为只有一个用例的东西预先造抽象（变体表、策略对象、可配置项）。先直接写具体实现，出现第二个真实用例再抽。

### 错误处理

- 顶层错误使用 `react-error-boundary`。
- 不要静默吞掉错误；返回明确的错误 UI 或 `null`。
- 用户可见错误使用 `sonner` toast 或现有错误组件。

## 13. 许可证与 REUSE

- 项目使用 REUSE 规范管理许可证信息。
- `src/`、`dev-scripts/`、`vite-plugins/` 下的新源码文件必须包含：

```text
SPDX-FileCopyrightText: Linca and papilio-project
SPDX-License-Identifier: AGPL-3.0-or-later
```

- 可运行 `pnpm licence:annotate` 自动补充，`pnpm licence:check` 检查。
- 非代码文件的许可证映射在 `REUSE.toml`。
- 不要删除现有文件的 SPDX 头或 vendored 代码的许可证声明。
- CI 会运行 `pipx run reuse lint`。

## 14. Git 与提交

- 使用 Husky hooks：
  - pre-commit：`pnpm test:pre-commit`（许可证检查）
  - pre-push：`pnpm test:pre-push`（许可证、typecheck、lint）
- 提交信息会被 `.husky/prepare-commit-msg` 和 `dev-scripts/commit-message-format.js` 自动格式化并添加 emoji。
- 提交信息使用以下前缀之一：
  - `feat:`
  - `fix:`
  - `perf:`
  - `refactor:`
  - `docs:`
  - `style:`
  - `test:`
  - `chore:`
  - `chore(deps):`
  - `dev:`
  - `ui:`
  - `ux:`
  - `i18n:`
  - `breaking:`
  - `wip:`
  - `revert:`
- 示例：

```text
chore(deps): upgrade dependencies
fix(note): handle missing note
feat(settings): add font selector
```

## 15. CI

`.github/workflows/ci.yml` 包含三个 job：

1. **Lint**：`pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm format:check`
2. **Build**：`pnpm install --frozen-lockfile` → `pnpm typecheck` → `pnpm build`
3. **REUSE Lint**：`pipx run reuse lint`

CI 使用 Node 24 与 pnpm 10。本地可以使用更新版本，但不要提交与 CI 不兼容的脚本。

## 16. Agent 工作原则

- 修改前先读相关文件，保持改动最小。
- 不要编辑生成文件和 vendored 文件，除非任务明确要求。
- 不要扫描 `node_modules/`、`dist/`、`.git/` 等大目录做全文搜索。
- 使用 `pnpm` 维护依赖与 `pnpm-lock.yaml`，不要混用 npm/yarn。
- 不要提交密钥、token、`.env`、个人配置或 IndexedDB/localStorage 数据。
- 新增依赖前确认是否真的需要，避免引入体积大或与现有技术栈重复的包。
- 修改后至少运行：
  - `pnpm typecheck`
  - `pnpm lint`
  - 涉及构建/路由/样式时运行 `pnpm build`
  - 涉及许可证头时运行 `pnpm licence:check`
- 提交前确保 `pnpm test:pre-push` 通过。
