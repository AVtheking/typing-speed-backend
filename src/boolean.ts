import { Transform, TransformFnParams } from 'class-transformer';

export function ToBoolean(): (target: any, key: string) => void {
  return Transform((params: TransformFnParams) => {
    const { value } = params;
    if (typeof value === 'boolean') {
      return value;
    }
    if (value?.toString()?.toLowerCase() === 'false') {
      return false;
    }
    if (value?.toString()?.toLowerCase() === 'true') {
      return true;
    }
    return undefined;
  });
}

export function cleanData<T>(data: T): T {
  const cleanedData: Partial<T> = {};
  for (const key in data) {
    if (data[key] === '') {
      cleanedData[key] = undefined;
    } else {
      cleanedData[key] = data[key];
    }
  }
  return cleanedData as T;
}
