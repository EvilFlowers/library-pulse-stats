const KEY_PREFIX = "lps.";

type BookStatus = "可借" | "已借出";
export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  status: BookStatus;
  rating?: number;
  location: string;
  isbn?: string;
  addedDate?: string;
}

export interface BorrowRecord {
  id: number;
  bookId: number;
  title: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  renewalCount: number;
  maxRenewal: number;
  status: "借阅中" | "即将到期";
}

export interface RatingRecord {
  id: number;
  bookId: number;
  rating: number;
  review?: string;
  date: string;
}

export interface PurchaseRequest {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  reason: string;
  submittedDate: string;
  status: "审核中" | "已批准" | "已采购";
}

export interface InventoryTask {
  id: number;
  area: string;
  total: number;
  completed: number;
  missing: number;
  status: "已完成" | "进行中" | "待开始";
}

export interface MissingBook {
  id: number;
  title: string;
  location: string;
  lastSeen: string;
}

export interface Counters {
  todaySearchCount: number;
  totalSearchCount: number;
  todayBorrowCount: number;
  todayReturnCount: number;
  todayRenewalCount: number;
  lastCounterDate: string;
}

export interface RemoteSettings {
  maintenanceMode: boolean;
  allowRemoteBorrow: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

function get<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(KEY_PREFIX + key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T) {
  localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
}

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function resetDailyCounters(counters: Counters): Counters {
  const t = today();
  if (counters.lastCounterDate !== t) {
    return {
      todaySearchCount: 0,
      totalSearchCount: counters.totalSearchCount,
      todayBorrowCount: 0,
      todayReturnCount: 0,
      todayRenewalCount: 0,
      lastCounterDate: t,
    };
  }
  return counters;
}

export function bootstrapLocalData() {
  const seeded = get<boolean>("seeded", false);
  if (seeded) {
    const counters = resetDailyCounters(get<Counters>("counters", {
      todaySearchCount: 0,
      totalSearchCount: 0,
      todayBorrowCount: 0,
      todayReturnCount: 0,
      todayRenewalCount: 0,
      lastCounterDate: today(),
    }));
    set("counters", counters);
    return;
  }

  const books: Book[] = [
    { id: 1, title: "深度学习", author: "Ian Goodfellow", category: "计算机科学", status: "可借", rating: 4.8, location: "A区-301", isbn: "9787121293880" },
    { id: 2, title: "人工智能简史", author: "尼克", category: "科技", status: "已借出", rating: 4.5, location: "A区-205" },
    { id: 3, title: "算法导论", author: "Thomas H. Cormen", category: "计算机科学", status: "可借", rating: 4.9, location: "A区-310" },
    { id: 4, title: "机器学习实战", author: "Peter Harrington", category: "计算机科学", status: "可借", rating: 4.6, location: "A区-308" },
    { id: 5, title: "Python编程", author: "Eric Matthes", category: "计算机科学", status: "已借出", rating: 4.3, location: "B区-102" },
  ];

  const borrowRecords: BorrowRecord[] = [
    { id: 1, bookId: 2, title: "人工智能简史", author: "尼克", borrowDate: today(), dueDate: addDays(today(), 30), renewalCount: 0, maxRenewal: 3, status: "借阅中" },
    { id: 2, bookId: 5, title: "Python编程", author: "Eric Matthes", borrowDate: addDays(today(), -10), dueDate: addDays(today(), 20), renewalCount: 1, maxRenewal: 3, status: "借阅中" },
    { id: 3, bookId: 1, title: "深度学习", author: "Ian Goodfellow", borrowDate: addDays(today(), -25), dueDate: addDays(today(), 5), renewalCount: 0, maxRenewal: 3, status: "即将到期" },
  ];

  const ratings: RatingRecord[] = [
    { id: 1, bookId: 3, rating: 5, review: "内容全面", date: today() },
  ];

  const requests: PurchaseRequest[] = [
    { id: 1, title: "机器学习实战（第二版）", submittedDate: today(), status: "审核中", reason: "版本更新" },
    { id: 2, title: "深入理解计算机系统", submittedDate: addDays(today(), -5), status: "已批准", reason: "课程教材" },
    { id: 3, title: "设计模式", submittedDate: addDays(today(), -10), status: "已采购", reason: "经典书籍" },
  ];

  const inventoryTasks: InventoryTask[] = [
    { id: 1, area: "A区-3楼", total: 1500, completed: 1500, missing: 0, status: "已完成" },
    { id: 2, area: "A区-2楼", total: 1800, completed: 1650, missing: 3, status: "进行中" },
    { id: 3, area: "B区-1楼", total: 2000, completed: 0, missing: 0, status: "待开始" },
  ];

  const missingBooks: MissingBook[] = [
    { id: 1, title: "深度学习", location: "A区-301", lastSeen: addDays(today(), -20) },
    { id: 2, title: "算法导论", location: "A区-205", lastSeen: addDays(today(), -22) },
    { id: 3, title: "机器学习实战", location: "A区-308", lastSeen: addDays(today(), -18) },
  ];

  const counters: Counters = {
    todaySearchCount: 0,
    totalSearchCount: 0,
    todayBorrowCount: 0,
    todayReturnCount: 0,
    todayRenewalCount: 0,
    lastCounterDate: today(),
  };

  set("books", books);
  set("borrowRecords", borrowRecords);
  set("ratings", ratings);
  set("requests", requests);
  set("inventoryTasks", inventoryTasks);
  set("missingBooks", missingBooks);
  set("counters", counters);
  set("seeded", true);
}

export function getBooks(): Book[] {
  return get<Book[]>("books", []);
}

export function searchBooks(q: string, category: string | "all"): Book[] {
  const counters = resetDailyCounters(get<Counters>("counters", {
    todaySearchCount: 0,
    totalSearchCount: 0,
    todayBorrowCount: 0,
    todayReturnCount: 0,
    todayRenewalCount: 0,
    lastCounterDate: today(),
  }));
  counters.todaySearchCount += 1;
  counters.totalSearchCount += 1;
  set("counters", counters);
  const books = getBooks();
  const term = q.trim().toLowerCase();
  return books.filter(b => {
    const matchTerm = !term || [b.title, b.author, b.isbn || "", b.category].some(s => s.toLowerCase().includes(term));
    const matchCat = category === "all" || b.category === category;
    return matchTerm && matchCat;
  });
}

export function borrowBook(bookId: number): boolean {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book || book.status !== "可借") return false;
  book.status = "已借出";
  set("books", books);
  const records = get<BorrowRecord[]>("borrowRecords", []);
  const record: BorrowRecord = {
    id: records.length ? Math.max(...records.map(r => r.id)) + 1 : 1,
    bookId: book.id,
    title: book.title,
    author: book.author,
    borrowDate: today(),
    dueDate: addDays(today(), 30),
    renewalCount: 0,
    maxRenewal: 3,
    status: "借阅中",
  };
  records.push(record);
  set("borrowRecords", records);
  const counters = resetDailyCounters(get<Counters>("counters", {
    todaySearchCount: 0,
    totalSearchCount: 0,
    todayBorrowCount: 0,
    todayReturnCount: 0,
    todayRenewalCount: 0,
    lastCounterDate: today(),
  }));
  counters.todayBorrowCount += 1;
  set("counters", counters);
  return true;
}

