import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, bigint, varchar, unique, int, datetime, index, tinyint, foreignKey, decimal, smallint, char } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const doc_carrier_type = mysqlTable("doc_carrier_type", {
	carrier_type_id: bigint("carrier_type_id", { mode: "number" }).autoincrement().notNull(),
	type_name: varchar("type_name", { length: 255 }),
},
(table) => {
	return {
		doc_carrier_type_carrier_type_id: primaryKey({ columns: [table.carrier_type_id], name: "doc_carrier_type_carrier_type_id"}),
	}
});

export const doc_directory = mysqlTable("doc_directory", {
	directory_id: bigint("directory_id", { mode: "number" }).autoincrement().notNull(),
	parent_id: bigint("parent_id", { mode: "number" }).notNull(),
	display_name: varchar("display_name", { length: 100 }),
	doc_name: varchar("doc_name", { length: 200 }),
	doc_e_directory: varchar("doc_e_directory", { length: 300 }).notNull(),
	sort: int("sort"),
	status: int("status").notNull(),
	update_time: datetime("update_time", { mode: 'string'}),
	create_time: datetime("create_time", { mode: 'string'}).notNull(),
},
(table) => {
	return {
		doc_directory_directory_id: primaryKey({ columns: [table.directory_id], name: "doc_directory_directory_id"}),
		index_doc_e_directory: unique("index_doc_e_directory").on(table.doc_e_directory),
		index_id: unique("index_id").on(table.directory_id),
	}
});

export const doc_document = mysqlTable("doc_document", {
	doc_id: bigint("doc_id", { mode: "number" }).autoincrement().notNull(),
	doc_name: varchar("doc_name", { length: 200 }).notNull(),
	doc_secret_level: int("doc_secret_level"),
	doc_type: tinyint("doc_type"),
	doc_rfid: varchar("doc_rfid", { length: 128 }),
	IS_one: varchar("IS_one", { length: 255 }),
	create_time: datetime("create_time", { mode: 'string'}).notNull(),
	end_time: datetime("end_time", { mode: 'string'}),
	remark: varchar("remark", { length: 100 }),
	doc_p_status: int("doc_p_status").default(1),
	user_id: bigint("user_id", { mode: "number" }),
	cabinet_id: int("cabinet_id").default(0),
	cabinet_door_id: int("cabinet_door_id").default(0),
	update_time: datetime("update_time", { mode: 'string'}),
	doc_last_time: datetime("doc_last_time", { mode: 'string'}),
	remove_status: tinyint("remove_status").default(0),
	code: varchar("code", { length: 255 }),
	urgency: tinyint("urgency"),
	send_dep: tinyint("send_dep"),
	send_code: varchar("send_code", { length: 255 }),
	bureau_depId: bigint("bureau_depId", { mode: "number" }),
	bindingType: bigint("bindingType", { mode: "number" }),
	bind_user_id: int("bind_user_id"),
	binding_dept_id: int("binding_dept_id"),
	binding_id: bigint("binding_id", { mode: "number" }),
},
(table) => {
	return {
		doc_name: index("doc_name").on(table.doc_name),
		rfid: index("rfid").on(table.doc_rfid),
		doc_document_doc_id: primaryKey({ columns: [table.doc_id], name: "doc_document_doc_id"}),
	}
});

export const doc_operation_log = mysqlTable("doc_operation_log", {
	operationlog_id: varchar("operationlog_id", { length: 32 }).notNull(),
	doc_id: bigint("doc_id", { mode: "number" }),
	doc_name: varchar("doc_name", { length: 255 }),
	operation_type: int("operation_type"),
	operation_name: varchar("operation_name", { length: 100 }),
	user_id: bigint("user_id", { mode: "number" }).notNull(),
	user_name: varchar("user_name", { length: 100 }).notNull(),
	dept_id: bigint("dept_id", { mode: "number" }).notNull(),
	dept_name: varchar("dept_name", { length: 100 }).notNull(),
	update_time: datetime("update_time", { mode: 'string'}),
	create_time: datetime("create_time", { mode: 'string'}).notNull(),
},
(table) => {
	return {
		doc_operation_log_operationlog_id: primaryKey({ columns: [table.operationlog_id], name: "doc_operation_log_operationlog_id"}),
	}
});

export const doc_secret_level_role = mysqlTable("doc_secret_level_role", {
	slr_id: bigint("slr_id", { mode: "number" }).autoincrement().notNull(),
	role_id: bigint("role_id", { mode: "number" }).notNull(),
	role_name: varchar("role_name", { length: 30 }),
	slr_name: varchar("slr_name", { length: 100 }),
	slr_code: bigint("slr_code", { mode: "number" }),
	update_time: datetime("update_time", { mode: 'string'}),
	create_time: datetime("create_time", { mode: 'string'}).notNull(),
},
(table) => {
	return {
		doc_secret_level_role_slr_id: primaryKey({ columns: [table.slr_id], name: "doc_secret_level_role_slr_id"}),
	}
});

export const door_access_records = mysqlTable("door_access_records", {
	AccessID: int("AccessID").autoincrement().notNull(),
	AccessDirection: int("AccessDirection"),
	directionCreateTime: datetime("directionCreateTime", { mode: 'string'}),
	EquipmentID: int("EquipmentID"),
	EquipmentName: varchar("EquipmentName", { length: 100 }),
	remark: varchar("remark", { length: 100 }),
},
(table) => {
	return {
		door_access_records_AccessID: primaryKey({ columns: [table.AccessID], name: "door_access_records_AccessID"}),
	}
});

