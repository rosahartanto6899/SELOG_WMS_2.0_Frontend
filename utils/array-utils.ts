export function onlyUnique(
  value: string | number | undefined,
  index: number,
  array: (string | number | undefined)[],
) {
  return array.indexOf(value) === index;
}

export function areUpcomingItemsExisted(
  upcomingArr: string[],
  existingArr: string[],
): boolean {
  return upcomingArr.some((item) => existingArr.includes(item));
}

export function allUpcomingItemsExisted(
  upcoming: string[],
  existed: string[],
): boolean {
  return upcoming.every((item) => existed.includes(item));
}

export function removeExistingItems(
  upcomingItems: string[],
  existingArray: string[],
): string[] {
  return existingArray.filter((item) => !upcomingItems.includes(item));
}
