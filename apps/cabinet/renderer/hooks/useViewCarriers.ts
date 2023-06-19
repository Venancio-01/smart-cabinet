import type { DocDocument } from "database"
import CarrierTable from "@/components/CarrierTable.vue";
import useCarrier from "@/hooks/useCarrier";
import { useStore } from "@/store";

export default function () {
  const store = useStore();
  const { cabinetDoorList, misPlaceCarrierData } = storeToRefs(store);
  const { getCarriersByCondition } = useCarrier();

  const data = ref<DocDocument[]>([]);
  const total = ref(0);

  const getCarriers = async (condition: CarrierQueryProps) => {
    const result = await getCarriersByCondition(condition);

    data.value = result.data.map((item) => {
      const misPlaceDoorId = misPlaceCarrierData.value.reduce((acc, cur) => {
        if (cur.operationId === item.docRfid) acc = cur.cabinetDoorId;

        return acc;
      }, "");
      const misPlaceDoorName =
        cabinetDoorList.value.find((item) => item.id === Number(misPlaceDoorId))
          ?.viewName || "";
      return {
        ...item,
        misPlaceDoorName,
      };
    });
    total.value = result.total;
  };

  return {
    data,
    total,
    getCarriers,
    CarrierTable,
  };
}