export const door_alarmrecord = mysqlTable("door_alarmrecord", {
	Alarmid: int("Alarmid").autoincrement().notNull(),
	EquipmentId: varchar("EquipmentId", { length: 100 }),
	EquipmentName: varchar("EquipmentName", { length: 100 }),
	Carrier_Id: varchar("Carrier_Id", { length: 100 }),
	Carrier_rfid: varchar("Carrier_rfid", { length: 100 }),
	Carrier_Name: varchar("Carrier_Name", { length: 100 }),
	Carrier_Deptid: varchar("Carrier_Deptid", { length: 100 }),
	Carrier_DeptName: varchar("Carrier_DeptName", { length: 100 }),
	Carrier_type: varchar("Carrier_type", { length: 255 }),
	isOperation: varchar("isOperation", { length: 10 }),
	remark: varchar("remark", { length: 100 }),
	CreateTime: datetime("CreateTime", { mode: 'string'}),
},
(table) => {
	return {
		door_alarmrecord_Alarmid: primaryKey({ columns: [table.Alarmid], name: "door_alarmrecord_Alarmid"}),
	}
});

export const door_equipment = mysqlTable("door_equipment", {
	equipmentid: int("equipmentid").autoincrement().notNull(),
	equipment_name: varchar("equipment_name", { length: 100 }),
	addressip: varchar("addressip", { length: 100 }),
	type: int("type"),
	fid: int("fid"),
	status: varchar("status", { length: 100 }),
	equipment_addr: varchar("equipment_addr", { length: 100 }),
	equipment_Port: varchar("equipment_Port", { length: 100 }),
	equipment_txid: varchar("equipment_txid", { length: 100 }),
	remark: varchar("remark", { length: 100 }),
	macAddress: varchar("macAddress", { length: 100 }),
	macIp: varchar("macIp", { length: 100 }),
	Alarm_switch: int("Alarm_switch"),
	CreatorTime: datetime("CreatorTime", { mode: 'string'}),
	equipment_In: int("equipment_In"),
	equipment_InIP: varchar("equipment_InIP", { length: 100 }),
	equipment_Out: int("equipment_Out"),
	equipment_OutIp: varchar("equipment_OutIp", { length: 100 }),
	equipment_Type: int("equipment_Type"),
	deviceUserName: varchar("deviceUserName", { length: 100 }),
	deviceUserPwd: varchar("deviceUserPwd", { length: 100 }),
	devicePort: varchar("devicePort", { length: 100 }),
},
(table) => {
	return {
		door_equipment_equipmentid: primaryKey({ columns: [table.equipmentid], name: "door_equipment_equipmentid"}),
	}
});

export const door_read_record = mysqlTable("door_read_record", {
	ReadID: int("ReadID").autoincrement().notNull(),
	ReadCreateTine: datetime("ReadCreateTine", { mode: 'string'}),
	ReadRfid: varchar("ReadRfid", { length: 100 }),
	EquipmentID: int("EquipmentID"),
	EquipmentName: varchar("EquipmentName", { length: 100 }),
	remark: varchar("remark", { length: 100 }),
},
(table) => {
	return {
		door_read_record_ReadID: primaryKey({ columns: [table.ReadID], name: "door_read_record_ReadID"}),
	}
});

export const door_rfidrecord = mysqlTable("door_rfidrecord", {
	Record_id: int("Record_id").autoincrement().notNull(),
	EquipmentId: varchar("EquipmentId", { length: 100 }),
	EquipmentName: varchar("EquipmentName", { length: 100 }),
	Carrier_Id: varchar("Carrier_Id", { length: 100 }),
	Carrier_Name: varchar("Carrier_Name", { length: 100 }),
	Carrier_rfid: varchar("Carrier_rfid", { length: 100 }),
	Carrier_Deptid: varchar("Carrier_Deptid", { length: 100 }),
	Carrier_DeptName: varchar("Carrier_DeptName", { length: 100 }),
	Carrier_type: varchar("Carrier_type", { length: 255 }),
	equipment_Type: varchar("equipment_Type", { length: 100 }),
	type: varchar("type", { length: 100 }),
	is_alarm: varchar("is_alarm", { length: 100 }),
	alarmid: varchar("alarmid", { length: 100 }),
	CreatorTime: datetime("CreatorTime", { mode: 'string'}),
	is_Register: varchar("is_Register", { length: 255 }),
},
(table) => {
	return {
		door_rfidrecord_Record_id: primaryKey({ columns: [table.Record_id], name: "door_rfidrecord_Record_id"}),
	}
});

export const door_rfidregister = mysqlTable("door_rfidregister", {
	register_id: int("register_id").autoincrement().notNull(),
	Carrier_ID: varchar("Carrier_ID", { length: 100 }),
	Carrier_Deptid_ID: varchar("Carrier_Deptid_ID", { length: 50 }),
	start_time: varchar("start_time", { length: 100 }),
	end_time: varchar("end_time", { length: 100 }),
	reamrk: varchar("reamrk", { length: 100 }),
	create_userid: varchar("create_userid", { length: 100 }),
	CreatorTime: datetime("CreatorTime", { mode: 'string'}),
	DeleteTime: datetime("DeleteTime", { mode: 'string'}),
},
(table) => {
	return {
		door_rfidregister_register_id: primaryKey({ columns: [table.register_id], name: "door_rfidregister_register_id"}),
	}
});

export const qrtz_blob_triggers = mysqlTable("qrtz_blob_triggers", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	trigger_name: varchar("trigger_name", { length: 200 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
	// Warning: Can't parse blob from database
	// blobType: blob("blob_data"),
},
(table) => {
	return {
		qrtz_blob_triggers_ibfk_1: foreignKey({
			columns: [table.sched_name, table.trigger_name, table.trigger_group],
			foreignColumns: [qrtz_triggers.sched_name, qrtz_triggers.trigger_name, qrtz_triggers.trigger_group],
			name: "qrtz_blob_triggers_ibfk_1"
		}).onUpdate("restrict").onDelete("restrict"),
		qrtz_blob_triggers_sched_name_trigger_name_trigger_group: primaryKey({ columns: [table.sched_name, table.trigger_name, table.trigger_group], name: "qrtz_blob_triggers_sched_name_trigger_name_trigger_group"}),
	}
});

export const qrtz_calendars = mysqlTable("qrtz_calendars", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	calendar_name: varchar("calendar_name", { length: 200 }).notNull(),
	// Warning: Can't parse blob from database
	// blobType: blob("calendar").notNull(),
},
(table) => {
	return {
		qrtz_calendars_sched_name_calendar_name: primaryKey({ columns: [table.sched_name, table.calendar_name], name: "qrtz_calendars_sched_name_calendar_name"}),
	}
});

