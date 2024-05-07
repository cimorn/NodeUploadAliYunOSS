# NodeUploadAliYunOSS
Node.js upload AliYunOSS for local PC


### 安装`Node.js`

直接在官网下载即可



### 安装`ali-oss`包

1. 终端运行`npm install ali-oss`即可

2. 如果显示

   ```yml
   npm ERR! Cannot read properties of null (reading 'matches')
   
   npm ERR! A complete log of this run can be found in: /Users/mcsjourneys/.npm/_logs/2024-05-06T16_46_10_804Z-debug-0.log
   ```

​	终端运行`sudo chown -R 501:20 "/Users/mcsjourneys/.npm"`后在运行`npm install ali-oss`.

​	如果还是一样, 说明`node_modules`文件夹起了冲突, 可以在文件夹里建子文件夹, 避开文件冲突. 只不过后续需要进入子文件夹操作如`cd oss`



### 新建文件`oss.js`

在文件目录下新建文件`oss.js`

```javascript
const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

// 配置OSS客户端
const client = new OSS({
    region: 'oss-cn-hongkong', // 替换为你的OSS区域
    accessKeyId: 'xxx', // 替换为你的AccessKeyId
    accessKeySecret: 'xxx', // 替换为你的AccessKeySecret
    bucket: 'xxx' // 替换为你的Bucket名称
  });

// 本地文件夹路径
// const localFolderPath = '../1/';
// 上一级的文件夹
const localFolderPath = './dist/'; 当前目录的dist文件夹
// 'path/to/your/local/files/**/*'; // 替换为你的本地文件目录


// 获取本地文件列表（包括子文件夹）
function getFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const fileList = [];
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      fileList.push(...getFiles(filePath)); // 递归获取子文件夹中的文件
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// 将文件上传到 OSS
async function uploadToOSS() {
  const files = getFiles(localFolderPath);
  try {
    for (const file of files) {
      // 忽略 .DS_Store 文件
      if (path.basename(file) === '.DS_Store') {
        console.log(`Ignoring ${file}`);
        continue;
      }
      const relativePath = path.relative(localFolderPath, file);
      const ossFilePath = relativePath.replace(/\\/g, '/'); // 将 Windows 路径转换为 POSIX 格式
      console.log(`Uploading ${ossFilePath}...`);
      await client.put(ossFilePath, fs.createReadStream(file));
      console.log(`Uploaded ${ossFilePath}`);
    }
    console.log('All files uploaded successfully.');
  } catch (err) {
    console.error('Error uploading files:', err);
  }
}

uploadToOSS();
```



### 运行

1. 没有子文件夹方案，终端直接运行`node oss.js`即可.
2. 有子文件夹方案，需要`cd 子文件夹名`在运行`node oss.js`


### 源码
GitHub：[NodeUploadAliYunOSS](https://github.com/cimorn/NodeUploadAliYunOSS)