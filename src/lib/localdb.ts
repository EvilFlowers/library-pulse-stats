const API_BASE = (import.meta.env as any).VITE_API_BASE || "";
function joinUrl(base: string, path: string) {
  if (!base) return path;
  if (base.endsWith("/") && path.startsWith("/")) return base.slice(0, -1) + path;
  if (!base.endsWith("/") && !path.startsWith("/")) return base + "/" + path;
  return base + path;
}
const API_SAVE = joinUrl(API_BASE, "/zyts/commonSave");
const API_GET = joinUrl(API_BASE, "/zyts/commonGet");
const DATA_KEY = "lps.data";
const EXPIRE_DAYS = 90;

const SESSION_TOKEN_KEY = "lps.sessionToken";
function getSessionToken(): string | null {
  try {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get("token");
      if (t) {
        try {
          window.sessionStorage?.setItem(SESSION_TOKEN_KEY, t);
        } catch {}
        return t;
      }
      try {
        return window.sessionStorage?.getItem(SESSION_TOKEN_KEY) || null;
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }
  return null;
}
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
  status: "审核中" | "已批准" | "已采购" | "已拒绝";
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

type AllData = {
  books: Book[];
  borrowRecords: BorrowRecord[];
  ratings: RatingRecord[];
  requests: PurchaseRequest[];
  inventoryTasks: InventoryTask[];
  missingBooks: MissingBook[];
  counters: Counters;
  remoteSettings: RemoteSettings;
  announcements: Announcement[];
  seeded?: boolean;
};

let DATA: AllData | null = null;

function defaultData(): AllData {
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

  const remoteSettings: RemoteSettings = {
    maintenanceMode: false,
    allowRemoteBorrow: true,
  };

  const announcements: Announcement[] = [];

  return {
    books,
    borrowRecords,
    ratings,
    requests,
    inventoryTasks,
    missingBooks,
    counters,
    remoteSettings,
    announcements,
    seeded: true,
  };
}

function xhrPost(url: string, body: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    const token = getSessionToken();
    if (token) xhr.setRequestHeader("session-id", token);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(String(xhr.status)));
      }
    };
    xhr.onerror = () => reject(new Error("network error"));
    xhr.send(JSON.stringify(body));
  });
}

function xhrGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    const token = getSessionToken();
    if (token) xhr.setRequestHeader("session-id", token);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText || "");
        else reject(new Error(String(xhr.status)));
      }
    };
    xhr.onerror = () => reject(new Error("network error"));
    xhr.send();
  });
}

function saveAll(): void {
  if (!DATA) return;
  const payload = {
    expireDays: EXPIRE_DAYS,
    key: DATA_KEY,
    value: JSON.stringify(DATA),
  };
  (async () => {
    try {
      await xhrPost(API_SAVE, payload);
    } catch (e) {
      void e;
    }
  })();
}

async function saveAllStrict(): Promise<boolean> {
  if (!DATA) return false;
  const payload = {
    expireDays: EXPIRE_DAYS,
    key: DATA_KEY,
    value: JSON.stringify(DATA),
  };
  try {
    await xhrPost(API_SAVE, payload);
    return true;
  } catch {
    return false;
  }
}

async function applyStrict(mutator: (d: AllData) => void): Promise<boolean> {
  const data = ensureData();
  const prevStr = JSON.stringify(data);
  mutator(data);
  const ok = await saveAllStrict();
  if (!ok) {
    try {
      DATA = JSON.parse(prevStr) as AllData;
    } catch {}
  }
  return ok;
}