export const qrtz_cron_triggers = mysqlTable("qrtz_cron_triggers", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	trigger_name: varchar("trigger_name", { length: 200 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
	cron_expression: varchar("cron_expression", { length: 200 }).notNull(),
	time_zone_id: varchar("time_zone_id", { length: 80 }),
},
(table) => {
	return {
		qrtz_cron_triggers_ibfk_1: foreignKey({
			columns: [table.sched_name, table.trigger_name, table.trigger_group],
			foreignColumns: [qrtz_triggers.sched_name, qrtz_triggers.trigger_name, qrtz_triggers.trigger_group],
			name: "qrtz_cron_triggers_ibfk_1"
		}).onUpdate("restrict").onDelete("restrict"),
		qrtz_cron_triggers_sched_name_trigger_name_trigger_group: primaryKey({ columns: [table.sched_name, table.trigger_name, table.trigger_group], name: "qrtz_cron_triggers_sched_name_trigger_name_trigger_group"}),
	}
});

export const qrtz_fired_triggers = mysqlTable("qrtz_fired_triggers", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	entry_id: varchar("entry_id", { length: 95 }).notNull(),
	trigger_name: varchar("trigger_name", { length: 200 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
	instance_name: varchar("instance_name", { length: 200 }).notNull(),
	fired_time: bigint("fired_time", { mode: "number" }).notNull(),
	sched_time: bigint("sched_time", { mode: "number" }).notNull(),
	priority: int("priority").notNull(),
	state: varchar("state", { length: 16 }).notNull(),
	job_name: varchar("job_name", { length: 200 }),
	job_group: varchar("job_group", { length: 200 }),
	is_nonconcurrent: varchar("is_nonconcurrent", { length: 1 }),
	requests_recovery: varchar("requests_recovery", { length: 1 }),
},
(table) => {
	return {
		qrtz_fired_triggers_sched_name_entry_id: primaryKey({ columns: [table.sched_name, table.entry_id], name: "qrtz_fired_triggers_sched_name_entry_id"}),
	}
});

export const qrtz_job_details = mysqlTable("qrtz_job_details", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	job_name: varchar("job_name", { length: 200 }).notNull(),
	job_group: varchar("job_group", { length: 200 }).notNull(),
	description: varchar("description", { length: 250 }),
	job_class_name: varchar("job_class_name", { length: 250 }).notNull(),
	is_durable: varchar("is_durable", { length: 1 }).notNull(),
	is_nonconcurrent: varchar("is_nonconcurrent", { length: 1 }).notNull(),
	is_update_data: varchar("is_update_data", { length: 1 }).notNull(),
	requests_recovery: varchar("requests_recovery", { length: 1 }).notNull(),
	// Warning: Can't parse blob from database
	// blobType: blob("job_data"),
},
(table) => {
	return {
		qrtz_job_details_sched_name_job_name_job_group: primaryKey({ columns: [table.sched_name, table.job_name, table.job_group], name: "qrtz_job_details_sched_name_job_name_job_group"}),
	}
});

export const qrtz_locks = mysqlTable("qrtz_locks", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	lock_name: varchar("lock_name", { length: 40 }).notNull(),
},
(table) => {
	return {
		qrtz_locks_sched_name_lock_name: primaryKey({ columns: [table.sched_name, table.lock_name], name: "qrtz_locks_sched_name_lock_name"}),
	}
});

export const qrtz_paused_trigger_grps = mysqlTable("qrtz_paused_trigger_grps", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
},
(table) => {
	return {
		qrtz_paused_trigger_grps_sched_name_trigger_group: primaryKey({ columns: [table.sched_name, table.trigger_group], name: "qrtz_paused_trigger_grps_sched_name_trigger_group"}),
	}
});

export const qrtz_scheduler_state = mysqlTable("qrtz_scheduler_state", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	instance_name: varchar("instance_name", { length: 200 }).notNull(),
	last_checkin_time: bigint("last_checkin_time", { mode: "number" }).notNull(),
	checkin_interval: bigint("checkin_interval", { mode: "number" }).notNull(),
},
(table) => {
	return {
		qrtz_scheduler_state_sched_name_instance_name: primaryKey({ columns: [table.sched_name, table.instance_name], name: "qrtz_scheduler_state_sched_name_instance_name"}),
	}
});