export function getBorrowedBooks(): BorrowRecord[] {
  const records = get<BorrowRecord[]>("borrowRecords", []);
  return records.map(r => {
    const daysUntilDue = Math.ceil((new Date(r.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const status = daysUntilDue <= 7 ? "即将到期" : "借阅中";
    return { ...r, status };
  });
}

export function returnBook(bookId: number): boolean {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book) return false;
  book.status = "可借";
  set("books", books);
  let records = get<BorrowRecord[]>("borrowRecords", []);
  records = records.filter(r => r.bookId !== bookId);
  set("borrowRecords", records);
  const counters = resetDailyCounters(get<Counters>("counters", {
    todaySearchCount: 0,
    totalSearchCount: 0,
    todayBorrowCount: 0,
    todayReturnCount: 0,
    todayRenewalCount: 0,
    lastCounterDate: today(),
  }));
  counters.todayReturnCount += 1;
  set("counters", counters);
  return true;
}

export function renewBook(bookId: number): boolean {
  const records = get<BorrowRecord[]>("borrowRecords", []);
  const record = records.find(r => r.bookId === bookId);
  if (!record) return false;
  if (record.renewalCount >= record.maxRenewal) return false;
  record.renewalCount += 1;
  record.dueDate = addDays(record.dueDate, 30);
  set("borrowRecords", records);
  const counters = resetDailyCounters(get<Counters>("counters", {
    todaySearchCount: 0,
    totalSearchCount: 0,
    todayBorrowCount: 0,
    todayReturnCount: 0,
    todayRenewalCount: 0,
    lastCounterDate: today(),
  }));
  counters.todayRenewalCount += 1;
  set("counters", counters);
  return true;
}

export function getRatings(): RatingRecord[] {
  return get<RatingRecord[]>("ratings", []);
}

export function submitRating(bookId: number, rating: number, review?: string) {
  const ratings = getRatings();
  const id = ratings.length ? Math.max(...ratings.map(r => r.id)) + 1 : 1;
  ratings.push({ id, bookId, rating, review, date: today() });
  set("ratings", ratings);
}

export function getPurchaseRequests(): PurchaseRequest[] {
  return get<PurchaseRequest[]>("requests", []);
}

export function submitPurchaseRequest(data: { bookTitle: string; author?: string; isbn?: string; reason: string; }) {
  const requests = getPurchaseRequests();
  const id = requests.length ? Math.max(...requests.map(r => r.id)) + 1 : 1;
  const item: PurchaseRequest = {
    id,
    title: data.bookTitle,
    author: data.author,
    isbn: data.isbn,
    reason: data.reason,
    submittedDate: today(),
    status: "审核中",
  };
  requests.unshift(item);
  set("requests", requests);
}

export function getInventoryTasks(): InventoryTask[] {
  return get<InventoryTask[]>("inventoryTasks", []);
}

export function getMissingBooks(): MissingBook[] {
  return get<MissingBook[]>("missingBooks", []);
}

export function getCounters(): Counters {
  return resetDailyCounters(get<Counters>("counters", {
    todaySearchCount: 0,
    totalSearchCount: 0,
    todayBorrowCount: 0,
    todayReturnCount: 0,
    todayRenewalCount: 0,
    lastCounterDate: today(),
  }));
}

export function getRemoteSettings(): RemoteSettings {
  return get<RemoteSettings>("remoteSettings", {
    maintenanceMode: false,
    allowRemoteBorrow: true,
  });
}

export function updateRemoteSettings(patch: Partial<RemoteSettings>) {
  const current = getRemoteSettings();
  const next = { ...current, ...patch };
  set("remoteSettings", next);
  return next;
}

export function getAnnouncements(): Announcement[] {
  return get<Announcement[]>("announcements", []);
}

export function addAnnouncement(title: string, content: string) {
  const items = getAnnouncements();
  const id = items.length ? Math.max(...items.map(a => a.id)) + 1 : 1;
  const date = today();
  items.unshift({ id, title, content, date });
  set("announcements", items);
  return id;
}

export function exportAllData() {
  return {
    books: getBooks(),
    borrowRecords: get<BorrowRecord[]>("borrowRecords", []),
    ratings: getRatings(),
    requests: getPurchaseRequests(),
    inventoryTasks: getInventoryTasks(),
    missingBooks: getMissingBooks(),
    counters: getCounters(),
    remoteSettings: getRemoteSettings(),
    announcements: getAnnouncements(),
  };
}

export function importAllData(payload: {
  books?: Book[];
  borrowRecords?: BorrowRecord[];
  ratings?: RatingRecord[];
  requests?: PurchaseRequest[];
  inventoryTasks?: InventoryTask[];
  missingBooks?: MissingBook[];
  counters?: Counters;
  remoteSettings?: RemoteSettings;
  announcements?: Announcement[];
}) {
  if (payload.books) set("books", payload.books);
  if (payload.borrowRecords) set("borrowRecords", payload.borrowRecords);
  if (payload.ratings) set("ratings", payload.ratings);
  if (payload.requests) set("requests", payload.requests);
  if (payload.inventoryTasks) set("inventoryTasks", payload.inventoryTasks);
  if (payload.missingBooks) set("missingBooks", payload.missingBooks);
  if (payload.counters) set("counters", payload.counters);
  if (payload.remoteSettings) set("remoteSettings", payload.remoteSettings);
  if (payload.announcements) set("announcements", payload.announcements);
  set("seeded", true);
}

export function clearAllData() {
  const keys = [
    "books",
    "borrowRecords",
    "ratings",
    "requests",
    "inventoryTasks",
    "missingBooks",
    "counters",
    "remoteSettings",
    "announcements",
    "seeded",
  ];
  keys.forEach(k => localStorage.removeItem(KEY_PREFIX + k));
}
