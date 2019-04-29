<template>
  <div class='timePikerWrap'>
    <div class="timePiker" :style="{width: width+'px'}">
      <el-date-picker
        v-model="startTime"
        type="date"
        placeholder="开始时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :picker-options="startTimePickerOptions"
        @change="timeChange('start')"></el-date-picker>
    </div>
    <div class="timePiker" :style="{width: width + 'px', marginLeft: margin + 'px'}">
      <el-date-picker
        v-model="endTime"
        type="date"
        placeholder="结束时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :picker-options="endTimePickerOptions"
        @change="timeChange('end')"></el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      startTime: null,
      endTime: null
    }
  },
  props: {
    width: {
      type: Number,
      default: 200
    },
    margin: {
      type: Number,
      default: 30
    }
  },
  computed: {
    //  结束时间 小于开始时间
    startTimePickerOptions(){
      let endTime = this.endTime
      endTime = endTime?  new Date(endTime) : Date.now()
      return {
        disabledDate(time) {
          return time.getTime() > endTime
        }
      }
    },
    //  开始时间设置 小于当天
    endTimePickerOptions() {
      let startTime = this.startTime
      startTime = startTime ? new Date(startTime) : 0
      return {
        disabledDate(time) {
          return time.getTime()  > Date.now() || time.getTime() < startTime;
        }
      }
    },
  },
  methods: {
    timeChange(type) {
      if(type === 'start'){
        this.$emit('startTimeChange', this.startTime)
      }else{
        this.$emit('endTimeChange', this.endTime)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .timePikerWrap, .timePiker{
    display: inline-block;
  }
  .timePiker{
    .el-date-editor.el-input{
      // width: 100%;
    }
  }
</style>
