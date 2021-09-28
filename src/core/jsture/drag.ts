import { Jsture, JstureType } from './jsture';

export function makeJsture({ elementId, type }: { type: JstureType; elementId: string }): Jsture {
  return { type, elementId };
}