export const qrtz_simple_triggers = mysqlTable("qrtz_simple_triggers", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	trigger_name: varchar("trigger_name", { length: 200 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
	repeat_count: bigint("repeat_count", { mode: "number" }).notNull(),
	repeat_interval: bigint("repeat_interval", { mode: "number" }).notNull(),
	times_triggered: bigint("times_triggered", { mode: "number" }).notNull(),
},
(table) => {
	return {
		qrtz_simple_triggers_ibfk_1: foreignKey({
			columns: [table.sched_name, table.trigger_name, table.trigger_group],
			foreignColumns: [qrtz_triggers.sched_name, qrtz_triggers.trigger_name, qrtz_triggers.trigger_group],
			name: "qrtz_simple_triggers_ibfk_1"
		}).onUpdate("restrict").onDelete("restrict"),
		qrtz_simple_triggers_sched_name_trigger_name_trigger_group: primaryKey({ columns: [table.sched_name, table.trigger_name, table.trigger_group], name: "qrtz_simple_triggers_sched_name_trigger_name_trigger_group"}),
	}
});

export const qrtz_simprop_triggers = mysqlTable("qrtz_simprop_triggers", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	trigger_name: varchar("trigger_name", { length: 200 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
	str_prop_1: varchar("str_prop_1", { length: 512 }),
	str_prop_2: varchar("str_prop_2", { length: 512 }),
	str_prop_3: varchar("str_prop_3", { length: 512 }),
	int_prop_1: int("int_prop_1"),
	int_prop_2: int("int_prop_2"),
	long_prop_1: bigint("long_prop_1", { mode: "number" }),
	long_prop_2: bigint("long_prop_2", { mode: "number" }),
	dec_prop_1: decimal("dec_prop_1", { precision: 13, scale: 4 }),
	dec_prop_2: decimal("dec_prop_2", { precision: 13, scale: 4 }),
	bool_prop_1: varchar("bool_prop_1", { length: 1 }),
	bool_prop_2: varchar("bool_prop_2", { length: 1 }),
},
(table) => {
	return {
		qrtz_simprop_triggers_ibfk_1: foreignKey({
			columns: [table.sched_name, table.trigger_name, table.trigger_group],
			foreignColumns: [qrtz_triggers.sched_name, qrtz_triggers.trigger_name, qrtz_triggers.trigger_group],
			name: "qrtz_simprop_triggers_ibfk_1"
		}).onUpdate("restrict").onDelete("restrict"),
		qrtz_simprop_triggers_sched_name_trigger_name_trigger_group: primaryKey({ columns: [table.sched_name, table.trigger_name, table.trigger_group], name: "qrtz_simprop_triggers_sched_name_trigger_name_trigger_group"}),
	}
});

export const qrtz_triggers = mysqlTable("qrtz_triggers", {
	sched_name: varchar("sched_name", { length: 120 }).notNull(),
	trigger_name: varchar("trigger_name", { length: 200 }).notNull(),
	trigger_group: varchar("trigger_group", { length: 200 }).notNull(),
	job_name: varchar("job_name", { length: 200 }).notNull(),
	job_group: varchar("job_group", { length: 200 }).notNull(),
	description: varchar("description", { length: 250 }),
	next_fire_time: bigint("next_fire_time", { mode: "number" }),
	prev_fire_time: bigint("prev_fire_time", { mode: "number" }),
	priority: int("priority"),
	trigger_state: varchar("trigger_state", { length: 16 }).notNull(),
	trigger_type: varchar("trigger_type", { length: 8 }).notNull(),
	start_time: bigint("start_time", { mode: "number" }).notNull(),
	end_time: bigint("end_time", { mode: "number" }),
	calendar_name: varchar("calendar_name", { length: 200 }),
	misfire_instr: smallint("misfire_instr"),
	// Warning: Can't parse blob from database
	// blobType: blob("job_data"),
},
(table) => {
	return {
		sched_name: index("sched_name").on(table.sched_name, table.job_name, table.job_group),
		qrtz_triggers_ibfk_1: foreignKey({
			columns: [table.sched_name, table.job_name, table.job_group],
			foreignColumns: [qrtz_job_details.sched_name, qrtz_job_details.job_name, qrtz_job_details.job_group],
			name: "qrtz_triggers_ibfk_1"
		}).onUpdate("restrict").onDelete("restrict"),
		qrtz_triggers_sched_name_trigger_name_trigger_group: primaryKey({ columns: [table.sched_name, table.trigger_name, table.trigger_group], name: "qrtz_triggers_sched_name_trigger_name_trigger_group"}),
	}
});

export const rfid_cabinet = mysqlTable("rfid_cabinet", {
	ID: int("ID").autoincrement().notNull(),
	Name: varchar("Name", { length: 20 }),
	State: varchar("State", { length: 10 }),
	TypeClass: varchar("TypeClass", { length: 255 }),
	fid: int("fid").default(0).notNull(),
	cabIndex: varchar("cabIndex", { length: 20 }),
	cabAddr: varchar("cabAddr", { length: 15 }),
	RDAddr: varchar("RDAddr", { length: 15 }),
	RDAddr2: varchar("RDAddr2", { length: 15 }),
	RFAD_Com: varchar("RFAD_Com", { length: 20 }),
	RFAD_baudrate: varchar("RFAD_baudrate", { length: 20 }),
	operateOut: varchar("operateOut", { length: 20 }),
	openDoor: varchar("openDoor", { length: 10 }),
	fingerServer: varchar("fingerServer", { length: 15 }),
	SecretLevel: varchar("SecretLevel", { length: 50 }),
	Classification: varchar("Classification", { length: 50 }),
	dept_id: bigint("dept_id", { mode: "number" }),
},
(table) => {
	return {
		rfid_cabinet_ID: primaryKey({ columns: [table.ID], name: "rfid_cabinet_ID"}),
	}
});

export const rfid_cabinetdoor = mysqlTable("rfid_cabinetdoor", {
	Id: int("Id").autoincrement().notNull(),
	CabinetId: int("CabinetId"),
	Name: int("Name"),
	State: varchar("State", { length: 10 }),
	Kgbh: varchar("Kgbh", { length: 255 }),
	Kgzt: varchar("Kgzt", { length: 255 }),
	bindingType: bigint("bindingType", { mode: "number" }),
	FolderPath: varchar("FolderPath", { length: 255 }),
	OrderIndex: varchar("OrderIndex", { length: 255 }),
	txAddr: varchar("txAddr", { length: 255 }),
	txId: varchar("txId", { length: 255 }),
	viewName: varchar("viewName", { length: 255 }),
},
(table) => {
	return {
		rfid_cabinetdoor_Id: primaryKey({ columns: [table.Id], name: "rfid_cabinetdoor_Id"}),
	}
});

export const rfid_card_user = mysqlTable("rfid_card_user", {
	CardId: int("CardId").autoincrement().notNull(),
	Userid: int("Userid"),
	CardData: varchar("CardData", { length: 255 }),
	CreateDate: datetime("CreateDate", { mode: 'string'}),
},
(table) => {
	return {
		rfid_card_user_CardId: primaryKey({ columns: [table.CardId], name: "rfid_card_user_CardId"}),
	}
});

export const rfid_door_dept = mysqlTable("rfid_door_dept", {
	dd_id: bigint("dd_id", { mode: "number" }).autoincrement().notNull(),
	DoorID: int("DoorID"),
	deptid: int("deptid"),
},
(table) => {
	return {
		rfid_door_dept_dd_id: primaryKey({ columns: [table.dd_id], name: "rfid_door_dept_dd_id"}),
	}
});

export const rfid_door_user = mysqlTable("rfid_door_user", {
	du_id: bigint("du_id", { mode: "number" }).autoincrement().notNull(),
	DoorID: int("DoorID"),
	Userid: int("Userid"),
},
(table) => {
	return {
		rfid_door_user_du_id: primaryKey({ columns: [table.du_id], name: "rfid_door_user_du_id"}),
	}
});

export const rfid_finger_user = mysqlTable("rfid_finger_user", {
	FingerID: int("FingerID").autoincrement().notNull(),
	Userid: int("Userid"),
	order: int("order"),
	FingerData: varchar("FingerData", { length: 3000 }),
	CreateDate: datetime("CreateDate", { mode: 'string'}),
},
(table) => {
	return {
		rfid_finger_user_FingerID: primaryKey({ columns: [table.FingerID], name: "rfid_finger_user_FingerID"}),
	}
});

export const rfid_operation_record = mysqlTable("rfid_operation_record", {
	recordId: int("recordId").autoincrement().notNull(),
	operationid: varchar("operationid", { length: 50 }),
	UserID: varchar("UserID", { length: 255 }),
	CreateDate: varchar("CreateDate", { length: 255 }),
	Type: varchar("Type", { length: 255 }),
	cadinetID: varchar("cadinetID", { length: 255 }),
	doorid: varchar("doorid", { length: 11 }),
	content: varchar("content", { length: 255 }),
},
(table) => {
	return {
		rfid_operation_record_recordId: primaryKey({ columns: [table.recordId], name: "rfid_operation_record_recordId"}),
	}
});

export const rfid_remove_carrier = mysqlTable("rfid_remove_carrier", {
	Carrier_ID: int("Carrier_ID").autoincrement().notNull(),
	carrier_rfid: varchar("carrier_rfid", { length: 128 }),
	cabinet_id: varchar("cabinet_id", { length: 20 }),
	cabinet_door_id: varchar("cabinet_door_id", { length: 20 }),
	carrier_p_status: varchar("carrier_p_status", { length: 255 }),
	user_id: bigint("user_id", { mode: "number" }),
	add_user: bigint("add_user", { mode: "number" }),
	type: tinyint("type"),
	remark: varchar("remark", { length: 255 }),
	create_time: datetime("create_time", { mode: 'string'}),
	name: varchar("name", { length: 255 }),
	record_id: bigint("record_id", { mode: "number" }),
},
(table) => {
	return {
		rfid_remove_carrier_Carrier_ID: primaryKey({ columns: [table.Carrier_ID], name: "rfid_remove_carrier_Carrier_ID"}),
	}
});

export const rfid_remove_document = mysqlTable("rfid_remove_document", {
	doc_id: bigint("doc_id", { mode: "number" }).autoincrement().notNull(),
	doc_name: varchar("doc_name", { length: 200 }).notNull(),
	doc_secret_level: int("doc_secret_level"),
	doc_type: varchar("doc_type", { length: 10 }),
	doc_rfid: varchar("doc_rfid", { length: 128 }),
	remark: varchar("remark", { length: 100 }),
	doc_p_status: int("doc_p_status").default(1),
	user_id: bigint("user_id", { mode: "number" }),
	binding_id: bigint("binding_id", { mode: "number" }).notNull(),
	cabinet_id: varchar("cabinet_id", { length: 20 }),
	cabinet_door_id: varchar("cabinet_door_id", { length: 20 }),
	update_time: datetime("update_time", { mode: 'string'}),
	create_time: datetime("create_time", { mode: 'string'}).notNull(),
	IS_one: varchar("IS_one", { length: 255 }),
	doc_last_time: datetime("doc_last_time", { mode: 'string'}),
	end_time: datetime("end_time", { mode: 'string'}),
	record_id: bigint("record_id", { mode: "number" }),
	binding_dept_id: int("binding_dept_id"),
	bindingType: int("bindingType"),
},
(table) => {
	return {
		rfid_remove_document_doc_id: primaryKey({ columns: [table.doc_id], name: "rfid_remove_document_doc_id"}),
	}
});

export const rfid_remove_record = mysqlTable("rfid_remove_record", {
	id: bigint("id", { mode: "number" }).autoincrement().notNull(),
	remove_time: datetime("remove_time", { mode: 'string'}),
	user_id: bigint("user_id", { mode: "number" }),
},
(table) => {
	return {
		rfid_remove_record_id: primaryKey({ columns: [table.id], name: "rfid_remove_record_id"}),
	}
});

export const rfid_rfid_record = mysqlTable("rfid_rfid_record", {
	id: int("id").autoincrement().notNull(),
	userId: bigint("userId", { mode: "number" }),
	operationID: varchar("operationID", { length: 50 }),
	cabinetId: int("cabinetId"),
	cabDoorId: int("cabDoorId"),
	RFIDId: varchar("RFIDId", { length: 50 }),
	createTime: datetime("createTime", { mode: 'string'}),
	handleID: varchar("handleID", { length: 50 }).default(-1),
	isOpen: varchar("isOpen", { length: 10 }),
	isBorrow: varchar("isBorrow", { length: 10 }),
	type: tinyint("type"),
	user_name: varchar("user_name", { length: 255 }),
	user_dept_name: varchar("user_dept_name", { length: 255 }),
	doc_car_name: varchar("doc_car_name", { length: 255 }),
	doccar_dept_name: varchar("doccar_dept_name", { length: 255 }),
	cab_name: varchar("cab_name", { length: 255 }),
	cabdoor_name: varchar("cabdoor_name", { length: 255 }),
},
(table) => {
	return {
		index_operationID: index("index_operationID").on(table.operationID),
		index_rfid: index("index_rfid").on(table.RFIDId),
		rfid_rfid_record_id: primaryKey({ columns: [table.id], name: "rfid_rfid_record_id"}),
	}
});

export const rfid_switch_record = mysqlTable("rfid_switch_record", {
	Id: int("Id").autoincrement().notNull(),
	CabinetId: varchar("CabinetId", { length: 255 }),
	CabinetDoorId: varchar("CabinetDoorId", { length: 255 }),
	operationID: varchar("operationID", { length: 50 }),
	userID: int("userID"),
	TYPE: varchar("TYPE", { length: 255 }),
	content: varchar("content", { length: 255 }),
	Datetime: varchar("Datetime", { length: 255 }),
},
(table) => {
	return {
		rfid_switch_record_Id: primaryKey({ columns: [table.Id], name: "rfid_switch_record_Id"}),
	}
});

export const rfid_tips_alarm_record = mysqlTable("rfid_tips_alarm_record", {
	recordId: int("recordId").autoincrement().notNull(),
	Alarm_Type: varchar("Alarm_Type", { length: 255 }),
	Type: int("Type").default(0),
	UserID: int("UserID"),
	operationid: varchar("operationid", { length: 50 }),
	CreateDate: datetime("CreateDate", { mode: 'string'}),
	Handle_UserID: int("Handle_UserID"),
	Handle_operationid: varchar("Handle_operationid", { length: 50 }),
	Handle_Date: datetime("Handle_Date", { mode: 'string'}),
	cadinetID: int("cadinetID").default(0),
	doorid: int("doorid").default(0),
	content: varchar("content", { length: 255 }),
	contentType: tinyint("contentType"),
	Rfid: varchar("Rfid", { length: 255 }),
	groupid: bigint("groupid", { mode: "number" }),
	docId: bigint("docId", { mode: "number" }),
	doc_car_name: varchar("doc_car_name", { length: 255 }),
	dept_name: varchar("dept_name", { length: 255 }),
	car_user_name: varchar("car_user_name", { length: 255 }),
	cab_name: varchar("cab_name", { length: 255 }),
	cabdoor_name: varchar("cabdoor_name", { length: 255 }),
	ope_user_name: varchar("ope_user_name", { length: 255 }),
	cabdoor_User_name: varchar("cabdoor_User_name", { length: 255 }),
	cabdoor_dept_name: varchar("cabdoor_dept_name", { length: 255 }),
	isOperation: tinyint("isOperation").default(0),
},
(table) => {
	return {
		index_type: index("index_type").on(table.Type),
		rfid_tips_alarm_record_recordId: primaryKey({ columns: [table.recordId], name: "rfid_tips_alarm_record_recordId"}),
	}
});

export const rfid_tips_record = mysqlTable("rfid_tips_record", {
	recordId: int("recordId").autoincrement().notNull(),
	UserID: int("UserID"),
	operationid: varchar("operationid", { length: 50 }),
	CreateDate: datetime("CreateDate", { mode: 'string'}),
	Handle_UserID: int("Handle_UserID"),
	Handle_operationid: varchar("Handle_operationid", { length: 50 }),
	Handle_Date: datetime("Handle_Date", { mode: 'string'}),
	cadinetID: int("cadinetID").default(0),
	doorid: int("doorid").default(0),
	content: varchar("content", { length: 255 }),
	contentType: tinyint("contentType"),
	Rfid: varchar("Rfid", { length: 255 }),
	groupid: bigint("groupid", { mode: "number" }),
	docId: bigint("docId", { mode: "number" }),
	doc_car_name: varchar("doc_car_name", { length: 255 }),
	dept_name: varchar("dept_name", { length: 255 }),
	car_user_name: varchar("car_user_name", { length: 255 }),
	cab_name: varchar("cab_name", { length: 255 }),
	cabdoor_name: varchar("cabdoor_name", { length: 255 }),
	ope_user_name: varchar("ope_user_name", { length: 255 }),
	cabdoor_User_name: varchar("cabdoor_User_name", { length: 255 }),
	cabdoor_dept_name: varchar("cabdoor_dept_name", { length: 255 }),
	isOperation: tinyint("isOperation").default(0),
},
(table) => {
	return {
		rfid_tips_record_recordId: primaryKey({ columns: [table.recordId], name: "rfid_tips_record_recordId"}),
	}
});

export const sys_config = mysqlTable("sys_config", {
	config_id: int("config_id").autoincrement().notNull(),
	config_name: varchar("config_name", { length: 100 }).default(''),
	config_key: varchar("config_key", { length: 100 }).default(''),
	config_value: varchar("config_value", { length: 100 }).default(''),
	config_type: char("config_type", { length: 1 }).default('N'),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }),
},
(table) => {
	return {
		sys_config_config_id: primaryKey({ columns: [table.config_id], name: "sys_config_config_id"}),
	}
});

