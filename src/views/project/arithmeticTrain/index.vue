<template>
  <div class="arithmeticTrain-container">
    <el-row>
      <el-col :span="24">
        <el-card class="card">
          <div slot="header">
            <span>离线数据模型训练</span>
          </div>
          <div>
            <vab-chart auto-resize theme="vab-echarts-theme" :option="fwl" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  import { getList, doEdit } from '@/api/arithmeticTrain'

  export default {
    name: 'ArithmeticTrain',
    components: { VabChart },
    data() {
      return {
        base: +new Date(2020, 1, 1),
        fiveMin: 1000 * 60,
        now: 0,
        fwl: {
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          legend: {
            data: ['real', 'prediction'],
          },
          series: [
            {
              name: 'real',
              type: 'line',
              data: [],
            },
            {
              name: 'prediction',
              type: 'line',
              data: [],
            },
          ],
        },
      }
    },
    created() {},
    mounted() {
      this.now = new Date(this.base)

      for (let i = 1; i < 60; i++) {
        this.fetchData().then((res) => {
          console.log(res)
          let data = res

          let now = this.now
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          console.log(data)
          this.fwl.xAxis[0].data.push(nowstr)
          this.fwl.series[0].data.push(data['realvalue'])
          this.fwl.series[1].data.push(data['prediction'])

          this.now = new Date(+new Date(now) + this.fiveMin)
        })
      }
      this.timer = setInterval(() => {
        // addData(true)
        this.fetchData().then((res) => {
          if (res == null) {
            clearInterval(this.timer)
          }
          console.log(res)
          let data = res

          let now = this.now
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          console.log(data)
          this.fwl.xAxis[0].data.push(nowstr)
          this.fwl.series[0].data.push(data['realvalue'])
          this.fwl.series[1].data.push(data['prediction'])

          this.now = new Date(+new Date(now) + this.fiveMin)
        })
      }, 5000)
    },
    beforeDestroy() {
      doEdit()
      clearInterval(this.timer)
    },
    methods: {
      async fetchData() {
        const { data } = await getList()
        return data
      },
    },
  }
</script>

<style lang="scss" scoped>
  .arithmeticTrain-container {
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
            height: 455px;
          }
        }
      }
    }
    .cardbutton {
      float: right;
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
