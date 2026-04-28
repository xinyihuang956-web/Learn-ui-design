# University of Edinburgh LEARN Redesign 设计规范文档

> 适用范围：Dashboard、My Courses、Course Detail、Schedule、Assignment Submission 五个页面。  
> 使用目标：把这份文档连同 UI 截图一起交给 Claude Code，用于 React / Tailwind / shadcn 前端搭建。

---

## 1. 项目定位

本项目是对 University of Edinburgh LEARN 平台的界面重设计。整体目标是将 LEARN 从传统的课程资料存放平台，升级为一个更清晰、更主动、更符合学生学习决策习惯的学习任务管理系统。

平台核心页面包括：

1. **Dashboard**：学习状态与任务决策首页。
2. **My Courses**：课程卡片入口页。
3. **Course Detail**：单门课程详情页。
4. **Schedule**：课程、DDL、个人事项、会议、任务的整合日程页。
5. **Assignment Submission**：线性作业提交页。

整体设计应保持大学平台的正式、可信、学术气质，同时具备现代 Web App 的卡片化布局、清晰层级、柔和阴影和一致组件规范。

---

## 2. 设计关键词

界面整体应符合以下关键词：

- Academic
- Clean
- Structured
- Calm
- Trustworthy
- Minimal
- Task-oriented
- Premium university platform

不要做成过度活泼的教育 App，也不要做成商业 SaaS 的营销感。视觉应像一个正式大学学习管理平台，但比传统 LMS 更清爽、更现代。

---

## 3. 全局页面结构

### 3.1 桌面端优先

推荐基准画布：

```txt
Viewport: 1440px × 1024px 或 1440px × 1080px
App container: 100vw × 100vh
```

### 3.2 三栏系统

所有页面采用统一 App Shell：

```txt
App Shell
├── Left Sidebar: 230px
├── Main Content: flexible
└── Optional Right Sidebar: 280px - 320px
```

Dashboard、My Courses、Schedule、Course Detail、Assignment Submission 都必须共用同一套 Sidebar、Header、Card、Button、Tag 组件。

### 3.3 页面层级

```txt
Main Area
├── Top Header / Search Bar
├── Page Title Area
└── Page Content
```

注意：

- **Dashboard 可以保留大 Hero Banner。**
- **My Courses、Course Detail、Schedule、Assignment Submission 不要大 banner，只保留清晰页面标题。**

---

## 4. 颜色规范

### 4.1 主色

```css
--navy-900: #072452;
--navy-800: #0B2F66;
--navy-700: #123E7A;
--blue-600: #2563EB;
--blue-500: #3B82F6;
```

使用规则：

- Sidebar active item、Primary button、Week toggle active 使用 `#072452`。
- 文字链接、进度条、部分 active underline 使用 `#2563EB`。
- Dashboard Hero Banner 使用 `#072452` 到 `#0B2F66` 的深蓝渐变。

### 4.2 背景与卡片

```css
--page-bg: #F7F9FC;
--surface: #FFFFFF;
--surface-soft: #F9FBFF;
--surface-muted: #F1F5F9;
```

页面背景不要使用纯白，建议使用极浅冷灰。所有功能区使用白色卡片承载。

### 4.3 文字

```css
--text-primary: #0A254F;
--text-secondary: #48607A;
--text-muted: #7B8DA5;
--text-disabled: #B4C0D0;
```

使用规则：

- 页面标题：`text-primary`
- 卡片标题：`text-primary`
- 正文内容：`text-secondary`
- 时间、说明、辅助信息：`text-muted`

### 4.4 边框与分割线

```css
--border-light: #E6ECF3;
--border-medium: #D7E0EA;
--divider: #EEF2F7;
```

所有边框保持轻，不要使用深灰或纯黑。

### 4.5 状态色

