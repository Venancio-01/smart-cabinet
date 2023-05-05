#!/bin/bash

# 安装 deb 包
sudo dpkg -i ../smart-cabinet_*.deb

# 如果安装成功，将 run.sh 移动到 /opt/smart-cabinet 目录下
if [ $? -eq 0 ]; then
  sudo cp ./run.sh /opt/smart-cabinet/ && \
  sudo chmod a+x /opt/smart-cabinet/run.sh
  sudo cp ./smart-cabinet.desktop /usr/share/applications/
  sudo cp ./smart-cabinet.desktop /home/$USER/桌面/
else
  echo "安装失败，请检查错误信息。"
fi