import { evaluate } from 'mathjs';

/**
 * 수식을 안전하게 계산하는 함수
 * mathjs.evaluate()를 사용하여 eval() 없이 안전하게 계산
 *
 * @param expression 계산할 수식 문자열
 * @returns 계산 결과 문자열 또는 에러 메시지
 *
 * @example
 * calculateExpression('2 + 3') // '5'
 * calculateExpression('sqrt(16)') // '4'
 * calculateExpression('2 + +') // 'Error: ...'
 */
export function calculateExpression(expression: string): string {
  try {
    // 빈 문자열 또는 공백만 있는 경우
    if (!expression || expression.trim() === '') {
      return 'Error: Empty expression';
    }

    // mathjs로 안전하게 계산 (eval 사용 안 함)
    const result = evaluate(expression);

    // 결과를 문자열로 변환
    return String(result);
  } catch (error) {
    // 에러 메시지 반환
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return 'Error: Unknown error occurred';
  }
}