async function loadAllFromRemote(): Promise<AllData | null> {
  try {
    const text = await xhrGet(`${API_GET}?key=${encodeURIComponent(DATA_KEY)}`);
    let valueStr: string | null = null;
    try {
      const json = JSON.parse(text);
      if (typeof json === "string") valueStr = json;
      else if (json && typeof (json as any).value === "string") valueStr = (json as any).value;
      else if (json && typeof (json as any).data === "string") valueStr = (json as any).data;
      else if ((json as any)?.data && typeof (json as any).data.value === "string") valueStr = (json as any).data.value;
    } catch {
      valueStr = text || null;
    }
    if (!valueStr) return null;
    try {
      const parsed = JSON.parse(valueStr) as AllData;
      return parsed;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function ensureData(): AllData {
  if (!DATA) DATA = defaultData();
  return DATA;
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

export async function bootstrapLocalData() {
  const remote = await loadAllFromRemote();
  if (remote) {
    DATA = remote;
    const counters = resetDailyCounters(DATA.counters);
    DATA.counters = counters;
    saveAll();
    return;
  }
  DATA = defaultData();
  saveAll();
}

export async function refreshDataFromRemote(): Promise<boolean> {
  try {
    const remote = await loadAllFromRemote();
    if (remote) {
      DATA = remote;
      const counters = resetDailyCounters(DATA.counters);
      DATA.counters = counters;
      saveAll();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getBooks(): Book[] {
  return ensureData().books;
}

export function searchBooks(q: string, category: string | "all"): Book[] {
  const counters = resetDailyCounters(ensureData().counters);
  counters.todaySearchCount += 1;
  counters.totalSearchCount += 1;
  ensureData().counters = counters;
  saveAll();
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
  ensureData().books = books;
  const records = ensureData().borrowRecords;
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
  ensureData().borrowRecords = records;
  const counters = resetDailyCounters(ensureData().counters);
  counters.todayBorrowCount += 1;
  ensureData().counters = counters;
  saveAll();
  return true;
}

export function getBorrowedBooks(): BorrowRecord[] {
  const records = ensureData().borrowRecords;
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
  ensureData().books = books;
  let records = ensureData().borrowRecords;
  records = records.filter(r => r.bookId !== bookId);
  ensureData().borrowRecords = records;
  const counters = resetDailyCounters(ensureData().counters);
  counters.todayReturnCount += 1;
  ensureData().counters = counters;
  saveAll();
  return true;
}

export function renewBook(bookId: number): boolean {
  const records = ensureData().borrowRecords;
  const record = records.find(r => r.bookId === bookId);
  if (!record) return false;
  if (record.renewalCount >= record.maxRenewal) return false;
  record.renewalCount += 1;
  record.dueDate = addDays(record.dueDate, 30);
  ensureData().borrowRecords = records;
  const counters = resetDailyCounters(ensureData().counters);
  counters.todayRenewalCount += 1;
  ensureData().counters = counters;
  saveAll();
  return true;
}

export function getRatings(): RatingRecord[] {
  return ensureData().ratings;
}

export function submitRating(bookId: number, rating: number, review?: string) {
  const ratings = getRatings();
  const id = ratings.length ? Math.max(...ratings.map(r => r.id)) + 1 : 1;
  ratings.push({ id, bookId, rating, review, date: today() });
  ensureData().ratings = ratings;
  saveAll();
}

export function getPurchaseRequests(): PurchaseRequest[] {
  return ensureData().requests;
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
  ensureData().requests = requests;
  saveAll();
}

export function approvePurchaseRequest(id: number): boolean {
  const requests = getPurchaseRequests();
  const req = requests.find(r => r.id === id);
  if (!req) return false;
  req.status = "已批准";
  ensureData().requests = requests;
  saveAll();
  return true;
}

export function rejectPurchaseRequest(id: number): boolean {
  const requests = getPurchaseRequests();
  const req = requests.find(r => r.id === id);
  if (!req) return false;
  req.status = "已拒绝";
  ensureData().requests = requests;
  saveAll();
  return true;
}

export function getInventoryTasks(): InventoryTask[] {
  return ensureData().inventoryTasks;
}

export function getMissingBooks(): MissingBook[] {
  return ensureData().missingBooks;
}

function areaFromLocation(location: string): string | null {
  const idx = location.indexOf("区-");
  if (idx < 0) return null;
  const zone = location.slice(0, idx + 1);
  const rest = location.slice(idx + 2);
  const digits = rest.replace(/\D/g, "");
  if (!digits) return null;
  const floor = digits[0];
  if (!floor) return null;
  return `${zone}-${floor}楼`;
}

export async function startNextInventoryTask(): Promise<boolean> {
  const data = ensureData();
  const next = data.inventoryTasks.find(t => t.status === "待开始");
  if (!next) return false;
  const ok = await applyStrict(d => {
    const n = d.inventoryTasks.find(t => t.id === next.id);
    if (!n) return;
    n.status = "进行中";
    generateMissingForTask(n.id);
    syncMissingCounts();
  });
  return ok;
}

export async function resolveMissingBook(id: number): Promise<boolean> {
  const items = ensureData().missingBooks;
  const idx = items.findIndex(b => b.id === id);
  if (idx < 0) return false;
  const book = items[idx];
  const ok = await applyStrict(d => {
    const arr = d.missingBooks;
    const i = arr.findIndex(b => b.id === id);
    if (i < 0) return;
    const b = arr[i];
    arr.splice(i, 1);
    const area = areaFromLocation(b.location);
    if (area) {
      const task = d.inventoryTasks.find(t => t.area === area);
      if (task && task.missing > 0) {
        task.missing -= 1;
      }
    }
    syncMissingCounts();
  });
  return ok;
}

function areaFromZoneFloor(zone: string, floor: number): string {
  const z = zone.trim().toUpperCase();
  const f = Math.max(0, Math.floor(Number(floor)));
  return `${z}区-${f}楼`;
}

export async function createInventoryTask(zone: string, floor: number, total: number): Promise<number | null> {
  const tasks = ensureData().inventoryTasks;
  const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const area = areaFromZoneFloor(zone, floor);
  const ok = await applyStrict(d => {
    const arr = d.inventoryTasks;
    arr.push({
      id,
      area,
      total: Math.max(0, Math.floor(Number(total))),
      completed: 0,
      missing: 0,
      status: "待开始",
    });
  });
  if (!ok) return null;
  return id;
}

function parseArea(area: string): { zone: string; floor: number } | null {
  const m = area.match(/^([A-Z])区-(\d+)楼$/i);
  if (!m) return null;
  const zone = m[1].toUpperCase();
  const floor = Number(m[2]);
  if (!floor || floor < 0) return null;
  return { zone, floor };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildLocation(zone: string, floor: number): string {
  const shelf = String(randInt(1, 50)).padStart(2, "0");
  return `${zone}区-${floor}${shelf}`;
}

function nextMissingId(): number {
  const items = ensureData().missingBooks;
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

function generateMissingForTask(taskId: number): number {
  const tasks = ensureData().inventoryTasks;
  const t = tasks.find(x => x.id === taskId);
  if (!t) return 0;
  const pf = parseArea(t.area);
  if (!pf) return 0;
  const { zone, floor } = pf;
  const items = ensureData().missingBooks;
  const books = ensureData().books.filter(b => areaFromLocation(b.location) === t.area);
  const count = randInt(1, 2);
  let added = 0;
  for (let i = 0; i < count; i++) {
    const candidate = books.length ? books[randInt(0, books.length - 1)] : null;
    const location = candidate ? candidate.location : buildLocation(zone, floor);
    if (items.some(it => it.location === location)) continue;
    const title = candidate ? candidate.title : `馆藏-${zone}${floor}-${String(randInt(100, 999))}`;
    const id = nextMissingId();
    const lastSeen = addDays(today(), -randInt(10, 30));
    items.push({ id, title, location, lastSeen });
    added += 1;
  }
  ensureData().missingBooks = items;
  return added;
}

function syncMissingCounts() {
  const tasks = ensureData().inventoryTasks;
  const items = ensureData().missingBooks;
  const counts: Record<string, number> = {};
  for (const it of items) {
    const area = areaFromLocation(it.location);
    if (!area) continue;
    counts[area] = (counts[area] || 0) + 1;
  }
  for (const t of tasks) {
    t.missing = counts[t.area] || 0;
  }
  ensureData().inventoryTasks = tasks;
}

export function getCounters(): Counters {
  const counters = resetDailyCounters(ensureData().counters);
  ensureData().counters = counters;
  saveAll();
  return counters;
}

export function getRemoteSettings(): RemoteSettings {
  return ensureData().remoteSettings;
}

export function updateRemoteSettings(patch: Partial<RemoteSettings>) {
  const current = getRemoteSettings();
  const next = { ...current, ...patch };
  ensureData().remoteSettings = next;
  saveAll();
  return next;
}

export function getAnnouncements(): Announcement[] {
  return ensureData().announcements;
}

export function addAnnouncement(title: string, content: string) {
  const items = getAnnouncements();
  const id = items.length ? Math.max(...items.map(a => a.id)) + 1 : 1;
  const date = today();
  items.unshift({ id, title, content, date });
  ensureData().announcements = items;
  saveAll();
  return id;
}

export function exportAllData() {
  return {
    books: ensureData().books,
    borrowRecords: ensureData().borrowRecords,
    ratings: ensureData().ratings,
    requests: ensureData().requests,
    inventoryTasks: ensureData().inventoryTasks,
    missingBooks: ensureData().missingBooks,
    counters: ensureData().counters,
    remoteSettings: ensureData().remoteSettings,
    announcements: ensureData().announcements,
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
  const data = ensureData();
  if (payload.books) data.books = payload.books;
  if (payload.borrowRecords) data.borrowRecords = payload.borrowRecords;
  if (payload.ratings) data.ratings = payload.ratings;
  if (payload.requests) data.requests = payload.requests;
  if (payload.inventoryTasks) data.inventoryTasks = payload.inventoryTasks;
  if (payload.missingBooks) data.missingBooks = payload.missingBooks;
  if (payload.counters) data.counters = payload.counters;
  if (payload.remoteSettings) data.remoteSettings = payload.remoteSettings;
  if (payload.announcements) data.announcements = payload.announcements;
  data.seeded = true;
  saveAll();
}

export function clearAllData() {
  DATA = defaultData();
  saveAll();
}
