<template>
  <div class="arithmeticTrain-container">
    <el-row>
      <el-col :span="24">
        <el-card class="card">
          <div slot="header">
            <span>离线数据模型训练</span>
            <el-button type="primary" class="cardbutton">
              模型训练开始
            </el-button>
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

  export default {
    name: 'ArithmeticTrain',
    components: { VabChart },
    data() {
      return {
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
          series: [
            {
              name: '访问量',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
            },
            {
              name: 'XX量',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
      }
    },
    created() {},
    mounted() {
      let base = +new Date(2020, 1, 1)
      let oneDay = 24 * 3600 * 1000
      let date = []

      let data = [Math.random() * 1500]
      let data2 = [Math.random() * 1300]
      let now = new Date(base)

      const addData = (shift) => {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        date.push(now)
        data.push(this.$baseLodash.random(20000, 60000))
        data2.push(this.$baseLodash.random(20000, 60000))

        if (shift) {
          //shift() 方法用于把数组的第一个元素从其中删除
          date.shift()
          data.shift()
          data2.shift()
        }

        now = new Date(+new Date(now) + oneDay)
      }

      for (let i = 1; i < 6; i++) {
        addData()
      }
      addData(true)
      this.fwl.xAxis[0].data = date
      this.fwl.series[0].data = data
      this.fwl.series[1].data = data2
      this.timer = setInterval(() => {
        // 删除数组第一个，再后续添加一个，相当于时序变化
        addData(true)
        this.fwl.xAxis[0].data = date
        this.fwl.series[0].data = data
        this.fwl.series[1].data = data2
      }, 3000)
    },
    methods: {},
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
