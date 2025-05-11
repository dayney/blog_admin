# Cursor 编辑器配置

这个目录包含了 Cursor 编辑器的配置文件，用于确保团队成员在使用 Cursor 编辑器时拥有一致的开发体验。

## 配置文件说明

- `extensions.js` - 推荐安装的 Cursor 扩展列表
- `settings.js` - Cursor 编辑器设置

## 项目根目录配置文件

- `.cursorrules` - 项目代码规范规则，用于提示开发者遵循统一的代码风格
- `.cursorignore` - 指定 Cursor 应该忽略的文件和目录，类似于 .gitignore

## 代码规范

本项目使用以下规范：

- Vue 组件使用 PascalCase 命名
- CSS 类名使用 kebab-case 命名
- 代码缩进使用 2 个空格
- 使用单引号
- 语句末尾添加分号
- 每行最大长度为 120 个字符
- 使用 Element Plus 和 Tailwind CSS 的推荐实践

## 扩展推荐

Cursor 编辑器建议安装以下扩展：

- Vue Language Features (Volar) - Vue 3 支持
- ESLint - 代码质量检查
- Prettier - 代码格式化
- Tailwind CSS IntelliSense - Tailwind CSS 智能提示
- EditorConfig - 编辑器配置支持
- Code Spell Checker - 拼写检查

## 使用说明

1. 安装 Cursor 编辑器后，打开项目
2. Cursor 将自动应用 `.cursorrules` 和 `.cursorignore` 配置
3. 按照 `extensions.js` 中的推荐安装扩展
4. 通过 `settings.js` 中的配置设置编辑器

## 提交代码前检查

提交代码前，请确保：

1. 代码符合 ESLint 规则
2. 代码格式符合 Prettier 配置
3. 使用 `npm run lint` 检查代码质量
4. 使用 `cz` 命令按照项目提交规范提交代码 