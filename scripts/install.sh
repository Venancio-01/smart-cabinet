#!/bin/bash

# 安装 deb 包
sudo apt install ./smart-cabinet-repo_*.deb

# 如果安装成功，将 run.sh 移动到 /opt/smart-cabinet-repo 目录下
if [ $? -eq 0 ]; then
  sudo mv ./run.sh /opt/smart-cabinet-repo/

  # 判断 gksu 是否已安装
  if [ $(dpkg-query -W -f='${Status}' gksu 2>/dev/null | grep -c "ok installed") -eq 0 ]; then
    echo "gksu 未安装"
    sudo apt-get install gksu
  else
    echo "gksu 已安装"
  fi
fi
