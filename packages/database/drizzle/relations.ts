import { relations } from "drizzle-orm/relations";
import { qrtz_triggers, qrtz_blob_triggers, qrtz_cron_triggers, qrtz_simple_triggers, qrtz_simprop_triggers, qrtz_job_details } from "./schema";

export const qrtz_blob_triggersRelations = relations(qrtz_blob_triggers, ({one}) => ({
	qrtz_trigger: one(qrtz_triggers, {
		fields: [qrtz_blob_triggers.sched_name],
		references: [qrtz_triggers.sched_name]
	}),
}));

export const qrtz_triggersRelations = relations(qrtz_triggers, ({one, many}) => ({
	qrtz_blob_triggers: many(qrtz_blob_triggers),
	qrtz_cron_triggers: many(qrtz_cron_triggers),
	qrtz_simple_triggers: many(qrtz_simple_triggers),
	qrtz_simprop_triggers: many(qrtz_simprop_triggers),
	qrtz_job_detail: one(qrtz_job_details, {
		fields: [qrtz_triggers.sched_name],
		references: [qrtz_job_details.sched_name]
	}),
}));

export const qrtz_cron_triggersRelations = relations(qrtz_cron_triggers, ({one}) => ({
	qrtz_trigger: one(qrtz_triggers, {
		fields: [qrtz_cron_triggers.sched_name],
		references: [qrtz_triggers.sched_name]
	}),
}));

export const qrtz_simple_triggersRelations = relations(qrtz_simple_triggers, ({one}) => ({
	qrtz_trigger: one(qrtz_triggers, {
		fields: [qrtz_simple_triggers.sched_name],
		references: [qrtz_triggers.sched_name]
	}),
}));

export const qrtz_simprop_triggersRelations = relations(qrtz_simprop_triggers, ({one}) => ({
	qrtz_trigger: one(qrtz_triggers, {
		fields: [qrtz_simprop_triggers.sched_name],
		references: [qrtz_triggers.sched_name]
	}),
}));

export const qrtz_job_detailsRelations = relations(qrtz_job_details, ({many}) => ({
	qrtz_triggers: many(qrtz_triggers),
}));