<script lang="tsx" setup>
import type { DocDocument } from "database";
import type { ColumnsType } from "ant-design-vue/lib/table/interface";
import dayjs from "dayjs";
import { BorrowedState } from "~/enums";
import { useStore } from "@/store";

interface Props {
  operable: boolean;
  data: DocDocument[];
  total: number;
  condition: {
    page: number;
    size: number;
  };
}

type CustomCarrierType = DocDocument & { visible: boolean };

const props = withDefaults(defineProps<Props>(), {
  operable: false,
});
const emits = defineEmits(["onPageChange", "onDataChange"]);
const store = useStore();
const { userList, departmentList, cabinetDoorList, misPlaceCarrierData } =
  storeToRefs(store);

const selfData = ref<CustomCarrierType[]>([]);

watch(
  () => props.data,
  () => {
    selfData.value = props.data.map((item) => ({ ...item, visible: false }));
  }
);
const columns = ref<ColumnsType<CustomCarrierType>>([
  {
    title: "载体名称",
    dataIndex: "docName",
    key: "docName",
  },
  {
    title: "所属柜门",
    dataIndex: "viewName",
    key: "viewName",
    customRender: ({ record }) => {
      return cabinetDoorList.value.find(
        (item) => item.id === record.cabinetDoorId
      )?.viewName;
    },
  },
  {
    title: "所在柜门",
    dataIndex: "viewName",
    key: "viewName",
    customRender: ({ record }) => {
      return judgeIsMisPlace(record) && record.misPlaceDoorName;
    },
  },
  {
    title: "所属部门",
    dataIndex: "department",
    key: "department",
    customRender: ({ record }) => {
      return departmentList.value.find((item) => item.deptId === record.deptId)
        ?.deptName;
    },
  },
  {
    title: "状态",
    width: "80px",
    dataIndex: "docPStatus",
    key: "docPStatus",
  },
  {
    title: "最后操作用户",
    dataIndex: "docLastUserId",
    key: "docLastUserId",
    customRender: ({ record }) => {
      return userList.value.find(
        (item) => Number(item.userId) === record.docLastUserId
      )?.userName;
    },
  },
  {
    title: "最后操作时间",
    dataIndex: "docLastTime",
    key: "docLastTime",
    width: "170px",
    customRender: ({ record }) => {
      return (
        record.docLastTime &&
        dayjs(record.docLastTime).format("YYYY-MM-DD HH:mm:ss")
      );
    },
  },
]);

function judgeIsMisPlace(doc: DocDocument) {
  const misPlace = misPlaceCarrierData.value.find(
    (item) => item.operationId === doc.docRfid
  );
  return misPlace;
}

function onPageChange(page: number) {
  emits("onPageChange", page);
}

function handleResizeColumn(width, column) {
  column.width = width;
}

onMounted(() => {
  columns.value = columns.value.map((item) => ({
    ...item,
    align: "center",
    ellipsis: true,
  }));
});
</script>

<template>
  <a-table
    :data-source="selfData"
    :columns="columns"
    :pagination="{
      current: condition.page,
      pageSize: condition.size,
      total,
      onChange: onPageChange,
    }"
    @resize-column="handleResizeColumn"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'docPStatus'">
        <span
          v-if="record.docPStatus === BorrowedState.Returned"
          class="text-green-500"
          >在柜</span
        >
        <span
          v-else-if="
            record.docPStatus === BorrowedState.Borrowed &&
            !judgeIsMisPlace(record)
          "
          class="text-warning"
          >领用</span
        >
        <template
          v-else-if="
            record.docPStatus === BorrowedState.Borrowed &&
            judgeIsMisPlace(record)
          "
        >
          <span class="text-error">错放</span>
        </template>
      </template>
    </template>

    <template #emptyText>
      <span>暂无数据</span>
    </template>
  </a-table>
</template>

<style scoped>
:deep(.ant-btn-link),
:deep(.ant-btn-text) {
  @apply p-0;
}
</style>
