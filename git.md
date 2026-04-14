
# Git 关键步骤总结

| 步骤               | 命令                                      |
|--------------------|-------------------------------------------|
| 初始化本地仓库      | `git init`                                |
| 添加文件到暂存区    | `git add .`                               |
| 提交文件到本地仓库  | `git commit -m "提交信息"`                |
| 配置远程仓库地址    | `git remote add origin 仓库地址`           |
| 推送代码到远程仓库  | `git push -u origin main`                 |

Git 可以通过全局配置来设置 HTTP/HTTPS 代理：

# 设置 HTTP 代理
git config --global http.proxy http://127.0.0.1:你的代理端口号
# 设置 HTTPS 代理
git config --global https://127.0.0.1:你的代理端口号
# 取消 HTTP 代理设置
git config --global --unset http.proxy
# 取消 HTTPS 代理设置
git config --global --unset https.proxy

git config --global http.proxy http://127.0.0.1:9674