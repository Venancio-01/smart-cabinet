import { existsSync } from "fs";
import { execSync } from "child_process";
import { Library } from "ffi-napi";
import {
  ALGORITHM_SDK_PATH,
  LIBZKFINGER10_PATH,
  VERIFY_SCORE_THRESHOLD,
} from "utils/config";
import { info } from "../logger";
import { HandleType, IntType, TemplateType, UcharType } from "./types";

let algorithmSDK = null;
const zkfingerLibPath = "/usr/lib/libzkfinger10.so";

// 检查 libzkfinger10.so 文件是否存在，如果不存在则复制文件
export function checkFileExist() {
  if (!existsSync(zkfingerLibPath)) {
    // 文件不存在，复制文件
    try {
      execSync(`sudo cp ${LIBZKFINGER10_PATH} ${zkfingerLibPath}`);
      info("SDK 文件复制成功");
    } catch (err) {
      console.error(err);
    }
  } else {
    info("SDK 文件已存在目标文件夹内，跳过复制");
  }
}

// 通过 ffi 解析 C++ SDK 方法
export function initAlgorithmSDK() {
  algorithmSDK = Library(ALGORITHM_SDK_PATH, {
    BIOKEY_INIT_SIMPLE: [HandleType, ["int", "int", "int", "int"]], // 初始化算法
    BIOKEY_CLOSE: ["int", [HandleType]], // 释放算法
    BIOKEY_EXTRACT_GRAYSCALEDATA: [
      "int",
      [HandleType, UcharType, "int", "int", UcharType, "int", "int"],
    ], // 提取模版
    BIOKEY_IDENTIFYTEMP: ["int", [HandleType, UcharType, IntType, IntType]], // 1:N 识别
    BIOKEY_GENTEMPLATE: ["int", [HandleType, TemplateType, "int", UcharType]], // ⽣成登记特征(多个模板之中取最好)
    BIOKEY_VERIFY: ["int", [HandleType, UcharType, UcharType]], // 对比两个模板
    BIOKEY_DB_ADD: ["int", [HandleType, "int", "int", UcharType]], // 添加模板到1:N内存中
  });
}

export function destroyAlgorithmSDK() {
  algorithmSDK = null;
}

/**
 * @description: 初始化算法
 * @param {number} width 设备宽度
 * @param {number} height 设备高度
 * @return {*} 返回算法句柄
 */
export function initAlgorithm(width: number, height: number) {
  return algorithmSDK.BIOKEY_INIT_SIMPLE(0, width, height, 0);
}

/**
 * @description: 释放算法
 * @param {unknown} handle 算法句柄
 * @return {*} 1 表⽰成功,其余表⽰失败
 */
export function closeAlgorithm(handle: unknown): number {
  return algorithmSDK.BIOKEY_CLOSE(handle);
}

/**
 * @description: 生成注册的指纹模板
 * @param {unknown} handle 算法句柄
 * @param {unknown} templates 模板数组
 * @param {number} num 数组个数
 * @param {unknown} gTemplate 返回最好的模板(建议分配2048字节)
 * @return {*} >0 表⽰成功，值为最好模板的实际数据⻓度
 */
export function generateTemplate(handle, templates, num, gTemplate) {
  const result = algorithmSDK.BIOKEY_GENTEMPLATE(
    handle,
    templates,
    num,
    gTemplate
  );
  const success = result > 0;
  return {
    success,
    result,
  };
}

/**
 * @description: 对比两个模板
 * @param {*} handle 算法句柄
 * @param {*} template1 模板一
 * @param {*} template2 模板二
 * @return {boolean} 返回比对成功的结果
 */
export function verifyTemplate(handle, template1, template2): boolean {
  // 返回分数(0~1000), 推荐阈值50
  const result = algorithmSDK.BIOKEY_VERIFY(handle, template1, template2);

  const success = result >= VERIFY_SCORE_THRESHOLD;
  return success;
}

/**
 * @description: 指纹 1:N 比对
 * @param {unknown} handle 算法句柄
 * @param {unknown} templateDate 模版数据
 * @param {unknown} tid 返回识别成功的指纹ID
 * @param {unknown} score 返回识别成功的分数(推荐阈值70)
 * @return {number} 成功返回1
 */
export function identifyTemplate(
  handle: unknown,
  templateDate: unknown,
  tid: unknown,
  score: unknown
): number {
  return algorithmSDK.BIOKEY_IDENTIFYTEMP(handle, templateDate, tid, score);
}

/**
 * @description: 提取模版
 * @param {unknown} handle 算法句柄
 * @param {unknown} imageBuffer sensorCapture 提取的图像数据
 * @param {number} width 图像宽度
 * @param {number} height 图像高度
 * @param {unknown} template 返回指纹模版数据（建议 2048 字节）
 * @param {number} len
 * @return {number} > 0 表⽰提取成功，返回模板数据实际⻓度
 */
export function extractTemplate(
  handle: unknown,
  imageBuffer: unknown,
  width: number,
  height: number,
  template: unknown,
  len: number
): number {
  return algorithmSDK.BIOKEY_EXTRACT_GRAYSCALEDATA(
    handle,
    imageBuffer,
    width,
    height,
    template,
    len,
    0
  );
}

/**
 * @description: 添加模板到1:N内存中
 * @param {unknown} handle 算法句柄
 * @param {number} tid 指纹id
 * @param {number} templateLength 指纹模板数据长度
 * @param {unknown} templateData 指纹模板数据
 * @return {*} 返回添加结果和代码
 */
export function addTemplateToDb(
  handle: unknown,
  tid: number,
  templateLength: number,
  templateData: unknown
) {
  const result = algorithmSDK.BIOKEY_DB_ADD(
    handle,
    tid,
    templateLength,
    templateData
  );
  const success = result === 1;
  return { success, result };
}
