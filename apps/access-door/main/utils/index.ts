import dayjs from "dayjs";
import electron from "electron";

export function generateCurrentTime() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
}

export function sendIpcToRenderer(channel, ...args) {
  electron.BrowserWindow.getAllWindows().forEach((wnd) => {
    if (wnd.webContents && !wnd.webContents.isDestroyed())
      wnd.webContents.send(channel, ...args);
  });
}

export function getSkipAndTake(condition?: Partial<PaginationType>): {
  skip?: number;
  take?: number;
} {
  if (!condition || !condition.page || !condition.size) return {};

  const { page, size } = condition;
  return { skip: (page - 1) * size, take: size };
}
