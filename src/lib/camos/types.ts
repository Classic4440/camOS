export type ThemeName = "light" | "dark";
export type Density = "regular" | "compact";
export type HomeBlock = "sequence" | "attention" | "houses" | "week" | "books";
export type House = "personal" | "music" | "brand" | "lab" | "finance" | "learning";
export type Currency = "UGX" | "USD";
export type Priority = "now" | "next" | "later";
export type ReleaseStage = "writing" | "production" | "mix" | "master" | "distribution" | "released";
export type ReleaseKind = "single" | "ep" | "album";
export type OrderStage = "quote" | "approved" | "production" | "qc" | "ready" | "delivered";
export type Certainty = "actual" | "projected";
export type ProjectStatus = "recorded" | "active" | "paused" | "shipped";
export type IdeaStatus = "raw" | "testing" | "committed" | "shelved";
export type CampaignStatus = "planned" | "live" | "done";
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
export type Composer =
  | "task"
  | "decision"
  | "release"
  | "order"
  | "quote"
  | "txn"
  | "trade"
  | "note"
  | "idea"
  | "campaign"
  | "bug";

export interface Settings {
  theme: ThemeName;
  density: Density;
  called: string;
  legalName: string;
  professional: string;
  artist: string;
  label: string;
  website: string;
  genres: string[];
  daw: string;
  shop: string;
  shopLocation: string;
  services: string[];
  focus: string;
  homeOrder: HomeBlock[];
  hiddenHome: HomeBlock[];
  aiDay: string;
  aiUsed: number;
  aiLimit: number;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  house: House;
  priority: Priority;
  due: string | null;
  done: boolean;
}

export interface Decision {
  id: string;
  question: string;
  context: string;
  status: "open" | "made" | "deferred";
  choice: string;
  house: House;
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  writers: string;
  status: "draft" | "recorded" | "mixed";
}

export interface Release {
  id: string;
  catalog: string;
  title: string;
  kind: ReleaseKind;
  stage: ReleaseStage;
  date: string | null;
  genres: string[];
  distribution: string;
  lyrics: string;
  notes: string;
  tracks: Track[];
  /** RouteNote-style gates. Missing means not done, including on older desk files. */
  artwork?: boolean;
  metadataReady?: boolean;
  masters?: boolean;
}

export interface SessionLog {
  id: string;
  date: string;
  hours: number;
  focus: string;
  releaseId: string | null;
}

export interface Royalty {
  id: string;
  period: string;
  source: string;
  amount: number;
  currency: Currency;
  certainty: Certainty;
  /** Set once the row has been copied into the finance ledger. */
  ledgerId?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  opening: number;
  note: string;
  sample?: boolean;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  garment: string;
  spec: string;
  qty: number;
  due: string | null;
  stage: OrderStage;
  price: number;
  paid: number;
  qc: string;
  notes: string;
  sample?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  kind: "equipment" | "supply";
  onHand: number;
  reorderAt: number;
  note: string;
}

export interface Quote {
  id: string;
  customerId: string;
  summary: string;
  spec: string;
  amount: number;
  status: QuoteStatus;
  sample?: boolean;
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  stack: string;
  status: ProjectStatus;
  href: string;
  notes: string;
}

export interface Bug {
  id: string;
  projectId: string;
  title: string;
  severity: "low" | "med" | "high";
  open: boolean;
}

export interface TechDecision {
  id: string;
  projectId: string;
  title: string;
  choice: string;
  date: string;
}

export interface Deploy {
  id: string;
  projectId: string;
  env: "preview" | "production";
  at: string;
  note: string;
}

export interface Txn {
  id: string;
  date: string;
  house: House;
  kind: "in" | "out";
  category: string;
  amount: number;
  currency: Currency;
  note: string;
  certainty: Certainty;
}

export interface Trade {
  id: string;
  date: string;
  instrument: string;
  side: "long" | "short";
  entry: number;
  exit: number | null;
  size: number;
  thesis: string;
  lesson: string;
}

export interface LearningPath {
  id: string;
  title: string;
  domain: string;
  progress: number;
  note: string;
}

export interface Exercise {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  picked: number | null;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  updated: string;
}

export interface Idea {
  id: string;
  title: string;
  thesis: string;
  risks: string;
  next: string;
  score: number;
  status: IdeaStatus;
}

export interface Campaign {
  id: string;
  house: "music" | "brand";
  name: string;
  channel: string;
  start: string;
  end: string;
  status: CampaignStatus;
  note: string;
}

export interface Memo {
  id: string;
  role: "user" | "assistant";
  text: string;
  at: string;
}

export interface OtpEntry {
  id: string;
  issuer: string;
  account: string;
  cipher: string;
  iv: string;
  created: string;
}

/** Ciphertext only. The passphrase never goes in the desk. */
export interface OtpVault {
  version: 1;
  salt: string;
  check: string;
  checkIv: string;
  entries: OtpEntry[];
}

export interface DeskData {
  settings: Settings;
  tasks: Task[];
  decisions: Decision[];
  releases: Release[];
  sessions: SessionLog[];
  royalties: Royalty[];
  customers: Customer[];
  orders: Order[];
  inventory: InventoryItem[];
  quotes: Quote[];
  projects: Project[];
  bugs: Bug[];
  techDecisions: TechDecision[];
  deploys: Deploy[];
  txns: Txn[];
  trades: Trade[];
  paths: LearningPath[];
  exercises: Exercise[];
  notes: Note[];
  ideas: Idea[];
  campaigns: Campaign[];
  memos: Memo[];
  otpVault: OtpVault | null;
}

export const HOME_LABEL: Record<HomeBlock, string> = {
  sequence: "Sequence",
  attention: "Attention",
  houses: "Houses",
  week: "Week",
  books: "Books",
};

export const HOUSE_LABEL: Record<House, string> = {
  personal: "Personal",
  music: "Cam Leinad",
  brand: "Classic Brand",
  lab: "Lab",
  finance: "Finance",
  learning: "Learning",
};

export const RELEASE_STAGE_LABEL: Record<ReleaseStage, string> = {
  writing: "Writing",
  production: "Production",
  mix: "Mix",
  master: "Master",
  distribution: "Distribution",
  released: "Released",
};

export const ORDER_STAGE_LABEL: Record<OrderStage, string> = {
  quote: "Quote",
  approved: "Approved",
  production: "Production",
  qc: "Quality",
  ready: "Ready",
  delivered: "Delivered",
};

export const RELEASE_STAGES = Object.keys(RELEASE_STAGE_LABEL) as ReleaseStage[];
export const ORDER_STAGES = Object.keys(ORDER_STAGE_LABEL) as OrderStage[];
