#!/usr/bin/env bash

# 1.在部署服务器上检出代码
# 2.确认待上线分支已push到远程仓库，且pipline执行结束
# 3.在部署服务器代码根目录下执行本部署脚本


# shellcheck disable=SC2034
SCRIPTDIR="$( cd "$( dirname "$0"  )" && pwd  )"
ROOTDIR="$( cd $SCRIPTDIR/.. && pwd )"
CODEDIR="$( cd $ROOTDIR/.. && pwd )"


read -r -d '' usage <<- EOF
use:
  bash deploy/deploy.sh [options]
args:
  -v      部署版本(x.x.x)
EOF

# 参数
while getopts e:v: OPT; do
  case "$OPT" in
  v) opt_version=${OPTARG}
    ;;
  \?)
    echo "${OPT}"
    echo "$usage"
    exit 1
  esac
done

#对必填项做输入检查
# shellcheck disable=SC2039
if [[ -z $opt_version  ]]; then
  echo "$usage"
  echo "version: $opt_version"
  exit 1
fi

echo "参数解析成功！"
echo "version: $opt_version"

sed -i "s#wuyuw/uam-admin-fe:.*#wuyuw/uam-admin-fe:$opt_version#g" "${SCRIPTDIR}"/docker-compose.yaml

echo "docker-compose.yaml 配置完成"
cat "${SCRIPTDIR}"/docker-compose.yaml
docker-compose -f "${SCRIPTDIR}"/docker-compose.yaml -p uam-admin-fe up -d
echo "部署成功！"