```css
--status-blue-bg: #EAF2FF;
--status-blue-text: #2563EB;

--status-green-bg: #EAF8F0;
--status-green-text: #1F9D55;

--status-orange-bg: #FFF3E6;
--status-orange-text: #F97316;

--status-red-bg: #FFECEC;
--status-red-text: #EF4444;

--status-purple-bg: #F3E8FF;
--status-purple-text: #7C3AED;
```

语义规则：

```txt
Blue   = Class / Active / New
Green  = Completed / Personal / Available / Pass
Orange = Task / In progress / Meeting / Warning
Red    = Deadline / Not submitted / Urgent
Purple = Seminar / Workshop / Assignment category
```

---

## 5. 字体规范

### 5.1 字体建议

```css
font-family: Inter, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
```

Dashboard Hero 的 greeting 可以使用 serif 风格增强大学感：

```css
font-family: Georgia, "Times New Roman", serif;
```

其余页面标题建议统一使用 sans-serif，保证前端一致性。

### 5.2 字体层级

```css
/* Page Title */
font-size: 36px;
line-height: 44px;
font-weight: 700;
letter-spacing: -0.02em;
color: #0A254F;

/* Dashboard Hero Title */
font-size: 36px - 40px;
line-height: 48px;
font-weight: 600;

/* Section / Card Title */
font-size: 18px;
line-height: 26px;
font-weight: 700;

/* Subsection Title */
font-size: 15px;
line-height: 22px;
font-weight: 600;

/* Body */
font-size: 14px;
line-height: 22px;
font-weight: 400;

/* Metadata / Caption */
font-size: 12px;
line-height: 18px;
font-weight: 400;

/* Tag / Pill */
font-size: 12px;
line-height: 16px;
font-weight: 600;
```

所有页面标题大小必须统一，不要某些页面标题过大、某些过小。

---

## 6. 间距规范

使用 8px spacing system。

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

页面级间距：

```txt
Sidebar width: 230px
Main content padding: 28px - 32px
Card gap: 16px - 24px
Card internal padding: 20px - 24px
Right sidebar card gap: 16px
```

标题区：

```txt
Page title top margin: 32px
Page title bottom margin: 20px - 24px
Title to controls gap: 20px
```

---

## 7. 圆角与阴影

