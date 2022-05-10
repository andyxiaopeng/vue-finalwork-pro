<template>
  <div class="testsocket-container">
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
  import { getList } from '@/api/dataShow'

  export default {
    name: 'Testsocket',
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

      let date = []
      let data1 = []
      let data2 = []

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
          date.push(nowstr)
          data1.push(df['pressureInt'])
          data2.push(df['pressureOut'])
          // this.fwl.xAxis[0].data.push(nowstr)
          // this.fwl.series[0].data.push(df['pressureInt'])
          // this.fwl.series[1].data.push(df['pressureOut'])
        })
        this.fwl.xAxis[0].data = date
        this.fwl.series[0].data = data1
        this.fwl.series[1].data = data2
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
          this.fwl.xAxis[0].data.push(nowstr)

          this.fwl.series[0].data.push(df['data']['pressureInt'])
          this.fwl.series[1].data.push(df['data']['pressureOut'])
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
  .testsocket-container {
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
