#!/bin/bash

# 设置初始端口
PORT=4000

# 检测端口是否被监听函数
# check_port() {
#   lsof -i :$1 > /dev/null
#   if [ $? -eq 0 ]; then
#     return 1
#   else
#     return 0
#   fi
# }

# # 检测初始端口是否被监听
# check_port $PORT
# if [ $? -eq 1 ]; then
#   echo "Port $PORT is already in use."
  
#   # 寻找可用端口
#   while true; do
#     PORT=$((PORT + 1))
#     check_port $PORT
#     if [ $? -eq 0 ]; then
#       echo "Switching to port $PORT."
#       break
#     fi
#   done
# fi

# 设置环境变量
export HOST=127.0.0.1
export PORT

# 启动 y-websocket
npx y-websocket
