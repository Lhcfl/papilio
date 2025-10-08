# React 项目配置完成

## 已完成的配置

### ✅ 1. Vite 构建工具
- 使用 Rolldown-Vite v7.1.14
- 配置了路径别名 `@` 指向 `./src`

### ✅ 2. React 19.1.1
- 最新版本的 React 和 React DOM
- 配置了 TypeScript 支持

### ✅ 3. UnoCSS
- 已安装并配置 UnoCSS
- 使用的 presets:
  - `presetWind4()` - Tailwind CSS 兼容
  - `presetAttributify()` - 属性化模式
  - `presetIcons()` - 图标支持
  - `presetShadcn()` - shadcn/ui 组件支持
- 已引入 UnoCSS 重置样式 (`@unocss/reset/tailwind.css`)
- UnoCSS Inspector 可用: http://localhost:5173/__unocss/

### ✅ 4. TanStack Router (文件路由)
- 已配置 `@tanstack/router-plugin` 用于文件路由
- 创建了基础路由结构:
  - `src/routes/__root.tsx` - 根路由
  - `src/routes/index.tsx` - 首页
  - `src/routes/about.tsx` - 关于页
- 集成了 TanStack Router Devtools
- 路由文件将自动生成类型: `src/routeTree.gen.ts`

### ✅ 5. TanStack Query
- 已配置 `@tanstack/react-query`
- 在 `main.tsx` 中设置了 `QueryClientProvider`
- 可直接在组件中使用 `useQuery`、`useMutation` 等 hooks

### ✅ 6. shadcn/ui (通过 UnoCSS)
- 安装了 `unocss-preset-shadcn` 实现与 UnoCSS 的集成
- 创建了 `components.json` 配置文件
- 创建了组件目录结构:
  - `src/components/ui/` - UI 组件
  - `src/lib/` - 工具函数
- 配置了路径别名支持 shadcn CLI

### ✅ 7. unplugin-auto-import
- 自动导入 React hooks (`useState`, `useEffect` 等)
- 自动导入 TanStack Query hooks (`useQuery`, `useMutation`, `useQueryClient` 等)
- 自动导入 TanStack Router hooks (`useNavigate`, `useParams`, `useSearch` 等)
- 自动导入 `src/hooks` 和 `src/lib` 目录下的函数
- 类型声明文件: `src/auto-imports.d.ts`

## 项目结构

\`\`\`
papilio/
├── src/
│   ├── routes/              # 文件路由目录
│   │   ├── __root.tsx       # 根路由
│   │   ├── index.tsx        # 首页
│   │   └── about.tsx        # 关于页
│   ├── components/
│   │   └── ui/              # shadcn/ui 组件
│   ├── lib/                 # 工具函数
│   ├── hooks/               # 自定义 hooks
│   ├── main.tsx             # 应用入口
│   └── auto-imports.d.ts    # 自动生成的类型声明
├── components.json          # shadcn 配置
├── uno.config.ts            # UnoCSS 配置
├── vite.config.ts           # Vite 配置
└── tsconfig.json            # TypeScript 配置
\`\`\`

## 使用说明

### 添加 shadcn/ui 组件
由于使用了 `unocss-preset-shadcn`，shadcn CLI 可能无法直接使用。建议手动复制组件代码或使用兼容 UnoCSS 的组件。

### 创建新路由
在 `src/routes/` 目录下创建新的 `.tsx` 文件，例如：

\`\`\`tsx
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <div>Dashboard Page</div>
}
\`\`\`

### 使用 TanStack Query
得益于 auto-import，可以直接使用而无需手动导入：

\`\`\`tsx
function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })
  
  // ...
}
\`\`\`

### 使用 UnoCSS
直接使用 Tailwind CSS 风格的类名：

\`\`\`tsx
<div className="p-4 bg-blue-500 text-white rounded-lg">
  Hello World
</div>
\`\`\`

## 开发命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm preview` - 预览生产构建

## 注意事项

1. **自动导入**: 首次运行时会生成 `src/auto-imports.d.ts`，请不要手动修改此文件
2. **路由类型**: `src/routeTree.gen.ts` 由 TanStack Router 插件自动生成
3. **UnoCSS 与 shadcn**: 使用 `unocss-preset-shadcn` 而非 Tailwind CSS
4. **类型安全**: 所有配置都支持 TypeScript 类型检查

## 下一步

现在你可以：
1. 运行 `pnpm dev` 启动开发服务器（已运行）
2. 访问 http://localhost:5173/ 查看应用
3. 开始添加你的组件和路由
4. 使用 UnoCSS Inspector 调试样式: http://localhost:5173/__unocss/
