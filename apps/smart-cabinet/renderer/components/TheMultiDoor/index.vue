<script lang="ts" setup>
import CabinetDoor from "./CabinetDoor.vue";
import { BorrowedState } from "~/enums";
import { useStore } from "@/store";
import useCabinet from "@/hooks/useCabinet";

const store = useStore();
const { cabinetDoorList, carrierList, departmentList, misPlaceCarrierData } =
  storeToRefs(store);
const { openCabinetDoor } = useCabinet();

/**
 * @description: 生成柜门列表
 * @param {*}
 * @return {*}
 */
const doorList = computed(() => {
  return cabinetDoorList.value.map((door) => {
    const totalCarriers = carrierList.value.filter(
      (item) => item.cabinetDoorId === door.id
    );
    const inPlaceCarriers = totalCarriers.filter(
      (item) => item.docPStatus === BorrowedState.Returned
    );
    const misPlaceCarries = misPlaceCarrierData.value.filter(
      (item) => Number(item.cabinetDoorId) === door.id
    );

    return {
      ...door,
      inPlaceCarrierCount: inPlaceCarriers.length,
      totalCarrierCount: totalCarriers.length,
      misPlaceCarrierCount: misPlaceCarries.length,
    };
  });
});

function generateDepartmentName(departmentId: number) {
  // @ts-expect-error bigint
  const department = departmentList.value.find(
    (item) => item.deptId === departmentId
  );

  return department ? department.deptName : "";
}
</script>

<template>
  <div class="col-span-2 grid grid-flow-col grid-rows-4 grid-cols-4 gap-4">
    <CabinetDoor
      v-for="(item, index) in doorList"
      :key="index"
      :index="index"
      :name="item.viewName || ''"
      :in-place-number="item.inPlaceCarrierCount"
      :mis-place-number="item.misPlaceCarrierCount"
      :total-number="item.totalCarrierCount"
      department-name=""
      @click="openCabinetDoor(item)"
    />
  </div>
</template>
