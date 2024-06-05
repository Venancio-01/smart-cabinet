-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `doc_carrier_type` (
	`carrier_type_id` bigint AUTO_INCREMENT NOT NULL,
	`type_name` varchar(255),
	CONSTRAINT `doc_carrier_type_carrier_type_id` PRIMARY KEY(`carrier_type_id`)
);
--> statement-breakpoint
CREATE TABLE `doc_directory` (
	`directory_id` bigint AUTO_INCREMENT NOT NULL,
	`parent_id` bigint NOT NULL,
	`display_name` varchar(100),
	`doc_name` varchar(200),
	`doc_e_directory` varchar(300) NOT NULL,
	`sort` int,
	`status` int NOT NULL,
	`update_time` datetime,
	`create_time` datetime NOT NULL,
	CONSTRAINT `doc_directory_directory_id` PRIMARY KEY(`directory_id`),
	CONSTRAINT `index_doc_e_directory` UNIQUE(`doc_e_directory`),
	CONSTRAINT `index_id` UNIQUE(`directory_id`)
);
--> statement-breakpoint
CREATE TABLE `doc_document` (
	`doc_id` bigint AUTO_INCREMENT NOT NULL,
	`doc_name` varchar(200) NOT NULL,
	`doc_secret_level` int,
	`doc_type` tinyint,
	`doc_rfid` varchar(128),
	`IS_one` varchar(255) DEFAULT 0,
	`create_time` datetime NOT NULL,
	`end_time` datetime,
	`remark` varchar(100),
	`doc_p_status` int DEFAULT 1,
	`user_id` bigint,
	`cabinet_id` int DEFAULT 0,
	`cabinet_door_id` int DEFAULT 0,
	`update_time` datetime,
	`doc_last_time` datetime,
	`remove_status` tinyint DEFAULT 0,
	`code` varchar(255),
	`urgency` tinyint,
	`send_dep` tinyint,
	`send_code` varchar(255),
	`bureau_depId` bigint,
	`bindingType` bigint(1) unsigned zerofill DEFAULT 0,
	`bind_user_id` int,
	`binding_dept_id` int,
	`binding_id` bigint,
	CONSTRAINT `doc_document_doc_id` PRIMARY KEY(`doc_id`)
);
--> statement-breakpoint
CREATE TABLE `doc_operation_log` (
	`operationlog_id` varchar(32) NOT NULL,
	`doc_id` bigint,
	`doc_name` varchar(255),
	`operation_type` int,
	`operation_name` varchar(100),
	`user_id` bigint NOT NULL,
	`user_name` varchar(100) NOT NULL,
	`dept_id` bigint NOT NULL,
	`dept_name` varchar(100) NOT NULL,
	`update_time` datetime,
	`create_time` datetime NOT NULL,
	CONSTRAINT `doc_operation_log_operationlog_id` PRIMARY KEY(`operationlog_id`)
);
--> statement-breakpoint
CREATE TABLE `doc_secret_level_role` (
	`slr_id` bigint AUTO_INCREMENT NOT NULL,
	`role_id` bigint NOT NULL,
	`role_name` varchar(30),
	`slr_name` varchar(100),
	`slr_code` bigint,
	`update_time` datetime,
	`create_time` datetime NOT NULL,
	CONSTRAINT `doc_secret_level_role_slr_id` PRIMARY KEY(`slr_id`)
);
--> statement-breakpoint
CREATE TABLE `door_access_records` (
	`AccessID` int AUTO_INCREMENT NOT NULL,
	`AccessDirection` int,
	`directionCreateTime` datetime,
	`EquipmentID` int,
	`EquipmentName` varchar(100),
	`remark` varchar(100),
	CONSTRAINT `door_access_records_AccessID` PRIMARY KEY(`AccessID`)
);
--> statement-breakpoint
CREATE TABLE `door_alarmrecord` (
	`Alarmid` int AUTO_INCREMENT NOT NULL,
	`EquipmentId` varchar(100),
	`EquipmentName` varchar(100),
	`Carrier_Id` varchar(100),
	`Carrier_rfid` varchar(100),
	`Carrier_Name` varchar(100),
	`Carrier_Deptid` varchar(100),
	`Carrier_DeptName` varchar(100),
	`Carrier_type` varchar(255),
	`isOperation` varchar(10),
	`remark` varchar(100),
	`CreateTime` datetime,
	CONSTRAINT `door_alarmrecord_Alarmid` PRIMARY KEY(`Alarmid`)
);
--> statement-breakpoint
CREATE TABLE `door_equipment` (
	`equipmentid` int AUTO_INCREMENT NOT NULL,
	`equipment_name` varchar(100),
	`addressip` varchar(100),
	`type` int,
	`fid` int,
	`status` varchar(100),
	`equipment_addr` varchar(100),
	`equipment_Port` varchar(100),
	`equipment_txid` varchar(100),
	`remark` varchar(100),
	`macAddress` varchar(100),
	`macIp` varchar(100),
	`Alarm_switch` int,
	`CreatorTime` datetime,
	`equipment_In` int,
	`equipment_InIP` varchar(100),
	`equipment_Out` int,
	`equipment_OutIp` varchar(100),
	`equipment_Type` int,
	`deviceUserName` varchar(100),
	`deviceUserPwd` varchar(100),
	`devicePort` varchar(100),
	CONSTRAINT `door_equipment_equipmentid` PRIMARY KEY(`equipmentid`)
);
--> statement-breakpoint
CREATE TABLE `door_read_record` (
	`ReadID` int AUTO_INCREMENT NOT NULL,
	`ReadCreateTine` datetime,
	`ReadRfid` varchar(100),
	`EquipmentID` int,
	`EquipmentName` varchar(100),
	`remark` varchar(100),
	CONSTRAINT `door_read_record_ReadID` PRIMARY KEY(`ReadID`)
);
--> statement-breakpoint
CREATE TABLE `door_rfidrecord` (
	`Record_id` int AUTO_INCREMENT NOT NULL,
	`EquipmentId` varchar(100),
	`EquipmentName` varchar(100),
	`Carrier_Id` varchar(100),
	`Carrier_Name` varchar(100),
	`Carrier_rfid` varchar(100),
	`Carrier_Deptid` varchar(100),
	`Carrier_DeptName` varchar(100),
	`Carrier_type` varchar(255),
	`equipment_Type` varchar(100),
	`type` varchar(100),
	`is_alarm` varchar(100),
	`alarmid` varchar(100),
	`CreatorTime` datetime,
	`is_Register` varchar(255),
	CONSTRAINT `door_rfidrecord_Record_id` PRIMARY KEY(`Record_id`)
);
--> statement-breakpoint
CREATE TABLE `door_rfidregister` (
	`register_id` int AUTO_INCREMENT NOT NULL,
	`Carrier_ID` varchar(100),
	`Carrier_Deptid_ID` varchar(50),
	`start_time` varchar(100),
	`end_time` varchar(100),
	`reamrk` varchar(100),
	`create_userid` varchar(100),
	`CreatorTime` datetime,
	`DeleteTime` datetime,
	CONSTRAINT `door_rfidregister_register_id` PRIMARY KEY(`register_id`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_blob_triggers` (
	`sched_name` varchar(120) NOT NULL,
	`trigger_name` varchar(200) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	`blob_data` blob,
	CONSTRAINT `qrtz_blob_triggers_sched_name_trigger_name_trigger_group` PRIMARY KEY(`sched_name`,`trigger_name`,`trigger_group`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_calendars` (
	`sched_name` varchar(120) NOT NULL,
	`calendar_name` varchar(200) NOT NULL,
	`calendar` blob NOT NULL,
	CONSTRAINT `qrtz_calendars_sched_name_calendar_name` PRIMARY KEY(`sched_name`,`calendar_name`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_cron_triggers` (
	`sched_name` varchar(120) NOT NULL,
	`trigger_name` varchar(200) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	`cron_expression` varchar(200) NOT NULL,
	`time_zone_id` varchar(80),
	CONSTRAINT `qrtz_cron_triggers_sched_name_trigger_name_trigger_group` PRIMARY KEY(`sched_name`,`trigger_name`,`trigger_group`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_fired_triggers` (
	`sched_name` varchar(120) NOT NULL,
	`entry_id` varchar(95) NOT NULL,
	`trigger_name` varchar(200) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	`instance_name` varchar(200) NOT NULL,
	`fired_time` bigint NOT NULL,
	`sched_time` bigint NOT NULL,
	`priority` int NOT NULL,
	`state` varchar(16) NOT NULL,
	`job_name` varchar(200),
	`job_group` varchar(200),
	`is_nonconcurrent` varchar(1),
	`requests_recovery` varchar(1),
	CONSTRAINT `qrtz_fired_triggers_sched_name_entry_id` PRIMARY KEY(`sched_name`,`entry_id`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_job_details` (
	`sched_name` varchar(120) NOT NULL,
	`job_name` varchar(200) NOT NULL,
	`job_group` varchar(200) NOT NULL,
	`description` varchar(250),
	`job_class_name` varchar(250) NOT NULL,
	`is_durable` varchar(1) NOT NULL,
	`is_nonconcurrent` varchar(1) NOT NULL,
	`is_update_data` varchar(1) NOT NULL,
	`requests_recovery` varchar(1) NOT NULL,
	`job_data` blob,
	CONSTRAINT `qrtz_job_details_sched_name_job_name_job_group` PRIMARY KEY(`sched_name`,`job_name`,`job_group`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_locks` (
	`sched_name` varchar(120) NOT NULL,
	`lock_name` varchar(40) NOT NULL,
	CONSTRAINT `qrtz_locks_sched_name_lock_name` PRIMARY KEY(`sched_name`,`lock_name`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_paused_trigger_grps` (
	`sched_name` varchar(120) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	CONSTRAINT `qrtz_paused_trigger_grps_sched_name_trigger_group` PRIMARY KEY(`sched_name`,`trigger_group`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_scheduler_state` (
	`sched_name` varchar(120) NOT NULL,
	`instance_name` varchar(200) NOT NULL,
	`last_checkin_time` bigint NOT NULL,
	`checkin_interval` bigint NOT NULL,
	CONSTRAINT `qrtz_scheduler_state_sched_name_instance_name` PRIMARY KEY(`sched_name`,`instance_name`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_simple_triggers` (
	`sched_name` varchar(120) NOT NULL,
	`trigger_name` varchar(200) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	`repeat_count` bigint NOT NULL,
	`repeat_interval` bigint NOT NULL,
	`times_triggered` bigint NOT NULL,
	CONSTRAINT `qrtz_simple_triggers_sched_name_trigger_name_trigger_group` PRIMARY KEY(`sched_name`,`trigger_name`,`trigger_group`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_simprop_triggers` (
	`sched_name` varchar(120) NOT NULL,
	`trigger_name` varchar(200) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	`str_prop_1` varchar(512),
	`str_prop_2` varchar(512),
	`str_prop_3` varchar(512),
	`int_prop_1` int,
	`int_prop_2` int,
	`long_prop_1` bigint,
	`long_prop_2` bigint,
	`dec_prop_1` decimal(13,4),
	`dec_prop_2` decimal(13,4),
	`bool_prop_1` varchar(1),
	`bool_prop_2` varchar(1),
	CONSTRAINT `qrtz_simprop_triggers_sched_name_trigger_name_trigger_group` PRIMARY KEY(`sched_name`,`trigger_name`,`trigger_group`)
);
--> statement-breakpoint
CREATE TABLE `qrtz_triggers` (
	`sched_name` varchar(120) NOT NULL,
	`trigger_name` varchar(200) NOT NULL,
	`trigger_group` varchar(200) NOT NULL,
	`job_name` varchar(200) NOT NULL,
	`job_group` varchar(200) NOT NULL,
	`description` varchar(250),
	`next_fire_time` bigint,
	`prev_fire_time` bigint,
	`priority` int,
	`trigger_state` varchar(16) NOT NULL,
	`trigger_type` varchar(8) NOT NULL,
	`start_time` bigint NOT NULL,
	`end_time` bigint,
	`calendar_name` varchar(200),
	`misfire_instr` smallint,
	`job_data` blob,
	CONSTRAINT `qrtz_triggers_sched_name_trigger_name_trigger_group` PRIMARY KEY(`sched_name`,`trigger_name`,`trigger_group`)
);
--> statement-breakpoint
CREATE TABLE `rfid_cabinet` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(20),
	`State` varchar(10),
	`TypeClass` varchar(255),
	`fid` int NOT NULL DEFAULT 0,
	`cabIndex` varchar(20),
	`cabAddr` varchar(15),
	`RDAddr` varchar(15),
	`RDAddr2` varchar(15),
	`RFAD_Com` varchar(20),
	`RFAD_baudrate` varchar(20),
	`operateOut` varchar(20),
	`openDoor` varchar(10),
	`fingerServer` varchar(15),
	`SecretLevel` varchar(50),
	`Classification` varchar(50),
	`dept_id` bigint,
	CONSTRAINT `rfid_cabinet_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `rfid_cabinetdoor` (
	`Id` int AUTO_INCREMENT NOT NULL,
	`CabinetId` int,
	`Name` int,
	`State` varchar(10),
	`Kgbh` varchar(255),
	`Kgzt` varchar(255),
	`bindingType` bigint(1) unsigned zerofill DEFAULT 0,
	`FolderPath` varchar(255),
	`OrderIndex` varchar(255),
	`txAddr` varchar(255),
	`txId` varchar(255),
	`viewName` varchar(255),
	CONSTRAINT `rfid_cabinetdoor_Id` PRIMARY KEY(`Id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_card_user` (
	`CardId` int AUTO_INCREMENT NOT NULL,
	`Userid` int,
	`CardData` varchar(255),
	`CreateDate` datetime,
	CONSTRAINT `rfid_card_user_CardId` PRIMARY KEY(`CardId`)
);
--> statement-breakpoint
CREATE TABLE `rfid_door_dept` (
	`dd_id` bigint AUTO_INCREMENT NOT NULL,
	`DoorID` int,
	`deptid` int,
	CONSTRAINT `rfid_door_dept_dd_id` PRIMARY KEY(`dd_id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_door_user` (
	`du_id` bigint AUTO_INCREMENT NOT NULL,
	`DoorID` int,
	`Userid` int,
	CONSTRAINT `rfid_door_user_du_id` PRIMARY KEY(`du_id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_finger_user` (
	`FingerID` int AUTO_INCREMENT NOT NULL,
	`Userid` int,
	`order` int,
	`FingerData` varchar(3000),
	`CreateDate` datetime,
	CONSTRAINT `rfid_finger_user_FingerID` PRIMARY KEY(`FingerID`)
);
--> statement-breakpoint
CREATE TABLE `rfid_operation_record` (
	`recordId` int AUTO_INCREMENT NOT NULL,
	`operationid` varchar(50),
	`UserID` varchar(255),
	`CreateDate` varchar(255),
	`Type` varchar(255),
	`cadinetID` varchar(255),
	`doorid` varchar(11),
	`content` varchar(255),
	CONSTRAINT `rfid_operation_record_recordId` PRIMARY KEY(`recordId`)
);
--> statement-breakpoint
CREATE TABLE `rfid_remove_carrier` (
	`Carrier_ID` int AUTO_INCREMENT NOT NULL,
	`carrier_rfid` varchar(128),
	`cabinet_id` varchar(20),
	`cabinet_door_id` varchar(20),
	`carrier_p_status` varchar(255),
	`user_id` bigint,
	`add_user` bigint,
	`type` tinyint,
	`remark` varchar(255),
	`create_time` datetime,
	`name` varchar(255),
	`record_id` bigint,
	CONSTRAINT `rfid_remove_carrier_Carrier_ID` PRIMARY KEY(`Carrier_ID`)
);
--> statement-breakpoint
CREATE TABLE `rfid_remove_document` (
	`doc_id` bigint AUTO_INCREMENT NOT NULL,
	`doc_name` varchar(200) NOT NULL,
	`doc_secret_level` int,
	`doc_type` varchar(10),
	`doc_rfid` varchar(128),
	`remark` varchar(100),
	`doc_p_status` int DEFAULT 1,
	`user_id` bigint,
	`binding_id` bigint NOT NULL,
	`cabinet_id` varchar(20),
	`cabinet_door_id` varchar(20),
	`update_time` datetime,
	`create_time` datetime NOT NULL,
	`IS_one` varchar(255) DEFAULT 0,
	`doc_last_time` datetime,
	`end_time` datetime,
	`record_id` bigint,
	`binding_dept_id` int,
	`bindingType` int,
	CONSTRAINT `rfid_remove_document_doc_id` PRIMARY KEY(`doc_id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_remove_record` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`remove_time` datetime,
	`user_id` bigint,
	CONSTRAINT `rfid_remove_record_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_rfid_record` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` bigint,
	`operationID` varchar(50),
	`cabinetId` int,
	`cabDoorId` int,
	`RFIDId` varchar(50),
	`createTime` datetime,
	`handleID` varchar(50) DEFAULT -1,
	`isOpen` varchar(10),
	`isBorrow` varchar(10),
	`type` tinyint,
	`user_name` varchar(255),
	`user_dept_name` varchar(255),
	`doc_car_name` varchar(255),
	`doccar_dept_name` varchar(255),
	`cab_name` varchar(255),
	`cabdoor_name` varchar(255),
	CONSTRAINT `rfid_rfid_record_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_switch_record` (
	`Id` int AUTO_INCREMENT NOT NULL,
	`CabinetId` varchar(255),
	`CabinetDoorId` varchar(255),
	`operationID` varchar(50),
	`userID` int,
	`TYPE` varchar(255),
	`content` varchar(255),
	`Datetime` varchar(255),
	CONSTRAINT `rfid_switch_record_Id` PRIMARY KEY(`Id`)
);
--> statement-breakpoint
CREATE TABLE `rfid_tips_alarm_record` (
	`recordId` int AUTO_INCREMENT NOT NULL,
	`Alarm_Type` varchar(255),
	`Type` int DEFAULT 0,
	`UserID` int,
	`operationid` varchar(50),
	`CreateDate` datetime,
	`Handle_UserID` int,
	`Handle_operationid` varchar(50),
	`Handle_Date` datetime,
	`cadinetID` int DEFAULT 0,
	`doorid` int DEFAULT 0,
	`content` varchar(255),
	`contentType` tinyint,
	`Rfid` varchar(255),
	`groupid` bigint,
	`docId` bigint,
	`doc_car_name` varchar(255),
	`dept_name` varchar(255),
	`car_user_name` varchar(255),
	`cab_name` varchar(255),
	`cabdoor_name` varchar(255),
	`ope_user_name` varchar(255),
	`cabdoor_User_name` varchar(255),
	`cabdoor_dept_name` varchar(255),
	`isOperation` tinyint DEFAULT 0,
	CONSTRAINT `rfid_tips_alarm_record_recordId` PRIMARY KEY(`recordId`)
);
--> statement-breakpoint
CREATE TABLE `rfid_tips_record` (
	`recordId` int AUTO_INCREMENT NOT NULL,
	`UserID` int,
	`operationid` varchar(50),
	`CreateDate` datetime,
	`Handle_UserID` int,
	`Handle_operationid` varchar(50),
	`Handle_Date` datetime,
	`cadinetID` int DEFAULT 0,
	`doorid` int DEFAULT 0,
	`content` varchar(255),
	`contentType` tinyint,
	`Rfid` varchar(255),
	`groupid` bigint,
	`docId` bigint,
	`doc_car_name` varchar(255),
	`dept_name` varchar(255),
	`car_user_name` varchar(255),
	`cab_name` varchar(255),
	`cabdoor_name` varchar(255),
	`ope_user_name` varchar(255),
	`cabdoor_User_name` varchar(255),
	`cabdoor_dept_name` varchar(255),
	`isOperation` tinyint DEFAULT 0,
	CONSTRAINT `rfid_tips_record_recordId` PRIMARY KEY(`recordId`)
);
--> statement-breakpoint
CREATE TABLE `sys_config` (
	`config_id` int AUTO_INCREMENT NOT NULL,
	`config_name` varchar(100) DEFAULT '',
	`config_key` varchar(100) DEFAULT '',
	`config_value` varchar(100) DEFAULT '',
	`config_type` char(1) DEFAULT 'N',
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500),
	CONSTRAINT `sys_config_config_id` PRIMARY KEY(`config_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_dept` (
	`dept_id` bigint AUTO_INCREMENT NOT NULL,
	`parent_id` bigint DEFAULT 0,
	`ancestors` varchar(50) DEFAULT '',
	`dept_name` varchar(30) DEFAULT '',
	`order_num` int DEFAULT 0,
	`leader` varchar(20),
	`phone` varchar(11),
	`email` varchar(50),
	`status` char(1) DEFAULT 0,
	`del_flag` char(1) DEFAULT 0,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`level` tinyint,
	`code` int DEFAULT 0,
	CONSTRAINT `sys_dept_dept_id` PRIMARY KEY(`dept_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_dict_data` (
	`dict_code` bigint AUTO_INCREMENT NOT NULL,
	`dict_sort` int DEFAULT 0,
	`dict_label` varchar(100) DEFAULT '',
	`dict_value` varchar(100) DEFAULT '',
	`dict_type` varchar(100) DEFAULT '',
	`css_class` varchar(100),
	`list_class` varchar(100),
	`is_default` char(1) DEFAULT 'N',
	`status` char(1) DEFAULT 0,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500),
	CONSTRAINT `sys_dict_data_dict_code` PRIMARY KEY(`dict_code`)
);
--> statement-breakpoint
CREATE TABLE `sys_dict_type` (
	`dict_id` bigint AUTO_INCREMENT NOT NULL,
	`dict_name` varchar(100) DEFAULT '',
	`dict_type` varchar(100) DEFAULT '',
	`status` char(1) DEFAULT 0,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500),
	CONSTRAINT `sys_dict_type_dict_id` PRIMARY KEY(`dict_id`),
	CONSTRAINT `dict_type` UNIQUE(`dict_type`)
);
--> statement-breakpoint
CREATE TABLE `sys_file_info` (
	`file_id` int AUTO_INCREMENT NOT NULL,
	`file_name` varchar(50) DEFAULT '',
	`file_path` varchar(255) DEFAULT '',
	CONSTRAINT `sys_file_info_file_id` PRIMARY KEY(`file_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_job` (
	`job_id` bigint AUTO_INCREMENT NOT NULL,
	`job_name` varchar(64) NOT NULL DEFAULT '',
	`job_group` varchar(64) NOT NULL DEFAULT '',
	`method_name` varchar(500) DEFAULT '',
	`method_params` varchar(50),
	`cron_expression` varchar(255) DEFAULT '',
	`misfire_policy` varchar(20) DEFAULT 3,
	`concurrent` char(1) DEFAULT 1,
	`status` char(1) DEFAULT 0,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500) DEFAULT '',
	CONSTRAINT `sys_job_job_id_job_name_job_group` PRIMARY KEY(`job_id`,`job_name`,`job_group`)
);
--> statement-breakpoint
CREATE TABLE `sys_job_log` (
	`job_log_id` bigint AUTO_INCREMENT NOT NULL,
	`job_name` varchar(64) NOT NULL,
	`job_group` varchar(64) NOT NULL,
	`method_name` varchar(500),
	`method_params` varchar(50),
	`job_message` varchar(500),
	`status` char(1) DEFAULT 0,
	`exception_info` varchar(2000) DEFAULT '',
	`create_time` datetime,
	CONSTRAINT `sys_job_log_job_log_id` PRIMARY KEY(`job_log_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_logininfor` (
	`info_id` bigint AUTO_INCREMENT NOT NULL,
	`login_name` varchar(50) DEFAULT '',
	`ipaddr` varchar(50) DEFAULT '',
	`login_location` varchar(255) DEFAULT '',
	`browser` varchar(50) DEFAULT '',
	`os` varchar(50) DEFAULT '',
	`status` char(1) DEFAULT 0,
	`msg` varchar(255) DEFAULT '',
	`login_time` datetime,
	CONSTRAINT `sys_logininfor_info_id` PRIMARY KEY(`info_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_menu` (
	`menu_id` bigint AUTO_INCREMENT NOT NULL,
	`menu_name` varchar(50) NOT NULL,
	`parent_id` bigint DEFAULT 0,
	`order_num` int DEFAULT 0,
	`url` varchar(200) DEFAULT '#',
	`menu_type` char(1) DEFAULT '',
	`visible` char(1) DEFAULT 0,
	`perms` varchar(100),
	`icon` varchar(100) DEFAULT '#',
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500) DEFAULT '',
	CONSTRAINT `sys_menu_menu_id` PRIMARY KEY(`menu_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_notice` (
	`notice_id` int AUTO_INCREMENT NOT NULL,
	`notice_title` varchar(50) NOT NULL,
	`notice_type` char(1) NOT NULL,
	`notice_content` varchar(2000),
	`status` char(1) DEFAULT 0,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(255),
	CONSTRAINT `sys_notice_notice_id` PRIMARY KEY(`notice_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_oper_log` (
	`oper_id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(50) DEFAULT '',
	`business_type` int DEFAULT 0,
	`method` varchar(100) DEFAULT '',
	`operator_type` int DEFAULT 0,
	`oper_name` varchar(50) DEFAULT '',
	`dept_name` varchar(50) DEFAULT '',
	`oper_url` varchar(255) DEFAULT '',
	`oper_ip` varchar(50) DEFAULT '',
	`oper_location` varchar(255) DEFAULT '',
	`oper_param` varchar(2000) DEFAULT '',
	`status` int DEFAULT 0,
	`error_msg` varchar(2000) DEFAULT '',
	`oper_time` datetime,
	CONSTRAINT `sys_oper_log_oper_id` PRIMARY KEY(`oper_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_post` (
	`post_id` bigint AUTO_INCREMENT NOT NULL,
	`post_code` varchar(64) NOT NULL,
	`post_name` varchar(50) NOT NULL,
	`post_sort` int NOT NULL,
	`status` char(1) NOT NULL,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500),
	CONSTRAINT `sys_post_post_id` PRIMARY KEY(`post_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_role` (
	`role_id` bigint AUTO_INCREMENT NOT NULL,
	`role_name` varchar(30) NOT NULL,
	`role_key` varchar(100) NOT NULL,
	`role_sort` int NOT NULL,
	`data_scope` char(1) DEFAULT 1,
	`status` char(1) NOT NULL,
	`del_flag` char(1) DEFAULT 0,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500),
	CONSTRAINT `sys_role_role_id` PRIMARY KEY(`role_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_role_dept` (
	`role_id` bigint NOT NULL,
	`dept_id` bigint NOT NULL,
	CONSTRAINT `sys_role_dept_role_id_dept_id` PRIMARY KEY(`role_id`,`dept_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_role_menu` (
	`role_id` bigint NOT NULL,
	`menu_id` bigint NOT NULL,
	CONSTRAINT `sys_role_menu_role_id_menu_id` PRIMARY KEY(`role_id`,`menu_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_user` (
	`user_id` bigint AUTO_INCREMENT NOT NULL,
	`dept_id` bigint,
	`login_name` varchar(30) NOT NULL,
	`user_name` varchar(30) NOT NULL,
	`user_type` varchar(2) DEFAULT 0,
	`email` varchar(50) DEFAULT '',
	`phonenumber` varchar(11) DEFAULT '',
	`sex` char(1) DEFAULT 0,
	`avatar` varchar(100) DEFAULT '',
	`password` varchar(50) DEFAULT '',
	`salt` varchar(20) DEFAULT '',
	`status` char(1) DEFAULT 0,
	`del_flag` char(1) DEFAULT 0,
	`login_ip` varchar(50) DEFAULT '',
	`login_date` datetime,
	`create_by` varchar(64) DEFAULT '',
	`create_time` datetime,
	`update_by` varchar(64) DEFAULT '',
	`update_time` datetime,
	`remark` varchar(500) DEFAULT '',
	`type` int DEFAULT 1,
	`code` varchar(255),
	CONSTRAINT `sys_user_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_user_online` (
	`sessionId` varchar(50) NOT NULL DEFAULT '',
	`login_name` varchar(50) DEFAULT '',
	`dept_name` varchar(50) DEFAULT '',
	`ipaddr` varchar(50) DEFAULT '',
	`login_location` varchar(255) DEFAULT '',
	`browser` varchar(50) DEFAULT '',
	`os` varchar(50) DEFAULT '',
	`status` varchar(10) DEFAULT '',
	`start_timestamp` datetime,
	`last_access_time` datetime,
	`expire_time` int DEFAULT 0,
	CONSTRAINT `sys_user_online_sessionId` PRIMARY KEY(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `sys_user_post` (
	`user_id` bigint NOT NULL,
	`post_id` bigint NOT NULL,
	CONSTRAINT `sys_user_post_user_id_post_id` PRIMARY KEY(`user_id`,`post_id`)
);
--> statement-breakpoint
CREATE TABLE `sys_user_role` (
	`user_id` bigint NOT NULL,
	`role_id` bigint NOT NULL,
	CONSTRAINT `sys_user_role_user_id_role_id` PRIMARY KEY(`user_id`,`role_id`)
);
--> statement-breakpoint
ALTER TABLE `qrtz_blob_triggers` ADD CONSTRAINT `qrtz_blob_triggers_ibfk_1` FOREIGN KEY (`sched_name`,`trigger_name`,`trigger_group`) REFERENCES `qrtz_triggers`(`sched_name`,`trigger_name`,`trigger_group`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `qrtz_cron_triggers` ADD CONSTRAINT `qrtz_cron_triggers_ibfk_1` FOREIGN KEY (`sched_name`,`trigger_name`,`trigger_group`) REFERENCES `qrtz_triggers`(`sched_name`,`trigger_name`,`trigger_group`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `qrtz_simple_triggers` ADD CONSTRAINT `qrtz_simple_triggers_ibfk_1` FOREIGN KEY (`sched_name`,`trigger_name`,`trigger_group`) REFERENCES `qrtz_triggers`(`sched_name`,`trigger_name`,`trigger_group`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `qrtz_simprop_triggers` ADD CONSTRAINT `qrtz_simprop_triggers_ibfk_1` FOREIGN KEY (`sched_name`,`trigger_name`,`trigger_group`) REFERENCES `qrtz_triggers`(`sched_name`,`trigger_name`,`trigger_group`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `qrtz_triggers` ADD CONSTRAINT `qrtz_triggers_ibfk_1` FOREIGN KEY (`sched_name`,`job_name`,`job_group`) REFERENCES `qrtz_job_details`(`sched_name`,`job_name`,`job_group`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX `doc_name` ON `doc_document` (`doc_name`);--> statement-breakpoint
CREATE INDEX `rfid` ON `doc_document` (`doc_rfid`);--> statement-breakpoint
CREATE INDEX `sched_name` ON `qrtz_triggers` (`sched_name`,`job_name`,`job_group`);--> statement-breakpoint
CREATE INDEX `index_operationID` ON `rfid_rfid_record` (`operationID`);--> statement-breakpoint
CREATE INDEX `index_rfid` ON `rfid_rfid_record` (`RFIDId`);--> statement-breakpoint
CREATE INDEX `index_type` ON `rfid_tips_alarm_record` (`Type`);
*/