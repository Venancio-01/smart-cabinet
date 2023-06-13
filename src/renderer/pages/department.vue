<script lang="ts" setup>
import type { ColumnsType } from "ant-design-vue/es/table";
import type { SysDept } from ".prisma/client";
import useSys from "@/hooks/useSys";
import useTime from "@/hooks/useTime";

const { getDepartmentsByCondition } = useSys();
const { resetOperationTimeoutCountdown } = useTime();

const condition = reactive<DepartmentQueryProps>({
  page: 1,
  size: 7,
  departmentName: "",
});

const data = ref<SysDept[]>([]);
const total = ref(0);
const columns: ColumnsType = [
  {
    title: "机构名称",
    dataIndex: "deptName",
    key: "deptName",
  },
];

async function onPageChange(page: number) {
  condition.page = page;

  getUserList();
}

async function handleSearch() {
  condition.page = 1;

  getUserList();
}

function handleInit() {
  condition.page = 1;
  condition.departmentName = "";
  data.value = [];

  getUserList();
}

async function getUserList() {
  resetOperationTimeoutCountdown();
  data.value = await getDepartmentsByCondition(condition);
}

onMounted(() => {
  handleInit();
});
</script>

<template>
  <div class="w-full h-full">
    <div class="flex">
      <a-form
        :model="condition"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        label-align="left"
        class="flex-1 grid grid-rows-2 grid-cols-2 gap-x-6"
        autocomplete="off"
      >
        <a-form-item label="机构名称">
          <a-input v-model:value="condition.departmentName" />
        </a-form-item>
      </a-form>

      <div class="w-[180px] flex justify-end">
        <a-button type="primary" @click="handleSearch"> 搜索 </a-button>
        <a-button class="ml-4" @click="handleInit"> 重置 </a-button>
      </div>
    </div>

    <a-table
      :data-source="data"
      :columns="columns"
      :pagination="{
        current: condition.page,
        pageSize: condition.size,
        total,
        onChange: onPageChange,
      }"
    >
      <template #emptyText>
        <span>暂无数据</span>
      </template>
    </a-table>
  </div>
</template>
