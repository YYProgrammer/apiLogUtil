## 启动
- rm -rf node_modules && rm yarn.lock && yarn install && yarn start

## 项目背景
- 日常开发中，通常需要在flutter-request.log中找到某个api序号(比如#10)后，到flutter-api0.log中找到对应的api日志
- 痛点1：在flutter-api0.log中，需要手动搜索序号
- 痛点2：在flutter-api0.log定位到序号位置后，需要手动框选后面的返回内容
- 痛点3：如果返回内容很长，框选的过程比较痛苦
- 痛点4：框选后需要复制到另一个空文件里，再打开进行查看

## 使用方法
- 打开html，将flutter-request.log文件拖入到页面中
- 在输入框中输入要查找的序号，比如#10
- 回车后，页面会自动展示对应的api日志
- 支持复制、下载、在新的标签页中打开

## 测试
- 项目目录下有flutter-request.log，用于查看有哪些api序号
- 把flutter-api0.log入到页面中进行测试

## 0918新增记录：stream api日志适配
- 能够把这个stream api多次返回的所有内容提取到
- 点击download时会分为多个文件，每一次的返回会分别记录到一个文件里，便于查看
- 点击view时会在一个tab里同时浏览所有的返回

## 0919新增记录：压缩包适配
- 能够把ticket里下载的压缩包直接上传，省去手动解压

## 0920新增记录
- 增加左侧模块，用于拖入flutter-request.log文件，以备后续功能

## 0923新增记录
- 左侧模块增加逻辑：检查是否有api没有返回；检查是否有api返回状态码非200

## 0924更新记录
- 使用react框架重构项目
- 重新定义了项目UI