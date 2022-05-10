<template>
  <div class="arithmeticShow-container">
    <el-row>
      <el-col :span="24">
        <el-card class="card">
          <div slot="header">
            <span>时序数据模型预测</span>
          </div>
          <div>
            <vab-chart auto-resize theme="vab-echarts-theme" :option="fwl1" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header">
            <span>动态阈值</span>
          </div>
          <div>
            <vab-chart auto-resize theme="vab-echarts-theme" :option="fwl2" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="card">
          <div slot="header">
            <span>压缩机工作状态</span>
          </div>
          <div>
            <vab-chart auto-resize theme="vab-echarts-theme" :option="fwl3" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  import { getList, doEdit } from '@/api/arithmeticShow'

  export default {
    name: 'ArithmeticShow',
    components: { VabChart },
    data() {
      return {
        base: +new Date(2020, 1, 1),
        fiveMin: 1000 * 60,
        now: 0,

        fwl1: {
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
            data: ['realvalue', 'prediction'],
          },
          series: [
            {
              name: 'realvalue',
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
        fwl2: {
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
          series: [
            {
              name: '压缩机工作阈值',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
        fwl3: {
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
          series: [
            {
              name: '压缩机工作状态',
              type: 'line',
              data: [],
              smooth: true,
            },
          ],
        },
      }
    },
    created() {},
    mounted() {
      this.now = new Date(this.base)

      for (let i = 1; i < 61; i++) {
        this.fetchData().then((res) => {
          console.log(res)
          let data_prediction = res['prediction']
          let data_real = res['real']

          let now = this.now
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          this.fwl1.xAxis[0].data.push(nowstr)
          this.fwl2.xAxis[0].data.push(nowstr)
          this.fwl3.xAxis[0].data.push(nowstr)

          if (data_real) {
            this.fwl1.series[0].data.push(data_real['realvalue'])
          }
          this.fwl1.series[1].data.push(data_prediction['prediction'])

          this.fwl2.series[0].data.push(data_prediction['threshold'])
          this.fwl3.series[0].data.push(data_prediction['status'])

          this.now = new Date(+new Date(now) + this.fiveMin)
        })
      }

      this.timer = setInterval(() => {
        this.fetchData().then((res) => {
          console.log(res)
          let data_prediction = res['prediction']
          let data_real = res['real']

          let now = this.now
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          this.fwl1.xAxis[0].data.push(nowstr)
          this.fwl2.xAxis[0].data.push(nowstr)
          this.fwl3.xAxis[0].data.push(nowstr)

          if (data_real) {
            this.fwl1.series[0].data.push(data_real['realvalue'])
          }
          this.fwl1.series[1].data.push(data_prediction['prediction'])

          this.fwl2.series[0].data.push(data_prediction['threshold'])
          this.fwl3.series[0].data.push(data_prediction['status'])

          this.now = new Date(+new Date(now) + this.fiveMin)
        })
      }, 100)
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
  .arithmeticShow-container {
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
