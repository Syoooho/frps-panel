<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-01 | Updated: 2026-03-01 -->

# assets

## 用途

静态资源目录，包含图片、字体、样式等静态文件。

## 核心文件

当前目录无直接文件。

## 子目录

| 目录 | 用途 |
|------|------|
| `styles/` | 额外的样式文件 |

## AI Agent 工作指南

### 在此目录工作时

- 图片文件放在此目录
- 使用 import 导入资源
- Vite 会自动处理资源优化

### 测试要求

- 静态资源无需测试

### 常见模式

- 导入图片：`import logo from './logo.png'`
- 使用：`<img src={logo} />`
- 支持的格式：png, jpg, svg, webp 等

## 依赖关系

### 内部依赖

- 被 `components/` 和 `pages/` 使用

### 外部依赖

无

<!-- MANUAL: 手动添加的备注请写在此行下方 -->
