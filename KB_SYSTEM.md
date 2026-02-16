# 知识库系统（v1）

给你做了一套**本地 Markdown 知识库**，目标是：
- 低成本（不用数据库也能跑）
- 可搜索
- 可扩展（后续接向量检索也行）

## 目录结构

```text
kb/
  inbox/          # 临时记录，待整理
  notes/          # 正式知识条目
  projects/       # 项目知识
  references/     # 外部资料摘要
  templates/      # 模板
  index.json      # 由脚本生成的索引
scripts/
  kb-new.mjs      # 新建知识条目
  kb-index.mjs    # 生成索引
  kb-search.mjs   # 本地搜索
```

## 快速开始

### 1) 新建一条知识

```powershell
node scripts/kb-new.mjs "OpenClaw cron 用法" --type reference --tags openclaw,cron
```

### 2) 生成索引

```powershell
node scripts/kb-index.mjs
```

### 3) 搜索

```powershell
node scripts/kb-search.mjs "cron reminder"
```

## 建议工作流（别懒）

1. 有想法先扔 `kb/inbox/`
2. 每天整理到 `kb/notes/` 或 `kb/projects/`
3. 每次整理后跑一次 `kb-index`
4. 查资料先 `kb-search`，找不到再联网

## 命名规范

- 文件名：`YYYY-MM-DD-标题slug.md`
- 标题要具体，不要写“想法1”“笔记2”这种废命名
- tags 用英文逗号分隔，尽量稳定复用

## 后续可升级

- 接入 embedding 向量检索
- 自动摘要与去重
- 设定每周回顾 cron 自动提醒
