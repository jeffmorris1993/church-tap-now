// Mock content store. Structured to swap with FastAPI + Google Sheets later.
// Statuses follow the workflow: draft → pending → needs_changes → approved → published → archived

export type ContentStatus =
  | "draft"
  | "pending"
  | "needs_changes"
  | "approved"
  | "published"
  | "archived";

export interface PublishWindow {
  publishAt?: string; // ISO
  unpublishAt?: string; // ISO
}

export interface EventItem extends PublishWindow {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  signupUrl?: string;
  status: ContentStatus;
  reviewerNote?: string;
  category: "worship" | "kids" | "youth" | "outreach" | "fellowship";
}

export interface Announcement extends PublishWindow {
  id: string;
  title: string;
  body: string;
  status: ContentStatus;
  reviewerNote?: string;
  pinned?: boolean;
}

export interface ScheduleSlot {
  time: string;
  title: string;
  detail?: string;
}

export const todaySchedule: ScheduleSlot[] = [
  { time: "9:00 AM", title: "Prayer & Worship", detail: "Main Sanctuary" },
  { time: "9:30 AM", title: "Sunday School", detail: "All ages" },
  { time: "10:30 AM", title: "Morning Service", detail: "Pastor Williams" },
  { time: "12:00 PM", title: "Fellowship Lunch", detail: "Fellowship Hall" },
  { time: "6:00 PM", title: "Evening Devotion", detail: "Chapel" },
];

export const events: EventItem[] = [
  {
    id: "evt-1",
    title: "Community Outreach Day",
    description:
      "Join us as we serve meals and pray with our neighbors downtown. Lunch and t-shirts provided.",
    startsAt: "2026-05-09T09:00:00",
    endsAt: "2026-05-09T14:00:00",
    location: "Riverside Park",
    signupUrl: "#",
    status: "published",
    category: "outreach",
  },
  {
    id: "evt-2",
    title: "Youth Game Night",
    description: "Pizza, games, and a short devotion. Friends welcome!",
    startsAt: "2026-05-02T18:30:00",
    endsAt: "2026-05-02T21:00:00",
    location: "Youth Center",
    signupUrl: "#",
    status: "published",
    category: "youth",
  },
  {
    id: "evt-3",
    title: "Women's Brunch",
    description: "A morning of food, fellowship, and encouragement.",
    startsAt: "2026-05-16T10:00:00",
    location: "Fellowship Hall",
    signupUrl: "#",
    status: "published",
    category: "fellowship",
  },
  {
    id: "evt-4",
    title: "Vacation Bible School Planning",
    description: "Volunteer interest meeting for VBS 2026.",
    startsAt: "2026-05-22T19:00:00",
    location: "Room 204",
    status: "pending",
    category: "kids",
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome, first-time guests!",
    body: "Stop by the Welcome Desk in the lobby for a free gift and a warm hello.",
    status: "published",
    pinned: true,
  },
  {
    id: "ann-2",
    title: "New small groups launching",
    body: "Sign up for a spring small group at the kiosk or on the Events page.",
    status: "published",
  },
  {
    id: "ann-3",
    title: "Building updates",
    body: "Thank you for your patience as we refresh the Children's Wing.",
    status: "approved",
  },
];

export interface ServiceTime {
  day: string;
  time: string;
  title: string;
}

export const serviceTimes: ServiceTime[] = [
  { day: "Sunday Morning", time: "10:00 AM", title: "Main Worship Service" },
  { day: "Sunday Evening", time: "6:00 PM", title: "Evening Service" },
  { day: "Wednesday", time: "7:00 PM", title: "Bible Study" },
];

export const churchInfo = {
  name: "Nehemiah's Temple of the Apostolic Faith",
  shortName: "Nehemiah's Temple",
  tagline: "Come As You Are and Change As You Come",
  address: "27303 Palmer St, Madison Heights, MI 48071",
  phone: "(555) 123-4567",
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "Draft",
  pending: "Pending review",
  needs_changes: "Needs changes",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};
