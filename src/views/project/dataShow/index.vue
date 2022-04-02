<template>
  <div class="dataShow-container">
    <el-row>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header">
            <span>压缩机A的压力变化图</span>
          </div>
          <div>
            <vab-chart
              auto-resize
              theme="vab-echarts-theme"
              :option="compressorAt"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header">
            <span>压缩机A的温度变化图</span>
          </div>
          <div>
            <vab-chart
              auto-resize
              theme="vab-echarts-theme"
              :option="compressorAp"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header">
            <span>压缩机B的压力变化图</span>
          </div>
          <div>
            <vab-chart
              auto-resize
              theme="vab-echarts-theme"
              :option="compressorBt"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card">
          <div slot="header">
            <span>压缩机B的温度变化图</span>
          </div>
          <div>
            <vab-chart
              auto-resize
              theme="vab-echarts-theme"
              :option="compressorBp"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabChart from '@/plugins/echarts'
  import { getList } from '@/api/dataShow'

  export default {
    name: 'DataShow',
    components: {
      VabChart,
    },
    data() {
      return {
        //访问量
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
          ],
        },
        compressorAt: {
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
          ],
        },

        compressorBt: {
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
          ],
        },

        compressorAp: {
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
          ],
        },

        compressorBp: {
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
          ],
        },
      }
    },
    created() {},
    mounted() {
      let base = +new Date()
      let intervalTime = 3000
      let date = []

      let data1 = []
      let data2 = []
      let data3 = []
      let data4 = []
      let now = new Date(base)

      const addData = (shift) => {
        // now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        let nowstr = [now.getHours(), now.getMinutes(), now.getSeconds()].join(
          ':'
        )
        date.push(nowstr)
        this.fetchData().then((res) => {
          console.log(res)
          data1.push(res['compressor-Apressure'])
          data2.push(res['compressor-Atemperature'])
          data3.push(res['compressor-Btemperature'])
          data4.push(res['compressor-Bpressure'])
        })

        if (shift) {
          //shift() 方法用于把数组的第一个元素从其中删除
          date.shift()
          data1.shift()
          data2.shift()
          data3.shift()
          data4.shift()
        }

        now = new Date(+new Date(now) + intervalTime)
      }

      for (let i = 1; i < 21; i++) {
        addData()
      }
      addData(true)
      this.fwl.xAxis[0].data = date
      this.fwl.series[0].data = data1

      this.compressorAt.xAxis[0].data = date
      this.compressorAt.series[0].data = data1

      this.compressorAp.xAxis[0].data = date
      this.compressorAp.series[0].data = data2

      this.compressorBt.xAxis[0].data = date
      this.compressorBt.series[0].data = data3

      this.compressorBp.xAxis[0].data = date
      this.compressorBp.series[0].data = data4

      this.timer = setInterval(() => {
        // 删除数组第一个，再后续添加一个，相当于时序变化
        addData(true)
        this.fwl.xAxis[0].data = date
        this.fwl.series[0].data = data1

        this.compressorAt.xAxis[0].data = date
        this.compressorAt.series[0].data = data1

        this.compressorAp.xAxis[0].data = date
        this.compressorAp.series[0].data = data2

        this.compressorBt.xAxis[0].data = date
        this.compressorBt.series[0].data = data3

        this.compressorBp.xAxis[0].data = date
        this.compressorBp.series[0].data = data4
      }, 3000)
    },
    methods: {
      async fetchData() {
        const { data } = await getList()
        // console.log(data)
        return data
      },
    },
  }
</script>
<style lang="scss" scoped>
  .dataShow-container {
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