### 7.1 圆角

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-pill: 999px;
```

使用规则：

```txt
Pills / tags: 999px
Inputs / buttons: 10px - 12px
Cards: 16px
Large dashboard banner: 18px - 20px
Sidebar active item: 12px
```

### 7.2 阴影

所有阴影必须非常轻。

```css
--shadow-card: 0 8px 24px rgba(15, 23, 42, 0.04);
--shadow-soft: 0 4px 16px rgba(15, 23, 42, 0.03);
```

标准卡片：

```css
background: #FFFFFF;
border: 1px solid #E6ECF3;
border-radius: 16px;
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
```

---

## 8. 全局组件规范

## 8.1 Left Sidebar

所有页面左侧导航必须完全一致。

```css
width: 230px;
height: 100vh;
background: #FFFFFF;
border-right: 1px solid #E6ECF3;
padding: 28px 20px;
```

Logo 区域：

```txt
Logo height: 44px - 52px
Logo margin-bottom: 36px
```

导航项：

```css
height: 48px;
padding: 0 16px;
border-radius: 12px;
display: flex;
align-items: center;
gap: 12px;
font-size: 15px;
font-weight: 500;
color: #0A254F;
```

Active 状态：

```css
background: #072452;
color: #FFFFFF;
box-shadow: 0 8px 20px rgba(7, 36, 82, 0.12);
```

导航项：

```txt
Dashboard
Courses
Schedule
Marks
Settings
Sign out
```

Icon 规范：

```txt
Icon size: 20px - 22px
Stroke width: 1.75px
Style: lucide-react outline icons
```

---

## 8.2 Top Header

除 Dashboard 的视觉重点在 banner 外，其他页面都应有统一 top header。

```txt
Height: 72px - 80px
Content padding left/right: 28px - 32px
```

内容：

```txt
Left: Search bar
Right: Bell icon + Avatar + User name + Dropdown chevron
```

Search Bar：

```css
width: 360px - 420px;
height: 44px;
border: 1px solid #E6ECF3;
border-radius: 12px;
background: #FFFFFF;
padding: 0 16px;
font-size: 14px;
color: #48607A;
```

Placeholder：

```txt
Search LEARN
```

User Area：

```txt
Bell icon: 20px
Avatar: 36px circle, navy background, white initials
User name: 14px / 500
Dropdown chevron: 16px
```

Example：

```txt
AB  Ava Brown
```

---

## 8.3 Card

标准卡片：

```css
background: #FFFFFF;
border: 1px solid #E6ECF3;
border-radius: 16px;
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
padding: 20px 24px;
```

Card Header：

```txt
Title: 18px / 700 / #0A254F
Right action link: 13px / 600 / #2563EB
Icon size: 20px
```

分割线：

```css
border-top: 1px solid #EEF2F7;
```

---

## 8.4 Buttons

Primary Button：

```css
height: 44px;
padding: 0 20px;
border-radius: 10px;
background: #072452;
color: #FFFFFF;
font-size: 14px;
font-weight: 600;
```

Secondary Button：

```css
height: 44px;
padding: 0 20px;
border-radius: 10px;
background: #FFFFFF;
border: 1px solid #D7E0EA;
color: #0A254F;
font-size: 14px;
font-weight: 600;
```

Ghost Link：

```css
color: #2563EB;
font-size: 13px;
font-weight: 600;
```

---

## 8.5 Status Pills

```css
height: 24px;
padding: 4px 10px;
border-radius: 999px;
font-size: 12px;
font-weight: 600;
```

状态示例：

```txt
Not started       Red
Not submitted     Red
In progress       Orange
Completed         Green
New               Blue
Available         Green
Coming soon       Orange
Deadline          Red
Class             Blue
Personal          Green
Task              Orange
Seminar           Purple
```

---

## 9. Dashboard Page 设计规范

### 9.1 页面定位

Dashboard 是进入平台后的学习任务决策首页，用于快速回答：

```txt
今天有什么课？
本周有什么 DDL？
哪些课程有新消息？
我需要优先做什么？
```

### 9.2 Layout

```txt
Left Sidebar
Main Content
├── Dashboard Hero Banner
├── Left Column
│   ├── Urgent Deadlines
│   ├── Course Updates
│   └── My Courses
└── Right Sidebar
    ├── Mini Calendar
    ├── Daily Agenda
    └── Upcoming