export const sys_dept = mysqlTable("sys_dept", {
	dept_id: bigint("dept_id", { mode: "number" }).autoincrement().notNull(),
	parent_id: bigint("parent_id", { mode: "number" }),
	ancestors: varchar("ancestors", { length: 50 }).default(''),
	dept_name: varchar("dept_name", { length: 30 }).default(''),
	order_num: int("order_num").default(0),
	leader: varchar("leader", { length: 20 }),
	phone: varchar("phone", { length: 11 }),
	email: varchar("email", { length: 50 }),
	status: char("status", { length: 1 }),
	del_flag: char("del_flag", { length: 1 }),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	level: tinyint("level"),
	code: int("code").default(0),
},
(table) => {
	return {
		sys_dept_dept_id: primaryKey({ columns: [table.dept_id], name: "sys_dept_dept_id"}),
	}
});

export const sys_dict_data = mysqlTable("sys_dict_data", {
	dict_code: bigint("dict_code", { mode: "number" }).autoincrement().notNull(),
	dict_sort: int("dict_sort").default(0),
	dict_label: varchar("dict_label", { length: 100 }).default(''),
	dict_value: varchar("dict_value", { length: 100 }).default(''),
	dict_type: varchar("dict_type", { length: 100 }).default(''),
	css_class: varchar("css_class", { length: 100 }),
	list_class: varchar("list_class", { length: 100 }),
	is_default: char("is_default", { length: 1 }).default('N'),
	status: char("status", { length: 1 }),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }),
},
(table) => {
	return {
		sys_dict_data_dict_code: primaryKey({ columns: [table.dict_code], name: "sys_dict_data_dict_code"}),
	}
});

