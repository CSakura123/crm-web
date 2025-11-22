<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="合同列表"
      :columns="columns"
      :requestApi="ContractApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <template #operation="scope">
        <el-button type="success" link :icon="CircleCheckFilled" v-hasPermi="['sys:contract:pass']" @click="showApprovalDialog(scope.row, 0)">审核通过</el-button>
        <el-button type="danger" link :icon="CircleCheckFilled" v-hasPermi="['sys:contract:reject']" @click="showApprovalDialog(scope.row, 1)">审核不通过</el-button>
      </template>
    </ProTable>

    <!-- 审核原因对话框 -->
    <el-dialog v-model="dialogVisible" :title="approvalType === 0 ? '审核通过原因' : '审核不通过原因'" width="500px">
      <el-form :model="approvalForm" label-width="100px">
        <el-form-item :label="approvalType === 0 ? '通过原因' : '拒绝原因'">
          <el-input v-model="approvalForm.reason" type="textarea" placeholder="请输入审核原因" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApproval">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ContractManage">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ContractApi } from '@/api/modules/contract'
import { ContractStatusList } from '@/configs/enum'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ status: 1 })

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 审核对话框相关
const dialogVisible = ref(false)
const approvalForm = reactive({
  id: '',
  type: 0,
  reason: ''
})
const approvalType = ref(0)
const currentRow = ref<any>(null)

// 显示审核对话框
const showApprovalDialog = (row: any, type: number) => {
  currentRow.value = row
  approvalType.value = type
  approvalForm.id = row.id
  approvalForm.type = type
  approvalForm.reason = ''
  dialogVisible.value = true
}

// 提交审核
const submitApproval = async () => {
  if (!approvalForm.reason.trim()) {
    ElMessage.warning(approvalType.value === 0 ? '请输入审核通过原因' : '请输入审核不通过原因')
    return
  }

  try {
    await useHandleData(
      ContractApi.approvalContract,
      {
        id: approvalForm.id,
        type: approvalForm.type,
        reason: approvalForm.reason,
        sendEmail: true
      },
      approvalForm.type === 0 ? '审核通过' : '审核不通过'
    )
    dialogVisible.value = false
    proTable.value.getTableList()
  } catch (error) {
    console.error(error)
  }
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '合同名称',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'number',
    label: '合同编号',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'customerName',
    label: '客户姓名',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'amount',
    label: '合同金额',
    minWidth: 100
  },
  {
    prop: 'receivedAmount',
    label: '已收到款项',
    minWidth: 140
  },
  {
    prop: 'status',
    label: '合同状态',
    minWidth: 120,
    enum: Object.values(ContractStatusList),
    search: { el: 'select' }
  },
  {
    prop: 'signTime',
    label: '签约时间',
    minWidth: 140
  },
  {
    prop: 'startTime',
    label: '合同开始时间',
    minWidth: 140
  },
  {
    prop: 'endTime',
    label: '合同结束时间',
    minWidth: 140
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]
</script>