```

### 9.3 Hero Banner

Dashboard 可以保留大 banner。

```css
height: 180px;
border-radius: 18px;
background: linear-gradient(135deg, #072452 0%, #0B2F66 100%);
padding: 36px 44px;
color: #FFFFFF;
```

文案：

```txt
Good morning, Xinyi 👋
You have 2 deadlines this week, 1 new announcement, and 3 tasks today.
```

右侧可使用 Edinburgh 建筑线稿，低透明度，不要抢内容。

### 9.4 Urgent Deadlines

Row 结构：

```txt
Icon block
Assignment title
Course code + course name
Due date
Time
Remaining time
Status pill
```

示例：

```txt
Lab Report 2: Enzyme Kinetics
BIOL08019 – Molecular Biology
Due tomorrow, 14 May
11:59 PM
18h 45m left
Not started
```

### 9.5 Course Updates

使用 list / timeline 形式：

```txt
Unread dot + icon block + update content + time
```

未读消息使用蓝色 dot。

### 9.6 My Courses Mini Card

Dashboard 中 My Courses 是横向课程入口，不是完整课程库。

每张卡：

```txt
Thumbnail
Course title
Course code
Progress bar
Percentage
```

### 9.7 Right Sidebar

右侧包含：

```txt
Mini Calendar
14 May Agenda
Upcoming
```

Daily Agenda 是统一列表，不拆分 Classes / Tasks / Personal。每行包含：

```txt
Checkbox / radio circle
Time
Title
Subtitle
Category pill
```

底部按钮：

```txt
+ Add new to-do
```

按钮为 dashed border。

---

## 10. My Courses Page 设计规范

### 10.1 页面定位

My Courses 是课程入口页。用户先浏览课程卡片，点击 `Open course` 后进入 Course Detail。

页面不要 banner，只保留标题。

### 10.2 Layout

```txt
Page Title: My Courses
Search + Filter Row
Course Count
Course Card Grid
Right Sidebar:
  Today
  Course updates
  Recently opened
```

### 10.3 Course Card Grid

```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 24px;
```

每张课程卡结构：

```txt
Thumbnail image
Favourite star
Course title
Course code
Lecturer + School
Short description
Next class / deadline
Progress label + progress bar
Open course button
More menu button
```

Image：

```css
height: 140px;
border-radius: 16px 16px 0 0;
object-fit: cover;
```

`Open course` 使用 navy primary button。

### 10.4 Right Sidebar

与 Dashboard 的卡片规范一致。

Today Card：

```txt
Today
View schedule
10:00 Molecular Biology Lecture
11:00 Sociology Seminar
14:00 Marketing Lecture
Go to full schedule
```

Course Updates：

```txt
Course updates
3 unread
Molecular Biology - Lecture slides uploaded
Design Informatics - New forum post
Data Science - Assignment feedback released
```

Recently Opened：

```txt
Thumbnail + Course + Time
```

---

## 11. Course Detail Page 设计规范

### 11.1 页面定位

Course Detail 是单门课程详情页，从 My Courses 的课程卡片进入。

页面不要 banner，只保留：

```txt
Back to My Courses
Molecular Biology
Course metadata row
Tabs
```

### 11.2 Header

```txt
← Back to My Courses
Molecular Biology
Dr. Sarah Collins | School of Biological Sciences | BIOL08019 | Semester 2, 2024/25
```

### 11.3 Tabs

```txt
Overview
Weekly Materials
Assignments
Announcements
Reading List
Feedback
```

Active tab：

```css
color: #2563EB;
border-bottom: 2px solid #2563EB;
```

### 11.4 Main Layout

```txt
Left Main Column: 2fr
Right Sidebar: 320px
Gap: 24px
```

### 11.5 Weekly Materials Card

每个 week row：

```txt
Week 8: Cell Signalling
12 – 18 May
Lecture Slides    New
Seminar Materials New
Recording         Available
Reading           New
```

Week row 样式：

```css
border: 1px solid #E6ECF3;
border-radius: 14px;
padding: 16px;
margin-bottom: 12px;
```

### 11.6 Assignments Card

Row 结构：

```txt
Icon
Assignment title
Assignment type
Due date
Weighting
Status
View assignment button
```

### 11.7 Latest Announcements

Announcement row：

```txt
Unread dot
Avatar
Title
Author + posted date
Preview text
New pill
Chevron
```

---

## 12. Schedule Page 设计规范

### 12.1 页面定位

Schedule 是课程、DDL、个人事项、会议和任务的整合时间管理中心。

重要：不要再单独做 task list、today focus、reminder 等模块。所有事项直接呈现在 timetable 上。

### 12.2 Layout

```txt
Top Header:
  Search LEARN
  Notification
  Avatar

Page Title:
  Schedule

Controls:
  Prev / Today / Next
  Date Range
  Add item
  Day / Week / Month toggle

Main:
  Weekly Timetable

Right Sidebar:
  Mini Calendar
  Selected Day Agenda
  Filter / Legend
```

### 12.3 Timetable

```txt
Columns: Mon - Sun
Rows: 8 AM - 8 PM
Timezone: GMT+1
```

Grid：

```css
border-color: #E6ECF3;
line-color: #EEF2F7;
row-height: 72px;
```

选中日期：

```css
background: #072452;
color: #FFFFFF;
border-radius: 999px;
width: 28px;
height: 28px;
```

### 12.4 Event Blocks

Class：

```css
background: #EAF2FF;
border: 1px solid #93C5FD;
color: #2563EB;
```

Deadline：

```css
background: #FFECEC;
border: 1px solid #FDA4AF;
color: #EF4444;
```

Personal：

```css
background: #EAF8F0;
border: 1px solid #86EFAC;
color: #1F9D55;
```

Meeting / Task：

```css
background: #FFF3E6;
border: 1px solid #FDBA74;
color: #F97316;
```

Seminar / Workshop：

```css
background: #F3E8FF;
border: 1px solid #C4B5FD;
color: #7C3AED;
```

Event card：

```css
border-radius: 10px;
padding: 8px 10px;
font-size: 12px;
line-height: 16px;
```

### 12.5 Right Sidebar

小日历下面必须显示当日安排：

```txt
15 May Agenda
Today

09:00 – 10:00
Molecular Biology Lecture
David Hume 2.12
Class

14:00
Lab Report Deadline
LEARN Assignment
Deadline
```

Agenda row：

```css
display: grid;
grid-template-columns: 80px 1fr auto;
gap: 12px;
padding: 12px 0;
border-bottom: 1px solid #EEF2F7;
```

Filter / Legend：

```txt
All
Classes
Deadlines
Personal
Meetings
Seminars / Workshops
```

---

## 13. Assignment Submission Page 设计规范

### 13.1 页面定位

作业提交页必须体现线性流程。用户当前在某一步时，只看到该步骤内容，不能同时展示上一阶段详细内容。

### 13.2 Layout

```txt
Top Header
Page Title: Assignment Submission
Breadcrumb
Assignment Info Card
3-Step Linear Stepper
Current Step Content
Right Sidebar:
  Assignment Summary
  Progress
```

### 13.3 Linear Stepper

只保留三个步骤：

```txt
1. Submission requirements
2. Upload + Preview
3. Submit
```

当前示例页面为 Step 2：

```txt
Step 1: Completed
Step 2: In progress
Step 3: Pending
```

Stepper card：

```css
background: #FFFFFF;
border: 1px solid #E6ECF3;
border-radius: 16px;
height: 72px;
```

### 13.4 线性流程原则

当用户处于 Step 2 时：

```txt
只展示 Upload + Preview 内容
不展示 Step 1 的提交要求详细内容
只能通过 “Back to requirements” 返回上一页查看
```

### 13.5 Assignment Info Card

```txt
Lab Report 2: Enzyme Kinetics
Molecular Biology
Description
Due date: Sun, 1 Jun, 17:00
Weighting: 15%
Status: Not submitted
```

### 13.6 Upload + Preview Card

当前步骤内容：

```txt
2. Upload + Preview
Drag and drop your file here or browse
Uploaded file row
Document preview
File check
Back to requirements
Continue to submit
```

Upload Zone：

```css
height: 92px;
border: 1.5px dashed #93C5FD;
border-radius: 14px;
background: #F8FBFF;
display: flex;
align-items: center;
justify-content: center;
```

File Row：

```txt
PDF icon
LAB2_S1234567_AvaBrown.pdf
PDF · 1.8 MB · Uploaded today, 10:24
Replace
Remove
```

File Check：

```txt
File format        PDF is accepted         Pass
File size          1.8 MB of 20 MB max      Pass
Naming convention  LAB2_S1234567...         Pass
```

Bottom Navigation：

```txt
Back to requirements
Continue to submit
```

### 13.7 Right Sidebar

Assignment Summary：

```txt
Due date
Module code
Submission type
File requirement
Lecturer
```

Progress：

```txt
1. Submission requirements Completed
2. Upload + Preview In progress
3. Submit Pending
```

不要在右侧重复完整 requirements 内容。

---

## 14. Interaction States

Hover：

```txt
Cards: shadow slightly increases
Buttons: navy slightly lighter
Course card: translateY(-2px)
Links: underline or darker blue
```

Focus：

```css
outline: 2px solid rgba(37, 99, 235, 0.25);
```

Active：

```txt
Sidebar active, filter active, tab active, week toggle active use navy or blue.
```

---

## 15. Tailwind Token 建议

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      navy: {
        900: '#072452',
        800: '#0B2F66',
        700: '#123E7A',
      },
      surface: {
        DEFAULT: '#FFFFFF',
        soft: '#F9FBFF',
        muted: '#F1F5F9',
      },
      border: {
        light: '#E6ECF3',
        medium: '#D7E0EA',
      },
      text: {
        primary: '#0A254F',
        secondary: '#48607A',
        muted: '#7B8DA5',
      },
      status: {
        blueBg: '#EAF2FF',
        blueText: '#2563EB',
        greenBg: '#EAF8F0',
        greenText: '#1F9D55',
        orangeBg: '#FFF3E6',
        orangeText: '#F97316',
        redBg: '#FFECEC',
        redText: '#EF4444',
        purpleBg: '#F3E8FF',
        purpleText: '#7C3AED',
      }
    },
    borderRadius: {
      card: '16px',
      control: '12px',
      pill: '999px',
    },
    boxShadow: {
      card: '0 8px 24px rgba(15, 23, 42, 0.04)',
      soft: '0 4px 16px rgba(15, 23, 42, 0.03)',
    }
  }
}
```

---

## 16. 给 Claude Code 的执行说明

将本规范文档和五张 UI 参考图一起放入项目文件夹，例如：

```txt
learn-redesign/
├── DESIGN_SPEC.md
├── references/
│   ├── dashboard.png
│   ├── course-page.png
│   ├── course-detail.png
│   ├── schedule-page.png
│   └── assignment-submission.png
└── src/
```

然后在 Claude Code 中输入：

```txt
Please read DESIGN_SPEC.md and all images in the references folder. Build a React + Tailwind front-end prototype for the redesigned University of Edinburgh LEARN platform.

Pages to implement:
1. Dashboard
2. My Courses
3. Course Detail
4. Schedule
5. Assignment Submission

Use a shared AppShell component with a consistent left sidebar, top header, card system, typography, color palette, spacing, radius, shadows, and button styles.

Important requirements:
- The Dashboard may keep the large navy welcome banner.
- My Courses, Course Detail, Schedule, and Assignment Submission should not use large hero banners; they should only use clean page titles.
- The Course page should first show a grid of course cards. Clicking “Open course” should navigate to the Course Detail page.
- The Schedule page should place all classes, deadlines, personal to-dos, meetings, and tasks directly onto the weekly timetable. Do not create separate task-list, focus, or reminder cards.
- The Schedule right sidebar should include a mini month calendar, selected day agenda, and filter/legend.
- The Assignment Submission page must use a linear 3-step flow: Submission requirements → Upload + Preview → Submit.
- When the user is on Step 2, only the Upload + Preview content should be visible. Do not show the detailed Step 1 requirements content on the same page. Provide a “Back to requirements” button instead.

Use lucide-react icons. Use realistic mock data matching the references. Keep all UI text in English. Focus on visual consistency and pixel-level alignment with the references.
```

---

## 17. Claude Code 搭建建议

建议让 Claude 先做组件系统，再做页面，不要一上来直接堆页面。

推荐顺序：

```txt
1. Create design tokens in Tailwind config.
2. Build shared AppShell.
3. Build reusable components:
   - Sidebar
   - TopHeader
   - Card
   - Button
   - StatusPill
   - CourseCard
   - CalendarMini
   - AgendaList
   - Stepper
4. Build Dashboard.
5. Build My Courses.
6. Build Course Detail.
7. Build Schedule.
8. Build Assignment Submission.
9. Review spacing, typography, and component consistency across all pages.
```