export const sys_dict_type = mysqlTable("sys_dict_type", {
	dict_id: bigint("dict_id", { mode: "number" }).autoincrement().notNull(),
	dict_name: varchar("dict_name", { length: 100 }).default(''),
	dict_type: varchar("dict_type", { length: 100 }).default(''),
	status: char("status", { length: 1 }),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }),
},
(table) => {
	return {
		sys_dict_type_dict_id: primaryKey({ columns: [table.dict_id], name: "sys_dict_type_dict_id"}),
		dict_type: unique("dict_type").on(table.dict_type),
	}
});

export const sys_file_info = mysqlTable("sys_file_info", {
	file_id: int("file_id").autoincrement().notNull(),
	file_name: varchar("file_name", { length: 50 }).default(''),
	file_path: varchar("file_path", { length: 255 }).default(''),
},
(table) => {
	return {
		sys_file_info_file_id: primaryKey({ columns: [table.file_id], name: "sys_file_info_file_id"}),
	}
});

export const sys_job = mysqlTable("sys_job", {
	job_id: bigint("job_id", { mode: "number" }).autoincrement().notNull(),
	job_name: varchar("job_name", { length: 64 }).default('').notNull(),
	job_group: varchar("job_group", { length: 64 }).default('').notNull(),
	method_name: varchar("method_name", { length: 500 }).default(''),
	method_params: varchar("method_params", { length: 50 }),
	cron_expression: varchar("cron_expression", { length: 255 }).default(''),
	misfire_policy: varchar("misfire_policy", { length: 20 }).default(3),
	concurrent: char("concurrent", { length: 1 }).default(1),
	status: char("status", { length: 1 }),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }).default(''),
},
(table) => {
	return {
		sys_job_job_id_job_name_job_group: primaryKey({ columns: [table.job_id, table.job_name, table.job_group], name: "sys_job_job_id_job_name_job_group"}),
	}
});

