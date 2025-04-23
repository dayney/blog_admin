# 博客管理系统图标使用指南

## 关于图标选择

本项目使用Font Awesome图标库进行开发，不再使用自定义iconfont。

Font Awesome是一个广泛使用的图标库，提供了丰富的图标选择，可以满足项目的所有需求。

## 使用方法

在main.js中已引入Font Awesome：
```js
// 引入FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css';
```

在组件中使用图标的方式：

```html
<!-- 实心图标 -->
<i class="fas fa-user"></i>

<!-- 线框图标 -->
<i class="far fa-user"></i>

<!-- 品牌图标 -->
<i class="fab fa-weixin"></i>
```

## 图标种类

Font Awesome提供多种风格的图标：

- `fas` - Font Awesome Solid (实心图标)
- `far` - Font Awesome Regular (线框图标)
- `fab` - Font Awesome Brands (品牌图标)

## 常用图标参考

### 仪表盘卡片图标
- 用户总数: `fas fa-users`
- 内容总数: `fas fa-file-alt`
- 访问量: `fas fa-eye`
- 收入: `fas fa-yen-sign`

### 导航菜单图标
- 仪表盘: `fas fa-tachometer-alt`
- 设置: `fas fa-cog`
- 用户: `fas fa-user`
- 网站: `fas fa-globe`
- 搜索/SEO: `fas fa-search`
- 图片: `fas fa-image`
- 移动端: `fas fa-mobile-alt`
- 内容: `fas fa-file-alt`

### 操作图标
- 编辑: `fas fa-edit`
- 删除: `fas fa-trash-alt`
- 添加: `fas fa-plus`
- 保存: `fas fa-save`
- 刷新: `fas fa-sync`
- 上传: `fas fa-upload`
- 下载: `fas fa-download`

## 更多图标

完整的图标列表请访问 [Font Awesome官网](https://fontawesome.com/icons) 