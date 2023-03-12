import { theme } from "styles";
import { colors } from "./constants";
/**
 * debounce를 가져오도록 도와주는 함수
 * @param callback 지연시킨뒤 실행할 함수
 * @param delay 지연시킬 시간 (초)
 */
export const debounceFunction = (callback: any, delay: any) => {
  let timer: any;
  return (...args: any) => {
    // 실행한 함수(setTimeout())를 취소
    clearTimeout(timer);
    // delay가 지나면 callback 함수를 실행
    timer = setTimeout(() => callback(...args), delay);
  };
};

/**
 * 배열의 자리를 바꿔주는 함수
 *
 * @param array 자리 바꿀 배열
 * @param i 자리를 바꿔야할 배열의 자리
 * @param j 자리를 이동해줄 배열의 자리
 */
export function swap<T>(array: T[], i: number, j: number): T[] {
  const snapShot = [...array];
  const temp = snapShot[i];
  snapShot[i] = snapShot[j];
  snapShot[j] = temp;
  return snapShot;
}
/**
 * 칸반의 색상을 랜덤으로 설정해주는 함수
 * @param variant theme에 지정한 색상에 맞게 랜덤으로 색상을 반환한다.
 *
 */
export function pickRandomColor(variant = "") {
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (color + variant) as keyof typeof theme.colors;
}