export const sys_job_log = mysqlTable("sys_job_log", {
	job_log_id: bigint("job_log_id", { mode: "number" }).autoincrement().notNull(),
	job_name: varchar("job_name", { length: 64 }).notNull(),
	job_group: varchar("job_group", { length: 64 }).notNull(),
	method_name: varchar("method_name", { length: 500 }),
	method_params: varchar("method_params", { length: 50 }),
	job_message: varchar("job_message", { length: 500 }),
	status: char("status", { length: 1 }),
	exception_info: varchar("exception_info", { length: 2000 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
},
(table) => {
	return {
		sys_job_log_job_log_id: primaryKey({ columns: [table.job_log_id], name: "sys_job_log_job_log_id"}),
	}
});

export const sys_logininfor = mysqlTable("sys_logininfor", {
	info_id: bigint("info_id", { mode: "number" }).autoincrement().notNull(),
	login_name: varchar("login_name", { length: 50 }).default(''),
	ipaddr: varchar("ipaddr", { length: 50 }).default(''),
	login_location: varchar("login_location", { length: 255 }).default(''),
	browser: varchar("browser", { length: 50 }).default(''),
	os: varchar("os", { length: 50 }).default(''),
	status: char("status", { length: 1 }),
	msg: varchar("msg", { length: 255 }).default(''),
	login_time: datetime("login_time", { mode: 'string'}),
},
(table) => {
	return {
		sys_logininfor_info_id: primaryKey({ columns: [table.info_id], name: "sys_logininfor_info_id"}),
	}
});

export const sys_menu = mysqlTable("sys_menu", {
	menu_id: bigint("menu_id", { mode: "number" }).autoincrement().notNull(),
	menu_name: varchar("menu_name", { length: 50 }).notNull(),
	parent_id: bigint("parent_id", { mode: "number" }),
	order_num: int("order_num").default(0),
	url: varchar("url", { length: 200 }).default('#'),
	menu_type: char("menu_type", { length: 1 }).default(''),
	visible: char("visible", { length: 1 }),
	perms: varchar("perms", { length: 100 }),
	icon: varchar("icon", { length: 100 }).default('#'),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }).default(''),
},
(table) => {
	return {
		sys_menu_menu_id: primaryKey({ columns: [table.menu_id], name: "sys_menu_menu_id"}),
	}
});

export const sys_notice = mysqlTable("sys_notice", {
	notice_id: int("notice_id").autoincrement().notNull(),
	notice_title: varchar("notice_title", { length: 50 }).notNull(),
	notice_type: char("notice_type", { length: 1 }).notNull(),
	notice_content: varchar("notice_content", { length: 2000 }),
	status: char("status", { length: 1 }),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 255 }),
},
(table) => {
	return {
		sys_notice_notice_id: primaryKey({ columns: [table.notice_id], name: "sys_notice_notice_id"}),
	}
});

