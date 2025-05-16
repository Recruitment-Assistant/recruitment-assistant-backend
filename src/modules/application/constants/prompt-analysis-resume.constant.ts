export const PROMPT_ANALYSIS_RESUME = (
  jdtext: string = JD_TEXT,
  resumeText: string,
) => `
Analyze the following resume based on the provided Job Description (JD) and score the candidate’s fit.

JOB DESCRIPTION:
${jdtext}

RESUME TEXT:
${resumeText}

Return your analysis as a valid JSON object in the following format:

{{
    "selected": true or false,
    "score_resume_match": number (0 - 100),
    "feedback": "Explain clearly why the candidate was selected or not.",
    "matching_skills": ["skill1", "skill2"],
    "missing_skills": ["skill3", "skill4"],
    "experience_level": "junior" | "mid" | "senior",
    "ai_summary": {{
        "full_name": "Candidate Name",
        "total_experience_years": number,
        "education": "Highest degree and major (e.g., Bachelor in Computer Science)",
        "recent_job_title": "Most recent job title",
        "recent_company": "Most recent company",
        "notable_projects": ["project 1", "project 2"],
        "core_skills": ["skill1", "skill2", ...]
    }}
}}

EVALUATION CRITERIA:
1. Match at least 70% of required skills.
2. Evaluate both theoretical knowledge and practical experience.
3. Value project-based experience and real-world applications.
4. Consider transferable skills from related technologies.
5. Identify signs of continuous learning and adaptability.
6. Score candidate from 0 to 100 based on overall fit with the JD.

Important:
- Output ONLY the JSON object.
- Do NOT include any additional text, explanation, or formatting.

`;

export const PROMPT_ANALYSIS_RESUME_WITH_FORMULA = `
Please analyze the following resume against the given job requirements.

JOB DESCRIPTION:
{jd_text}

RESUME TEXT:
{resume_text}

Your response must be a valid JSON object in the following format:

{{
    "selected": true or false,
    "score_resume_match": number (0 - 100),
    "feedback": "Explain clearly why the candidate was selected or not.",
    "matching_skills": ["skill1", "skill2", ...],
    "missing_skills": ["skill3", "skill4", ...],
    "experience_level": "junior" | "mid" | "senior",
    "ai_summary": {{
        "full_name": "Candidate Name",
        "total_experience_years": number,
        "education": "Highest degree and major (e.g., Bachelor in Computer Science)",
        "recent_job_title": "Most recent job title",
        "recent_company": "Most recent company",
        "notable_projects": ["project 1", "project 2"],
        "core_skills": ["skill1", "skill2", ...]
    }}
}}

SCORING GUIDELINES:
The total score (score_resume_match) must be calculated using this formula:

1. skill_score (60%):
   - Calculate: len(matching_skills) / total_required_skills * 100

2. experience_score (20%):
   - ≥ 5 years (senior): 100
   - 2–5 years (mid): 70
   - < 2 years (junior): 30

3. project_score (10%):
   - ≥ 3 notable projects: 100
   - 1–2 projects: 60
   - none: 20

4. learning_score (10%):
   - Mention of self-learning, upskilling, certifications, or adaptability: 100
   - Otherwise: 50

Total score = skill_score * 0.6 + experience_score * 0.2 + project_score * 0.1 + learning_score * 0.1

IMPORTANT:
- Output ONLY the JSON object
- Do NOT include any markdown formatting, text explanation, or backticks

`;

export const JD_TEXT = `

Mô tả công việc:

Thiết kế, phát triển và triển khai các API và dịch vụ backend mạnh mẽ và có khả năng mở rộng bằng Node.js và PHP.
Tham gia vào quá trình phân tích yêu cầu, thiết kế kỹ thuật và đưa ra các giải pháp backend tối ưu.
Xây dựng và quản lý cơ sở dữ liệu Postgresql và Mongodb, đảm bảo hiệu suất và tính toàn vẹn dữ liệu.
Triển khai và quản lý các ứng dụng trên môi trường Cloud, đặc biệt là AWS.
Xây dựng và duy trì quy trình CI/CD để đảm bảo việc triển khai phần mềm diễn ra liên tục và hiệu quả.
Sử dụng Docker để đóng gói và triển khai ứng dụng một cách nhất quán trên các môi trường khác nhau.
Phối hợp chặt chẽ với các Frontend Developer (sử dụng Vue.js) và các thành viên khác trong nhóm để đảm bảo sự tích hợp mượt mà giữa frontend và backend.
Viết unit test và integration test để đảm bảo chất lượng code.
Theo dõi hiệu suất ứng dụng, xác định và giải quyết các vấn đề phát sinh.
Nghiên cứu và áp dụng các công nghệ và phương pháp phát triển mới để nâng cao hiệu quả công việc.


Yêu cầu:

Tối thiểu 1 năm kinh nghiệm làm việc ở vị trí Backend Developer.
Thành thạo ngôn ngữ lập trình Node.js và có kinh nghiệm xây dựng các ứng dụng backend quy mô lớn.
Có kinh nghiệm vững chắc với ngôn ngữ lập trình PHP và các framework phổ biến (ví dụ: Laravel, Symfony).
Có kinh nghiệm làm việc sâu sắc với cơ sở dữ liệu quan hệ Postgresql.
Có kinh nghiệm làm việc với cơ sở dữ liệu NoSQL Mongodb.
Hiểu biết sâu sắc về các dịch vụ Cloud, đặc biệt là AWS (ví dụ: EC2, S3, RDS, ECS, Lambda, API Gateway).
Có kinh nghiệm xây dựng và triển khai quy trình CI/CD (ví dụ: Jenkins, GitLab CI/CD, CircleCI).
Có kinh nghiệm làm việc với Docker và Containerization.
Có kiến thức cơ bản về Vue.js và hiểu cách backend API tương tác với frontend.
Có khả năng làm việc độc lập và làm việc nhóm tốt.
Có khả năng giải quyết vấn đề và tư duy logic tốt.
Khả năng học hỏi nhanh các công nghệ mới.
Có kỹ năng giao tiếp tốt.
`;
