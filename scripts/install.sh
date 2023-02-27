#!/bin/bash

# 安装 deb 包
sudo apt install ./smart-cabinet-repo_*.deb

# 如果安装成功，将 run.sh 移动到 /opt/smart-cabinet-repo 目录下
if [ $? -eq 0 ]; then
  sudo mv ./run.sh /opt/smart-cabinet-repo/
fi