export const sys_oper_log = mysqlTable("sys_oper_log", {
	oper_id: bigint("oper_id", { mode: "number" }).autoincrement().notNull(),
	title: varchar("title", { length: 50 }).default(''),
	business_type: int("business_type").default(0),
	method: varchar("method", { length: 100 }).default(''),
	operator_type: int("operator_type").default(0),
	oper_name: varchar("oper_name", { length: 50 }).default(''),
	dept_name: varchar("dept_name", { length: 50 }).default(''),
	oper_url: varchar("oper_url", { length: 255 }).default(''),
	oper_ip: varchar("oper_ip", { length: 50 }).default(''),
	oper_location: varchar("oper_location", { length: 255 }).default(''),
	oper_param: varchar("oper_param", { length: 2000 }).default(''),
	status: int("status").default(0),
	error_msg: varchar("error_msg", { length: 2000 }).default(''),
	oper_time: datetime("oper_time", { mode: 'string'}),
},
(table) => {
	return {
		sys_oper_log_oper_id: primaryKey({ columns: [table.oper_id], name: "sys_oper_log_oper_id"}),
	}
});

export const sys_post = mysqlTable("sys_post", {
	post_id: bigint("post_id", { mode: "number" }).autoincrement().notNull(),
	post_code: varchar("post_code", { length: 64 }).notNull(),
	post_name: varchar("post_name", { length: 50 }).notNull(),
	post_sort: int("post_sort").notNull(),
	status: char("status", { length: 1 }).notNull(),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }),
},
(table) => {
	return {
		sys_post_post_id: primaryKey({ columns: [table.post_id], name: "sys_post_post_id"}),
	}
});

export const sys_role = mysqlTable("sys_role", {
	role_id: bigint("role_id", { mode: "number" }).autoincrement().notNull(),
	role_name: varchar("role_name", { length: 30 }).notNull(),
	role_key: varchar("role_key", { length: 100 }).notNull(),
	role_sort: int("role_sort").notNull(),
	data_scope: char("data_scope", { length: 1 }).default(1),
	status: char("status", { length: 1 }).notNull(),
	del_flag: char("del_flag", { length: 1 }),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }),
},
(table) => {
	return {
		sys_role_role_id: primaryKey({ columns: [table.role_id], name: "sys_role_role_id"}),
	}
});

export const sys_role_dept = mysqlTable("sys_role_dept", {
	role_id: bigint("role_id", { mode: "number" }).notNull(),
	dept_id: bigint("dept_id", { mode: "number" }).notNull(),
},
(table) => {
	return {
		sys_role_dept_role_id_dept_id: primaryKey({ columns: [table.role_id, table.dept_id], name: "sys_role_dept_role_id_dept_id"}),
	}
});

export const sys_role_menu = mysqlTable("sys_role_menu", {
	role_id: bigint("role_id", { mode: "number" }).notNull(),
	menu_id: bigint("menu_id", { mode: "number" }).notNull(),
},
(table) => {
	return {
		sys_role_menu_role_id_menu_id: primaryKey({ columns: [table.role_id, table.menu_id], name: "sys_role_menu_role_id_menu_id"}),
	}
});

export const sys_user = mysqlTable("sys_user", {
	user_id: bigint("user_id", { mode: "number" }).autoincrement().notNull(),
	dept_id: bigint("dept_id", { mode: "number" }),
	login_name: varchar("login_name", { length: 30 }).notNull(),
	user_name: varchar("user_name", { length: 30 }).notNull(),
	user_type: varchar("user_type", { length: 2 }),
	email: varchar("email", { length: 50 }).default(''),
	phonenumber: varchar("phonenumber", { length: 11 }).default(''),
	sex: char("sex", { length: 1 }),
	avatar: varchar("avatar", { length: 100 }).default(''),
	password: varchar("password", { length: 50 }).default(''),
	salt: varchar("salt", { length: 20 }).default(''),
	status: char("status", { length: 1 }),
	del_flag: char("del_flag", { length: 1 }),
	login_ip: varchar("login_ip", { length: 50 }).default(''),
	login_date: datetime("login_date", { mode: 'string'}),
	create_by: varchar("create_by", { length: 64 }).default(''),
	create_time: datetime("create_time", { mode: 'string'}),
	update_by: varchar("update_by", { length: 64 }).default(''),
	update_time: datetime("update_time", { mode: 'string'}),
	remark: varchar("remark", { length: 500 }).default(''),
	type: int("type").default(1),
	code: varchar("code", { length: 255 }),
},
(table) => {
	return {
		sys_user_user_id: primaryKey({ columns: [table.user_id], name: "sys_user_user_id"}),
	}
});

export const sys_user_online = mysqlTable("sys_user_online", {
	sessionId: varchar("sessionId", { length: 50 }).default('').notNull(),
	login_name: varchar("login_name", { length: 50 }).default(''),
	dept_name: varchar("dept_name", { length: 50 }).default(''),
	ipaddr: varchar("ipaddr", { length: 50 }).default(''),
	login_location: varchar("login_location", { length: 255 }).default(''),
	browser: varchar("browser", { length: 50 }).default(''),
	os: varchar("os", { length: 50 }).default(''),
	status: varchar("status", { length: 10 }).default(''),
	start_timestamp: datetime("start_timestamp", { mode: 'string'}),
	last_access_time: datetime("last_access_time", { mode: 'string'}),
	expire_time: int("expire_time").default(0),
},
(table) => {
	return {
		sys_user_online_sessionId: primaryKey({ columns: [table.sessionId], name: "sys_user_online_sessionId"}),
	}
});

export const sys_user_post = mysqlTable("sys_user_post", {
	user_id: bigint("user_id", { mode: "number" }).notNull(),
	post_id: bigint("post_id", { mode: "number" }).notNull(),
},
(table) => {
	return {
		sys_user_post_user_id_post_id: primaryKey({ columns: [table.user_id, table.post_id], name: "sys_user_post_user_id_post_id"}),
	}
});

export const sys_user_role = mysqlTable("sys_user_role", {
	user_id: bigint("user_id", { mode: "number" }).notNull(),
	role_id: bigint("role_id", { mode: "number" }).notNull(),
},
(table) => {
	return {
		sys_user_role_user_id_role_id: primaryKey({ columns: [table.user_id, table.role_id], name: "sys_user_role_user_id_role_id"}),
	}
});