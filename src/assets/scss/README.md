# SCSS 样式组织结构

本项目所有的样式文件已经从CSS转换为SCSS格式，并且按照以下结构组织：

## 目录结构

```
scss/
├── variables.scss      // 全局变量（颜色、字体、间距等）
├── mixins.scss         // 混合器和函数
├── common.scss         // 通用工具类和辅助样式
├── base.scss           // 基础样式（重置和基础元素样式）
├── layout.scss         // 布局相关样式
├── main.scss           // 主要全局样式
└── index.scss          // 入口文件，导入所有其他样式
```

## 使用说明

1. **全局样式**：全局样式在`index.scss`中统一导入和管理

2. **变量和混合器**：当需要使用变量或混合器时，在组件中导入：
   ```scss
   @use '@/assets/scss/variables.scss' as *;
   @use '@/assets/scss/mixins.scss' as *;
   ```

3. **功能性样式**：
   - 功能性样式直接作为单独文件存放在scss目录下
   - 组件需要时可按需导入:
   ```scss
   @use '@/assets/scss/common.scss' as *;
   ```

4. **组件样式**：
   - 组件内的私有样式应使用`scoped`属性
   - 避免在组件中重复定义已在全局或功能性样式中定义过的样式

## 样式规范

1. 使用嵌套语法组织相关样式
2. 使用变量保持样式一致性
3. 针对复杂UI组件，使用混合器减少代码重复
4. 遵循BEM命名约定结构化CSS类名
5. 优先使用@use替代@import，符合Sass最新规范

## 文件作用

- **variables.scss**: 包含所有全局变量定义，如颜色、字体、间距等
- **mixins.scss**: 提供可复用的混合器和函数
- **common.scss**: 提供通用工具类，包括文本对齐、flex布局辅助类、间距和边距工具类等
- **base.scss**: 定义基础元素样式和CSS重置
- **layout.scss**: 定义主要布局结构样式
- **index.scss**: 作为入口文件，导入并组织所有其他样式文件

## 已完成迁移

- ✅ CSS已完全迁移至SCSS
- ✅ 模块化样式组织完成
- ✅ 共享变量和混合器抽取完成
- ✅ @use替代@import，采用最新Sass规范
