# file-uploader-cli

通过命令行上传文件，可以方便的在Typora中使用。

支持以下服务: 

``github ``上传到GitHub Pages或者公共仓库(推荐使用)

``ali-oss`` 阿里云对象存储

``qiniu ``七牛云对象存储

``cos`` 腾讯云对象存储

``jdcloud`` 京东云对象存储

``ftp`` FTP服务器



#### 安装

```bash
npm install -g file-uploader-cli
```

#### 通过json文件导入配置

通过-t 指定配置类型，枚举值: github, ali-oss, qiniu, cos, jdcloud, ftp

通过-c 指定存放配置的json文件

```bash
file-uploader-cli -t github -c config.json
# 或者使用简写命令fuc 
fuc -t github config.json
```

> 当只有一个服务配置时，默认会使用该服务，当配置了多个配置时，可以通过-d来切换默认服务

```bash
# 指定上传服务默认使用ali-oss
fuc -d -t ali-oss
# or
fuc -dt ali-oss
```

#### 使用方式

可以同时上传多个文件，暂不支持上传目录

```bash
# 上传单个文件
fuc xxx.png
# 上传多个文件
fuc xxx.jpg xxx.js
```

#### 配置

可以将对应的服务放到一个JSON文件中进行配置

通用参数(非必要)：

```json
{
  "webp":true,
  "quality":75
}
```

``webp`` Boolean 图片是否需要转换成webp格式

``quality`` 0-100  webp图片压缩质量, 默认为75

**github**

```json
{
  "token": "*",
  "user": "*",
  "repo": "*",
  "path": "*",
  "jsdelivr": true
}
```

``token`` GitHub token

``user`` GitHub用户名

``repo`` 需要上传的GitHub仓库名

``path`` 指定上传目录

``jsdelivr`` Boolean 是否使用jsdelivr服务，默认为true。如果为false, repo需要是GitHub Pages仓库

> **jsDelivr** 是一个免费、开源的加速CDN公共服务, 可加速访问托管的项目目录或图片资源。任何开放的仓库都可以使用jsDelivr服务访问。
>
> tip:如果在Github Pages中使用图片, 可以将图片单独放到一个公共仓库中通过jsDelivr提供的CDN服务来访问，以减少仓库大小和拉取代码耗时

**ali-oss**

```json
{
  "bucket": "*",
  "region": "*",
  "accessKeyId": "*",
  "accessKeySecret": "*",
}
```

``region`` 对象存储服务所在区域，比如："oss-cn-beijing"

**qiniu**

```json
{
    "domain": "*",
    "accessKey": "*",
    "secretKey": "*",
    "zone": "",
    "scope": "*"
}
```

``domain`` URL 七牛云分配地址或自定义域名

``zone``  String  空间对应的机房, 比如: "Zone_z1"

**cos**

```json
{
  "SecretId": "*",
  "SecretKey": "*",
  "Bucket": "*",
  "Region": "*",
  "StorageClass": "*"
}
```

``Region`` 对象存储服务所在区域，比如："ap-beijing"

``StorageClass`` 储存类型，默认为"STANDARD"标准存储

**jdcloud**

```json
{
  "bucket": "*",
  "region": "*",
  "accessKeyId": "*",
  "secretAccessKey": "*"
}
```

``region`` 对象存储服务所在区域，比如："cn-north-1"

**ftp**

```json
{
  "host": "*",
  "port": 21,
  "user": "*",
  "password": "*",
  "url": "*",
  "path": "*"
}
```

``host`` 域名或IP

``path`` 指定上传目录，例如阿里云虚拟主机静态根目录为: "htdocs"

``url`` 访问资源的baseUrl



> 重要：请勿泄露自己的配置信息，以免造成财产损失和隐私泄露。
>
> 尽量使用最小权限: 对象存储服务使用子账户并为秘钥分配指定的权限

#### 支持选项

```bash

```





#### 在Typora中使用



其他参考：

[高性能 Node.js图像处理框架: sharp](https://sharp.pixelplumbing.com/)

[Github API操作工具: octonode](https://github.com/pksunkara/octonode)

[阿里云对象存储](https://oss.console.aliyun.com/bucket)
