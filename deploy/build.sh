#!/usr/bin/env bash
# set -e
echo 'starting in build.sh'

SCRIPTDIR="$( cd "$( dirname "$0"  )" && pwd  )"

read -r -d '' usage <<- EOF
use:
  bash deploy/build.sh [options]
args:
  -e      构建环境[test, prod]
  -v      构建版本(x.x.x)
  -u      docker harbor 用户名
  -p      docker harbor 密码
EOF

# 参数
while getopts e:v:u:p: OPT; do
  case "$OPT" in
  e) opt_env=${OPTARG}
    ;;
  v) opt_version=${OPTARG}
    ;;
  u) opt_user=${OPTARG}
    ;;
  p) opt_password=${OPTARG}
    ;;
  \?)
    echo "${OPT}"
    echo "$usage"
    exit 1
  esac
done

# 环境校验
APP_ENV=('dev' 'test' 'prod')
valid_env=0
for i in "${APP_ENV[@]}"
  do
    if [[ ${i} == "$opt_env" ]]; then
      valid_env=1
    fi
  done

#对必填项做输入检查
if [[ $valid_env == 0 || -z $opt_version || -z $opt_user || -z $opt_password ]]; then
  echo "$usage"
  echo "env: $opt_env, version: $opt_version, user: $opt_user, password: ${opt_password:0:9}*****"
  exit 1
fi

echo "参数解析成功！"
echo "env: $opt_env, version: $opt_version, user: $opt_user, password: ${opt_password:0:9}*****"

echo "开始项目构建..."
node -v
npm install -g pnpm
pnpm install
pnpm build
echo "项目构建完成！"

echo "选择当前环境nginx配置:$opt_env"
if [ "$opt_env" = "prod" ];then
  cp "${SCRIPTDIR}"/nginx.prod.conf "${SCRIPTDIR}"/nginx.conf
elif [ "$opt_env" = "test" ];then
  cp "${SCRIPTDIR}"/nginx.test.conf "${SCRIPTDIR}"/nginx.conf
fi

echo "docker login..."
docker login --username "$opt_user" --password "$opt_password"  docker.io
echo "docker build..."
docker build -t wuyuw/uam-admin-fe-"$opt_env":"$opt_version" -f deploy/Dockerfile .
echo "docker push..."
docker push wuyuw/uam-admin-fe-"$opt_env":"$opt_version"

echo "打包完成！"
echo "环境: $opt_env"
echo "镜像: wuyuw/uam-admin-fe-$opt_env:$opt_version"
