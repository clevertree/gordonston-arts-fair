export function snakeCaseToTitleCase(snakeCaseString: string): string {
  if (!snakeCaseString) {
    return '';
  }

  return snakeCaseString
    .split('_') // Split by underscore
    .filter((word) => word.length > 0) // Remove empty strings if multiple underscores
  // Capitalize the first letter and lowercase the rest
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' '); // Join with spaces
}
