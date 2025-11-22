<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="日志管理"
      :columns="columns"
      :requestApi="LogApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
    </ProTable>
  </div>
</template>

<script setup lang="ts" name="LogManage">
import { ref, reactive, h } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { LogList } from '@/configs/enum'
import { LogApi } from '@/api/modules/log'
import { ElTag } from 'element-plus'
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ isPublic: 1 })
const dataSize = ref(0)
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  dataSize.value = data.list.size
  return {
    list: data.list,
    total: data.total
  }
}
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数: params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'title',
    label: '模块标题',
    minWidth: 160
  },
  {
    prop: 'operType',
    label: '业务类型',
    enum: Object.values(LogList),
    minWidth: 120
  },
  {
    prop: 'operUrl',
    label: '请求url',
    minWidth: 180,
    search: { el: 'input' }
  },
  {
    prop: 'operIp',
    label: '主机地址',
    minWidth: 120
  },
  {
    prop: 'operLocation',
    label: '操作地点',
    minWidth: 120
  },
  {
    prop: 'operName',
    label: '操作人员',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'status',
    label: '操作状态',
    minWidth: 120,
    render(scope) {
      const text = scope.row.status === 1 ? '失败' : '成功'
      const type = scope.row.status === 1 ? 'danger' : 'success'
      return h(ElTag, { type }, () => text)
    }
  },
  {
    prop: 'requestMethod',
    label: '请求方法',
    minWidth: 120
  },
  {
    prop: 'operParam',
    label: '请求参数',
    minWidth: 200
  },
  {
    prop: 'jsonResult',
    label: '返回参数',
    minWidth: 200
  },
  {
    prop: 'errorMsg',
    label: '错误消息',
    minWidth: 200
  },
  {
    prop: 'operTime',
    label: '操作时间',
    search: { el: 'date-picker', props: { type: 'datetimerange' }, span: 3 },
    minWidth: 160
  },
  {
    prop: 'costTime',
    label: '消耗时间(ms)',
    minWidth: 120
  }
]
</script>
