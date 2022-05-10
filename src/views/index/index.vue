<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="6"
      >
        <!-- <router-link :to="item.link" target="_blank"> -->
        <el-card class="icon-panel" shadow="never">
          <vab-icon
            :style="{ color: item.color }"
            :icon="['fas', item.icon]"
          ></vab-icon>
          <p>{{ item.title }}{{ item.data }}</p>
        </el-card>
        <!-- </router-link> -->
      </el-col>

      <el-col :span="18">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>依赖信息</span>
            <div style="float: right">部署时间:{{ updateTime }}</div>
          </div>

          <div>
            <el-card shadow="never">
              <div slot="header">
                <span>访问量</span>
              </div>
              <vab-chart auto-resize theme="vab-echarts-theme" :option="fwl" />
            </el-card>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>访问日志</span>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
              :color="activity.color"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
    <div>
      <version-information></version-information>
    </div>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  import { dependencies, devDependencies } from '../../../package.json'
  import { getList } from '@/api/changeLog'
  import { getList2 } from '@/api/indexpaper'
  import { getNoticeList } from '@/api/notice'
  import { getRepos, getStargazers } from '@/api/github'
  import Plan from './components/Plan'
  import VersionInformation from './components/VersionInformation'

  export default {
    name: 'Index',
    components: {
      VabChart,
      VersionInformation,
    },
    data() {
      return {
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        //访问量
        fwl: {
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: ['日志数量', '训练数据量', '测试数据量'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [],
              type: 'bar',
            },
          ],
        },

        //更新日志
        reverse: true,
        activities: [],
        noticeList: [],
        //其他信息
        userAgent: navigator.userAgent,
        //卡片图标
        iconList: [
          // {
          //   icon: 'th-large',
          //   title: '采集的数据类型数量：',
          //   link: '',
          //   color: '#ffc069',
          //   data: 0,
          // },
          {
            icon: 'random',
            title: '模拟设备数量：',
            link: '',
            color: '#5cdbd3',
            data: 0,
          },
          {
            icon: 'database',
            title: '数据类型数量：',
            link: '',
            color: '#b37feb',
            data: 0,
          },
          {
            icon: 'users',
            title: '用户量：',
            link: '',
            color: '#69c0ff',
            data: 0,
          },
        ],
      }
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    mounted() {
      this.fetchData2().then((res) => {
        console.log(res)
        this.fwl.series[0].data.push(res['alllog'])
        this.fwl.series[0].data.push(res['alltraindata'])
        this.fwl.series[0].data.push(res['alltestdata'])

        this.iconList[0].data = res['alldevice']
        this.iconList[1].data = res['alldata']
        this.iconList[2].data = res['alluser']
      })
    },
    methods: {
      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`)
      },
      handleZrClick(e) {},
      handleChangeTheme() {
        this.$baseEventBus.$emit('theme')
      },
      async fetchData() {
        const { data } = await getList()
        data.map((item, index) => {
          if (index === data.length - 1) {
            item.color = '#0bbd87'
          }
        })
        this.activities = data.slice(data.length - 7, data.length)
      },
      async fetchData2() {
        const { data } = await getList2()
        return data
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
