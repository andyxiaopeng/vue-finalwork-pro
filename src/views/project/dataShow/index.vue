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
              :option="compressorAp"
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
              :option="compressorAt"
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
              :option="compressorBp"
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
              :option="compressorBt"
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
              areaStyle: {}, // 曲线面积
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
              name: '压缩机出口温度',
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
              name: '压缩机出口温度',
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
          legend: {
            data: ['压缩机进口压力', '压缩机出口压力'],
          },
          series: [
            {
              name: '压缩机进口压力',
              type: 'line',
              data: [],
              smooth: true,
              // areaStyle: {},
            },
            {
              name: '压缩机出口压力',
              type: 'line',
              data: [],
              smooth: true,
              // areaStyle: {},
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
          legend: {
            data: ['压缩机进口压力', '压缩机出口压力'],
          },
          series: [
            {
              name: '压缩机进口压力',
              type: 'line',
              data: [],
              smooth: true,
              // areaStyle: {},
            },
            {
              name: '压缩机出口压力',
              type: 'line',
              data: [],
              smooth: true,
              // areaStyle: {},
            },
          ],
        },
      }
    },
    created() {},
    mounted() {
      // WebSocket
      if ('WebSocket' in window) {
        this.websocket = new WebSocket(
          'ws://127.0.0.1:8099/websocket/' + this.userName
        )
        this.initWebSocket()
      } else {
        alert('当前浏览器 Not support websocket')
      }

      // 数据配置开始

      let date1 = []
      let date2 = []

      let date3 = []
      let date4 = []

      let data1 = []
      let data2 = []
      let data3 = []

      let data4 = []
      let data5 = []
      let data6 = []

      this.fetchData().then((res) => {
        console.log(res)
        let dataA = res['compressor-A']
        let dataB = res['compressor-B']

        dataA.map(function (value, index) {
          console.log(value, index)
          let df = value
          let now = new Date(1 * df['time'])
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          date1.push(nowstr)
          date2.push(nowstr)
          data1.push(df['pressureInt'])
          data2.push(df['pressureOut'])
          data3.push(df['temperature'])
        })
        this.compressorAp.xAxis[0].data = date1
        this.compressorAp.series[0].data = data1
        this.compressorAp.series[1].data = data2

        this.compressorAt.xAxis[0].data = date2
        this.compressorAt.series[0].data = data3

        dataB.map(function (value, index) {
          console.log(value, index)
          let df = value
          let now = new Date(1 * df['time'])
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          date3.push(nowstr)
          date4.push(nowstr)
          data4.push(df['pressureInt'])
          data5.push(df['pressureOut'])
          data6.push(df['temperature'])
        })
        this.compressorBp.xAxis[0].data = date3
        this.compressorBp.series[0].data = data4
        this.compressorBp.series[1].data = data5

        this.compressorBt.xAxis[0].data = date4
        this.compressorBt.series[0].data = data6
      })
    },
    beforeDestroy() {
      this.onbeforeunload()
    },
    methods: {
      // 获取初试数据的方法定义
      async fetchData() {
        const { data } = await getList()
        console.log(data)
        return data
      },

      // ----------------------- webSocket的方法定义
      initWebSocket() {
        // 连接错误
        this.websocket.onerror = this.setErrorMessage

        // 连接成功
        this.websocket.onopen = this.setOnopenMessage

        // 收到消息的回调
        this.websocket.onmessage = this.setOnmessageMessage

        // 连接关闭的回调
        this.websocket.onclose = this.setOncloseMessage

        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = this.onbeforeunload
      },
      setErrorMessage() {
        console.log(
          'WebSocket连接发生错误   状态码：' + this.websocket.readyState
        )
      },
      setOnopenMessage() {
        console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
      },
      setOnmessageMessage(event) {
        // 根据服务器推送的消息做自己的业务处理
        // 编写逻辑代码
        console.log('服务端返回：' + event.data)

        //  event.data == {"msg":"success","code":200,"data":{"code":"60","data":{"temperature":"50","pressureInt":"364","pressureOut":"87"},"deviceId":"compressor-A","timeStamp":"1649489814.4108973"}}
        // "data":{"code":"60","data":{"temperature":"50","pressureInt":"364","pressureOut":"87"},"deviceId":"compressor-A","timeStamp":"1649489814.4108973"}
        let df = JSON.parse(event.data)
        df = df['data']

        if (df['deviceId'] == 'compressor-A') {
          let now = new Date(1 * df['timeStamp'])
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          this.compressorAp.xAxis[0].data.push(nowstr)
          this.compressorAp.series[0].data.push(df['data']['pressureInt'])
          this.compressorAp.series[1].data.push(df['data']['pressureOut'])

          this.compressorAt.xAxis[0].data.push(nowstr)
          this.compressorAt.series[0].data.push(df['data']['temperature'])
        } else if (df['deviceId'] == 'compressor-B') {
          let now = new Date(1 * df['timeStamp'])
          let nowstr = [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          ].join(':')
          this.compressorBp.xAxis[0].data.push(nowstr)
          this.compressorBp.series[0].data.push(df['data']['pressureInt'])
          this.compressorBp.series[1].data.push(df['data']['pressureOut'])

          this.compressorBt.xAxis[0].data.push(nowstr)
          this.compressorBt.series[0].data.push(df['data']['temperature'])

          // console.log('date-new', this.compressorAp.xAxis[0].data.length)
        }
      },
      setOncloseMessage() {
        console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
      },
      onbeforeunload() {
        this.closeWebSocket()
      },
      closeWebSocket() {
        this.websocket.close()
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
