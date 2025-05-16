export const generatePrompt = (cvText: string): string => {
  return `
Given the following raw text from a CV, extract and return a JSON object with the following fields:
- fullName
- email
- phone
- dateOfBirth (if available)
- address (if available)
- education: [{ school, degree, major, startDate, endDate }]
- workExperience: [{ company, position, startDate, endDate, description }]
- skills: [string]
- languages: [string]
- certifications: [string]
- summary (brief professional profile)

Here is the CV text:
"""
${cvText}
"""

Return only valid JSON without explanation.

`;
};

export const generatePromptForCV = (cvText: string): string => {
  return `
  Bạn là một trợ lý AI chuyên trích xuất thông tin từ CV ứng viên.

Dựa vào nội dung CV dưới đây, hãy trích xuất và trả về kết quả dưới dạng JSON với các trường:
- fullName
- email
- phone
- dateOfBirth (nếu có)
- address (nếu có)
- education: [{ school, degree, major, startDate, endDate }]
- workExperience: [{ company, position, startDate, endDate, description }]
- skills: [string]
- languages: [string]
- certifications: [string]
- summary (tóm tắt hồ sơ chuyên môn)

Nội dung CV:
"""
${cvText}
"""

Chỉ trả về kết quả JSON hợp lệ, không cần giải thích.

  `;
};
