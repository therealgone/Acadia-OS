export function getPredictKey({
  courseCode,
  courseType,
  slot,
}: {
  courseCode: string;
  courseType?: string;
  slot?: string;
}) {
  const type = courseType?.toLowerCase() || "";
  
  // If it's explicitly a lab or practical
  if (type.includes("lab") || type.includes("practical")) {
    return `${courseCode}Practical`;
  }
  
  // If it's theory with a practical slot (P1, P2, etc.)
  if (type.includes("theory") && slot && slot.startsWith("P")) {
    return `${courseCode}Practical`;
  }
  
  // Pure theory classes
  if (type.includes("theory")) {
    return `${courseCode}Theory`;
  }

  // Fallback - use course code as is
  return courseCode;
}
