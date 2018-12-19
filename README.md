# mouse_min_web #


## 安装 ##

1.  安装[nodejs](https://nodejs.org/download/)

2.  设置 npm registry

    `npm config set registry https://registry.npm.taobao.org`

3.  安装插件。在工程根目录下运行:

    `npm install`


## 代理配置 ##

1.  在工程根目录下拷贝.proxy.default.json，重命名为.proxy.json
    
2.  将.proxy.json中的"server"修改为后端服务器的地址

## glup,grunt打包配置 ##

1.  将Gruntfile.js，gulpfile.js里面的xxxx替换为项目名称，pppp替换为Nginx代理的端口号

## 运行 ##

*   开发(启动浏览器调试)

    `npm run dev`

*   格式化代码

    `npm run format`

*   JavaScript代码检查

    `npm run lint`

*   生成发布包

    `npm run release`
