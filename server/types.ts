import { subscribers, newsletters } from '@shared/schema';

// Define types based on table inference
export type Subscriber = typeof subscribers.$inferSelect;
export type Newsletter = typeof newsletters.$inferSelect;