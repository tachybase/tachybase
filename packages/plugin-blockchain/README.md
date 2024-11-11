# @tachybase/plugin-blockchain

# 给文件添加执行权限（第一次要输入这些）
chmod +x start_geth.sh
chmod +x compile_contract.sh
chmod +x deploy_contract.sh

# 启动私链
pnpm run geth
# 编译
pnpm run compile
# 部署
pnpm run deploy