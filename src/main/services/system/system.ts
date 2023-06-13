import { join } from "path";

export function getProductionBgImagePath() {
  return join(process.resourcesPath, "/public/background/index.png");
}
