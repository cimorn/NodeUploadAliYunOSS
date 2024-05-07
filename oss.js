const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

// 配置OSS客户端
const client = new OSS({
    region: 'oss-cn-hongkong', // 替换为你的OSS区域
    accessKeyId: 'xxxx', // 替换为你的AccessKeyId
    accessKeySecret: 'xxxx', // 替换为你的AccessKeySecret
    bucket: 'xxxx' // 替换为你的Bucket名称
  });

// 本地文件夹路径
// const localFolderPath = '../dist/';
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